import { randomUUID } from 'node:crypto'

const flatShippingCents = 995

const catalog = {
  'radiance-within': {
    name: 'Radiance Within Sun Catcher',
    priceCents: 4200,
    maxQuantity: 1,
  },
}

const sendJson = (response, status, body) => {
  response.status(status).json(body)
}

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const formatMoney = (cents) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(cents / 100)

const emailFrame = ({ eyebrow, title, body }) => `
  <!doctype html>
  <html lang="en">
    <body style="margin:0;background:#050d1c;color:#dbe7f5;font-family:Arial,sans-serif;">
      <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(eyebrow)}</div>
      <div style="padding:36px 16px;">
        <div style="max-width:640px;margin:0 auto;border:1px solid #c99832;border-radius:22px;overflow:hidden;background:#071426;">
          <div style="padding:42px 34px;text-align:center;border-bottom:1px solid #6f5522;">
            <div style="color:#58d9eb;font-size:13px;letter-spacing:4px;text-transform:uppercase;">${escapeHtml(eyebrow)}</div>
            <div style="color:#e9b94f;font-size:26px;margin:18px 0 8px;">✦</div>
            <h1 style="margin:0;color:#f2ce78;font-family:Georgia,serif;font-size:34px;font-weight:normal;">${escapeHtml(title)}</h1>
          </div>
          <div style="padding:34px;line-height:1.7;font-size:16px;">${body}</div>
          <div style="padding:22px 34px;text-align:center;color:#7f91a7;font-size:12px;letter-spacing:2px;text-transform:uppercase;border-top:1px solid #24334a;">
            Cyan Dream Creations · Made with intention
          </div>
        </div>
      </div>
    </body>
  </html>`

const sendOrderEmail = async ({ apiKey, from, to, subject, html, text, idempotencyKey }) => {
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  })

  if (!resendResponse.ok) {
    const error = await resendResponse.text()
    throw new Error(`Resend rejected an order email: ${resendResponse.status} ${error}`)
  }
}

const sendOrderEmails = async ({ paymentId, customer, orderItems, subtotalCents, totalCents }) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.ORDER_FROM_EMAIL
  const ownerEmail = process.env.ORDER_NOTIFICATION_EMAIL
  if (!apiKey || !from || !ownerEmail) throw new Error('Order email environment variables are incomplete.')

  const safeName = escapeHtml(`${customer.firstName} ${customer.lastName}`.trim())
  const safeEmail = escapeHtml(customer.email)
  const address = [
    customer.addressLine1,
    customer.addressLine2,
    `${customer.city}, ${customer.state} ${customer.postalCode}`,
  ].filter(Boolean).map(escapeHtml).join('<br>')
  const plainAddress = [
    customer.addressLine1,
    customer.addressLine2,
    `${customer.city}, ${customer.state} ${customer.postalCode}`,
  ].filter(Boolean).join('\n')
  const itemRows = orderItems.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #24334a;">${item.quantity} × ${escapeHtml(item.name)}</td>
      <td style="padding:12px 0;border-bottom:1px solid #24334a;text-align:right;">${formatMoney(item.lineTotalCents)}</td>
    </tr>`).join('')
  const totals = `
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:18px 0;color:#dbe7f5;">
      ${itemRows}
      <tr><td style="padding-top:14px;">Subtotal</td><td style="padding-top:14px;text-align:right;">${formatMoney(subtotalCents)}</td></tr>
      <tr><td>U.S. flat-rate shipping</td><td style="text-align:right;">${formatMoney(flatShippingCents)}</td></tr>
      <tr><td style="padding-top:12px;color:#f2ce78;font-weight:bold;">Total</td><td style="padding-top:12px;text-align:right;color:#f2ce78;font-weight:bold;">${formatMoney(totalCents)}</td></tr>
    </table>`
  const plainItems = orderItems
    .map((item) => `${item.quantity} × ${item.name} — ${formatMoney(item.lineTotalCents)}`)
    .join('\n')
  const plainTotals = `${plainItems}\nSubtotal — ${formatMoney(subtotalCents)}\nU.S. flat-rate shipping — ${formatMoney(flatShippingCents)}\nTotal — ${formatMoney(totalCents)}`

  const customerHtml = emailFrame({
    eyebrow: 'Order received',
    title: 'Your light is on its way.',
    body: `
      <p style="margin-top:0;">Dear ${escapeHtml(customer.firstName)},</p>
      <p>Thank you for choosing a Cyan Dream creation. Your payment was received successfully, and your order is now being prepared with care.</p>
      ${totals}
      <p style="color:#58d9eb;margin-bottom:6px;">Shipping to</p>
      <p style="margin-top:0;">${safeName}<br>${address}</p>
      <p>We’ll send another note when your order ships.</p>
      <p style="color:#7f91a7;font-size:13px;">Payment reference: ${escapeHtml(paymentId)}</p>`,
  })
  const customerText = `CYAN DREAM CREATIONS

Your light is on its way.

