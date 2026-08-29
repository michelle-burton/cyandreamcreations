import { createHash, timingSafeEqual } from 'node:crypto'

const sendJson = (response, status, body) => response.status(status).json(body)

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const keysMatch = (provided, expected) => {
  if (!provided || !expected) return false
  const providedBuffer = Buffer.from(provided)
  const expectedBuffer = Buffer.from(expected)
  return providedBuffer.length === expectedBuffer.length
    && timingSafeEqual(providedBuffer, expectedBuffer)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  const adminKey = process.env.SHIPPING_ADMIN_KEY
  const resendApiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  if (!adminKey || !resendApiKey || !from) {
    return sendJson(response, 503, { error: 'The shipping notice service is not configured.' })
  }

  const { key, customerName, customerEmail, trackingNumber, note = '' } = request.body || {}
  if (!keysMatch(key, adminKey)) {
    return sendJson(response, 401, { error: 'The private shipping key is incorrect.' })
  }

  const name = String(customerName || '').trim()
  const email = String(customerEmail || '').trim().toLowerCase()
  const tracking = String(trackingNumber || '').replace(/\s+/g, '').trim()
  const personalNote = String(note || '').trim()

  if (!name || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email)) {
    return sendJson(response, 400, { error: 'Enter the customer’s name and a valid email address.' })
  }
  if (!/^[A-Za-z0-9]{10,40}$/.test(tracking)) {
    return sendJson(response, 400, { error: 'Enter a valid USPS tracking number without punctuation.' })
  }
  if (personalNote.length > 500) {
    return sendJson(response, 400, { error: 'Keep the optional note under 500 characters.' })
  }

  const trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(tracking)}`
  const noteHtml = personalNote
    ? `<p style="margin:22px 0;padding:16px;border-left:2px solid #d9a441;background:#0a1a2f;">${escapeHtml(personalNote).replaceAll('\n', '<br>')}</p>`
    : ''
  const html = `<!doctype html>
    <html lang="en">
      <body style="margin:0;background:#050d1c;color:#dbe7f5;font-family:Arial,sans-serif;">
        <div style="display:none;max-height:0;overflow:hidden;">Your Cyan Dream creation is on its way.</div>
        <div style="padding:36px 16px;">
          <div style="max-width:640px;margin:0 auto;border:1px solid #c99832;border-radius:22px;overflow:hidden;background:#071426;">
            <div style="padding:42px 34px;text-align:center;border-bottom:1px solid #6f5522;">
              <div style="color:#58d9eb;font-size:13px;letter-spacing:4px;text-transform:uppercase;">Shipping update</div>
              <div style="color:#e9b94f;font-size:26px;margin:18px 0 8px;">✦</div>
              <h1 style="margin:0;color:#f2ce78;font-family:Georgia,serif;font-size:34px;font-weight:normal;">Your light is on its way.</h1>
            </div>
            <div style="padding:34px;line-height:1.7;font-size:16px;">
              <p style="margin-top:0;">Dear ${escapeHtml(name)},</p>
              <p>Your Cyan Dream creation has been prepared with care and is now on its journey to you.</p>
              ${noteHtml}
              <p style="color:#58d9eb;margin-bottom:6px;">USPS tracking number</p>
              <p style="margin-top:0;font-family:monospace;overflow-wrap:anywhere;">${escapeHtml(tracking)}</p>
              <p style="text-align:center;margin:30px 0;">
                <a href="${trackingUrl}" style="display:inline-block;padding:14px 24px;border:1px solid #d9a441;border-radius:8px;color:#071426;background:#7fe9f5;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Track your package</a>
              </p>
              <p>USPS tracking may show “Label Created” until the package receives its first carrier scan.</p>
            </div>
            <div style="padding:22px 34px;text-align:center;color:#7f91a7;font-size:12px;letter-spacing:2px;text-transform:uppercase;border-top:1px solid #24334a;">Cyan Dream Creations · Made with intention</div>
          </div>
        </div>
      </body>
    </html>`
  const text = `CYAN DREAM CREATIONS

Your light is on its way.

Dear ${name},

Your Cyan Dream creation has been prepared with care and is now on its journey to you.
${personalNote ? `\n${personalNote}\n` : ''}
USPS TRACKING NUMBER
${tracking}

Track your package:
${trackingUrl}

USPS tracking may show “Label Created” until the package receives its first carrier scan.

Cyan Dream Creations · Made with intention`

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `shipping-${createHash('sha256').update(`${email}:${tracking}`).digest('hex')}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your Cyan Dream creation has shipped',
        html,
        text,
      }),
    })

    if (!resendResponse.ok) {
      console.error('Resend shipping notice error', resendResponse.status, await resendResponse.text())
      return sendJson(response, 502, { error: 'The shipping email could not be sent. Please try again.' })
    }

    return sendJson(response, 200, { sent: true })
  } catch (error) {
    console.error('Shipping notice error', error)
    return sendJson(response, 500, { error: 'The shipping email service is temporarily unavailable.' })
  }
}
