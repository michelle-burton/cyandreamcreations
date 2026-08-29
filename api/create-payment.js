import { randomUUID } from 'node:crypto'

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

    let amount = 0
    const orderLines = []
    for (const item of items) {
      const product = catalog[item.productId]
      const quantity = Number(item.quantity)
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.maxQuantity) {
        return sendJson(response, 400, { error: 'The cart contains an unavailable item or quantity.' })
      }
      amount += product.priceCents * quantity
      orderLines.push(`${quantity} × ${product.name}`)
    }

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
        note: `Cyan Dream Creations — ${orderLines.join(', ')}`,
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

    return sendJson(response, 200, {
      paymentId: result.payment.id,
      status: result.payment.status,
      amount: result.payment.amount_money,
      environment: squareEnvironment,
    })
  } catch (error) {
    console.error('Square payment error', error)
    return sendJson(response, 500, { error: 'The payment service is temporarily unavailable.' })
  }
}