Dear ${customer.firstName},

Thank you for choosing a Cyan Dream creation. Your payment was received successfully, and your order is now being prepared with care.

ORDER SUMMARY
${plainTotals}

SHIPPING TO
${customer.firstName} ${customer.lastName}
${plainAddress}

We’ll send another note when your order ships.

Payment reference: ${paymentId}

Cyan Dream Creations · Made with intention`

  const ownerHtml = emailFrame({
    eyebrow: 'A new light has found a home',
    title: 'New order received',
    body: `
      <p style="margin-top:0;"><strong style="color:#f2ce78;">${safeName}</strong> completed an order.</p>
      ${totals}
      <p style="color:#58d9eb;margin-bottom:6px;">Customer</p>
      <p style="margin-top:0;">${safeName}<br>${safeEmail}</p>
      <p style="color:#58d9eb;margin-bottom:6px;">Ship to</p>
      <p style="margin-top:0;">${address}</p>
      <p style="color:#7f91a7;font-size:13px;">Square payment: ${escapeHtml(paymentId)}</p>`,
  })
  const ownerText = `CYAN DREAM CREATIONS

New order received

${customer.firstName} ${customer.lastName} completed an order.

ORDER SUMMARY
${plainTotals}

CUSTOMER
${customer.firstName} ${customer.lastName}
${customer.email}

SHIP TO
${plainAddress}

Square payment: ${paymentId}

Cyan Dream Creations · Made with intention`

  await Promise.all([
    sendOrderEmail({
      apiKey,
      from,
      to: customer.email,
      subject: 'Your Cyan Dream Creations order is confirmed',
      html: customerHtml,
      text: customerText,
      idempotencyKey: `customer-${paymentId}`,
    }),
    sendOrderEmail({
      apiKey,
      from,
      to: ownerEmail,
      subject: `New Cyan Dream order from ${customer.firstName} ${customer.lastName}`,
      html: ownerHtml,
      text: ownerText,
      idempotencyKey: `owner-${paymentId}`,
    }),
  ])
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  const squareEnvironment = process.env.SQUARE_ENV || 'sandbox'
  const accessToken = process.env.SQUARE_ACCESS_TOKEN
  const locationId = process.env.SQUARE_LOCATION_ID

  if (!accessToken || !locationId) {
    return sendJson(response, 503, { error: 'Square Sandbox is not configured yet.' })
  }

  if (squareEnvironment === 'production' && process.env.ALLOW_PRODUCTION_PAYMENTS !== 'true') {
    return sendJson(response, 503, { error: 'Production payments are intentionally disabled.' })
  }

  try {
    const { sourceId, items, customer } = request.body || {}
    if (!sourceId || !Array.isArray(items) || items.length === 0 || !customer) {
      return sendJson(response, 400, { error: 'Payment and order details are required.' })
    }

    let subtotalCents = 0
    const orderLines = []
    const orderItems = []
    for (const item of items) {
      const product = catalog[item.productId]
      const quantity = Number(item.quantity)
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.maxQuantity) {
        return sendJson(response, 400, { error: 'The cart contains an unavailable item or quantity.' })
      }
      const lineTotalCents = product.priceCents * quantity
      subtotalCents += lineTotalCents
      orderLines.push(`${quantity} × ${product.name}`)
      orderItems.push({ name: product.name, quantity, lineTotalCents })
    }
    const amount = subtotalCents + flatShippingCents

    const baseUrl = squareEnvironment === 'production'
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com'

    const squareResponse = await fetch(`${baseUrl}/v2/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2026-08-19',
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: randomUUID(),
        amount_money: { amount, currency: 'USD' },
        autocomplete: true,
        location_id: locationId,
        buyer_email_address: customer.email,
        note: `Cyan Dream Creations — ${orderLines.join(', ')} — U.S. flat shipping $9.95`,
        shipping_address: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          address_line_1: customer.addressLine1,
          address_line_2: customer.addressLine2 || undefined,
          locality: customer.city,
          administrative_district_level_1: customer.state,
          postal_code: customer.postalCode,
          country: 'US',
        },
      }),
    })

    const result = await squareResponse.json()
    if (!squareResponse.ok) {
      const message = result.errors?.[0]?.detail || 'Square could not complete the test payment.'
      return sendJson(response, squareResponse.status, { error: message })
    }

    let emailStatus = 'sent'
    try {
      await sendOrderEmails({
        paymentId: result.payment.id,
        customer,
        orderItems,
        subtotalCents,
        totalCents: amount,
      })
    } catch (emailError) {
      emailStatus = 'delayed'
      console.error('Order email error', emailError)
    }

    return sendJson(response, 200, {
      paymentId: result.payment.id,
      status: result.payment.status,
      amount: result.payment.amount_money,
      environment: squareEnvironment,
      emailStatus,
    })
  } catch (error) {
    console.error('Square payment error', error)
    return sendJson(response, 500, { error: 'The payment service is temporarily unavailable.' })
  }
}
