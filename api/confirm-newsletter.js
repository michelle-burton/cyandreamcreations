import { createDecipheriv, createHash } from 'node:crypto'

const sendJson = (response, status, body) => {
  response.setHeader('Cache-Control', 'no-store')
  return response.status(status).json(body)
}

const readToken = (token, secret) => {
  const [ivValue, encryptedValue, tagValue] = String(token || '').split('.')
  if (!ivValue || !encryptedValue || !tagValue) throw new Error('Invalid token')
  const key = createHash('sha256').update(secret).digest()
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivValue, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'))
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64url')),
    decipher.final(),
  ]).toString('utf8')
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  const contactsApiKey = process.env.RESEND_CONTACTS_API_KEY
  const signingSecret = process.env.NEWSLETTER_SIGNING_SECRET
  if (!contactsApiKey || !signingSecret) return sendJson(response, 503, { error: 'The Dream List is not configured.' })

  try {
    const { email, expires } = JSON.parse(readToken(request.body?.token, signingSecret))
    if (!email || !expires) return sendJson(response, 400, { error: 'This confirmation link is not valid.' })
    if (Date.now() > expires) return sendJson(response, 410, { error: 'This confirmation link has expired. Please join again.' })

    const headers = { Authorization: `Bearer ${contactsApiKey}`, 'Content-Type': 'application/json', 'User-Agent': 'Cyan-Dream-Creations/1.0' }
    const createResponse = await fetch('https://api.resend.com/contacts', {
      method: 'POST', headers, body: JSON.stringify({ email, unsubscribed: false }),
    })

    if (createResponse.status === 409) {
      const updateResponse = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
        method: 'PATCH', headers, body: JSON.stringify({ unsubscribed: false }),
      })
      if (!updateResponse.ok) {
        console.error('Dream List update error', updateResponse.status, await updateResponse.text())
        return sendJson(response, 502, { error: 'We could not confirm your place just now. Please try again.' })
      }
    } else if (!createResponse.ok) {
      console.error('Dream List contact error', createResponse.status, await createResponse.text())
      return sendJson(response, 502, { error: 'We could not confirm your place just now. Please try again.' })
    }

    return sendJson(response, 200, { confirmed: true })
  } catch (error) {
    console.error('Dream List confirmation error', error)
    return sendJson(response, 400, { error: 'This confirmation link is not valid. Please join again.' })
  }
}
