import { createCipheriv, createHash, randomBytes } from 'node:crypto'

const sendJson = (response, status, body) => {
  response.setHeader('Cache-Control', 'no-store')
  return response.status(status).json(body)
}

const createToken = (value, secret) => {
  const key = createHash('sha256').update(secret).digest()
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return `${iv.toString('base64url')}.${encrypted.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}`
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  const signingSecret = process.env.NEWSLETTER_SIGNING_SECRET
  if (!resendApiKey || !from || !signingSecret) {
    return sendJson(response, 503, { error: 'The Dream List is not configured yet.' })
  }

  const { email: rawEmail, website = '' } = request.body || {}
  if (website) return sendJson(response, 200, { pending: true })

  const email = String(rawEmail || '').trim().toLowerCase()
  if (email.length > 254 || !/^\S+@\S+\.\S+$/.test(email)) {
    return sendJson(response, 400, { error: 'Enter a valid email address.' })
  }

  const token = createToken(JSON.stringify({ email, expires: Date.now() + (24 * 60 * 60 * 1000) }), signingSecret)
  const confirmationUrl = `https://www.cyandreamcreations.com/?newsletter-confirm=${encodeURIComponent(token)}#join`
  const html = `<!doctype html>
    <html lang="en"><body style="margin:0;background:#050d1c;color:#dbe7f5;font-family:Arial,sans-serif;">
      <div style="display:none;max-height:0;overflow:hidden;">Confirm your place on the Cyan Dream List.</div>
      <div style="padding:36px 16px;"><div style="max-width:640px;margin:0 auto;border:1px solid #c99832;border-radius:22px;overflow:hidden;background:#071426;">
        <div style="padding:42px 34px;text-align:center;border-bottom:1px solid #6f5522;">
          <div style="color:#58d9eb;font-size:13px;letter-spacing:4px;text-transform:uppercase;">The Dream List</div>
          <div style="color:#e9b94f;font-size:26px;margin:18px 0 8px;">✦</div>
          <h1 style="margin:0;color:#f2ce78;font-family:Georgia,serif;font-size:34px;font-weight:normal;">Stay close to what is emerging.</h1>
        </div>
        <div style="padding:34px;line-height:1.7;font-size:16px;text-align:center;">
          <p style="margin-top:0;">Confirm that you’d like to receive new sun catchers, Oracle updates, and quiet notes from Cyan Dream Creations.</p>
          <p style="margin:30px 0;"><a href="${confirmationUrl}" style="display:inline-block;padding:14px 24px;border:1px solid #d9a441;border-radius:8px;color:#071426;background:#7fe9f5;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Continue to confirmation</a></p>
          <p style="color:#7f91a7;font-size:13px;">This link expires in 24 hours. If you didn’t request it, simply ignore this email.</p>
        </div>
        <div style="padding:22px 34px;text-align:center;color:#7f91a7;font-size:12px;letter-spacing:2px;text-transform:uppercase;border-top:1px solid #24334a;">Cyan Dream Creations · Made with intention</div>
      </div></div>
    </body></html>`
  const text = `CYAN DREAM CREATIONS\n\nTHE DREAM LIST\n\nStay close to what is emerging.\n\nConfirm that you’d like to receive new sun catchers, Oracle updates, and quiet notes from Cyan Dream Creations.\n\nConfirm your place:\n${confirmationUrl}\n\nThis link expires in 24 hours. If you didn’t request it, simply ignore this email.`

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `dream-list-${createHash('sha256').update(`${email}:${new Date().toISOString().slice(0, 10)}`).digest('hex')}`,
      },
      body: JSON.stringify({ from, to: [email], subject: 'Confirm your place on the Cyan Dream List', html, text }),
    })
    if (!resendResponse.ok) {
      console.error('Dream List email error', resendResponse.status, await resendResponse.text())
      return sendJson(response, 502, { error: 'The confirmation email could not be sent. Please try again.' })
    }
    return sendJson(response, 200, { pending: true })
  } catch (error) {
    console.error('Dream List signup error', error)
    return sendJson(response, 500, { error: 'The Dream List is temporarily unavailable.' })
  }
}
