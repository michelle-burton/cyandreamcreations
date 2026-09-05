import { createHmac } from 'node:crypto'

// Shared, atomic reservations: serverless instances must never use local counters.
export const reservationScript = `
for i=1,#KEYS do
  if tonumber(redis.call('GET',KEYS[i]) or '0') >= tonumber(ARGV[i*2-1]) then return i end
end
for i=1,#KEYS do
  local count=redis.call('INCR',KEYS[i])
  if count == 1 then redis.call('EXPIRE',KEYS[i],ARGV[i*2]) end
end
return 0`

export async function guardReading(req, env = process.env, request = fetch) {
  const development = env.VERCEL_ENV === 'preview' || (!env.VERCEL && env.NODE_ENV === 'development')
  if (development && env.ORACLE_DEV_UNLIMITED === 'true') return null
  const url = env.STORAGE_KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL
  const token = env.STORAGE_KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN
  // A separate secret is optional; the private Redis credential is a safe fallback.
  const salt = env.ORACLE_LIMIT_SECRET || token
  if (!url || !token || !salt) return { status: 503, error: 'The Oracle is resting while its reading protections are connected.' }
  // Vercel overwrites this header. Never trust the client-supplied x-forwarded-for.
  const ip = env.VERCEL ? req.headers['x-vercel-forwarded-for'] : req.socket?.remoteAddress
  if (typeof ip !== 'string' || !ip) return { status: 503, error: 'The Oracle cannot verify this connection. Please try again later.' }
  const identity = createHmac('sha256', salt).update(ip).digest('hex')
  const now = new Date().toISOString()
  const prefix = `oracle:${env.VERCEL_ENV || 'local'}`
  const keys = [`${prefix}:minute:${identity}`, `${prefix}:day:${now.slice(0,10)}:${identity}`, `${prefix}:month:${now.slice(0,7)}`]
  const cap = Number(env.ORACLE_MONTHLY_READING_LIMIT || 1000)
  if (!Number.isSafeInteger(cap) || cap < 1) return { status: 503, error: 'The Oracle is resting. Please return later.' }
  try {
    const response = await request(url, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', reservationScript, 3, ...keys, 2, 60, 10, 86400, cap, 2764800]),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) throw new Error('limits unavailable')
    const data = await response.json()
    if (![0,1,2,3].includes(data.result) || data.error) throw new Error('invalid reservation')
    if (data.result === 0) return null
    return { status: 429, error: data.result === 3 ? 'This month’s Oracle readings are complete. Please return next month.' : 'Let this reading settle. Please return later for another reflection.' }
  } catch {
    // Fail closed: a counter outage must not become unlimited paid API access.
    return { status: 503, error: 'The Oracle is resting for a moment. Please try again later.' }
  }
}
