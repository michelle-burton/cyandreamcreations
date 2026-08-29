const sendJson = (response, status, body) => {
  response.setHeader('Cache-Control', 'no-store')
  return response.status(status).json(body)
}

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  const ownerEmail = process.env.ORDER_NOTIFICATION_EMAIL
  if (!apiKey || !from || !ownerEmail) return sendJson(response, 503, { error: 'The contact form is not configured.' })

  const { name: rawName, email: rawEmail, subject: rawSubject, message: rawMessage, website = '' } = request.body || {}
  if (website) return sendJson(response, 200, { sent: true })

  const name = String(rawName || '').trim()
  const email = String(rawEmail || '').trim().toLowerCase()
  const subject = String(rawSubject || '').trim()
  const message = String(rawMessage || '').trim()

  if (name.length < 1 || name.length > 100) return sendJson(response, 400, { error: 'Please enter your name.' })
  if (email.length > 254 || !/^\S+@\S+\.\S+$/.test(email)) return sendJson(response, 400, { error: 'Please enter a valid email address.' })
  if (subject.length < 1 || subject.length > 140) return sendJson(response, 400, { error: 'Please enter a short subject.' })
  if (message.length < 10 || message.length > 3000) return sendJson(response, 400, { error: 'Please enter a message between 10 and 3,000 characters.' })

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br>')

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [ownerEmail],
        reply_to: email,
        subject: `Website message: ${subject}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#152033"><h1 style="font-size:22px">New website message</h1><p><strong>From:</strong> ${safeName}<br><strong>Email:</strong> ${safeEmail}<br><strong>Subject:</strong> ${safeSubject}</p><hr><p>${safeMessage}</p></div>`,
        text: `NEW WEBSITE MESSAGE\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      }),
    })

    if (!resendResponse.ok) {
      console.error('Contact email error', resendResponse.status, await resendResponse.text())
      return sendJson(response, 502, { error: 'Your message could not be sent. Please try again.' })
    }
    return sendJson(response, 200, { sent: true })
  } catch (error) {
    console.error('Contact form error', error)
    return sendJson(response, 500, { error: 'The contact form is temporarily unavailable.' })
  }
}
