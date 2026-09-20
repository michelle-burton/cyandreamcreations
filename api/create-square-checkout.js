import { randomUUID } from 'node:crypto'
import {
  findVariationId,
  getVariationStock,
  isProductionPaymentAllowed,
  isSquareConfigured,
  squareRequest,
  SQUARE_PRODUCTS,
} from './_square.js'

const SHIPPING_AMOUNT = 995
const MAX_QUANTITY = 10

const readBody = (request) => {
  if (typeof request.body === 'string') return JSON.parse(request.body)
  return request.body || {}
}

const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Your cart is empty.')

  const quantities = new Map()
  for (const item of items) {
    const productId = typeof item?.productId === 'string' ? item.productId : ''
    const quantity = Number(item?.quantity)
    if (!SQUARE_PRODUCTS[productId]) throw new Error('Your cart contains an unavailable item.')
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new Error('An item in your cart has an invalid quantity.')
    }

    const combinedQuantity = (quantities.get(productId) || 0) + quantity
    if (combinedQuantity > MAX_QUANTITY) throw new Error('An item quantity is too large.')
    quantities.set(productId, combinedQuantity)
  }

  return [...quantities.entries()].map(([productId, quantity]) => ({ productId, quantity }))
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  if (!isSquareConfigured() || !isProductionPaymentAllowed()) {
    return response.status(503).json({ error: 'Secure checkout is temporarily unavailable.' })
  }

  try {
    const cartItems = normalizeItems(readBody(request).items)
    const lineItems = await Promise.all(cartItems.map(async ({ productId, quantity }) => {
      const squareProduct = SQUARE_PRODUCTS[productId]
      const variationId = await findVariationId(squareProduct)
      if (!variationId) throw new Error(`${squareProduct.name} is not connected to checkout yet.`)

      const availableQuantity = await getVariationStock(variationId)
      if (availableQuantity < quantity) {
        throw new Error(`${squareProduct.name} is no longer available in that quantity.`)
      }

      return { catalog_object_id: variationId, quantity: String(quantity) }
    }))

    const siteUrl = (process.env.SITE_URL || 'https://www.cyandreamcreations.com').replace(/\/$/, '')
    const checkout = await squareRequest('/v2/online-checkout/payment-links', {
      method: 'POST',
      body: JSON.stringify({
        idempotency_key: randomUUID(),
        description: 'Cyan Dream Creations website order',
        order: {
          location_id: process.env.SQUARE_LOCATION_ID,
          line_items: lineItems,
        },
        checkout_options: {
          ask_for_shipping_address: true,
          allow_tipping: false,
          enable_coupon: false,
          redirect_url: `${siteUrl}/thank-you`,
          shipping_fee: {
            name: 'USPS Shipping',
            charge: { amount: SHIPPING_AMOUNT, currency: 'USD' },
          },
        },
        payment_note: 'Cyan Dream Creations website order',
      }),
    })

    const checkoutUrl = checkout.payment_link?.url
    if (!checkoutUrl) throw new Error('Square did not return a checkout link.')

    response.setHeader('Cache-Control', 'no-store')
    return response.status(200).json({ url: checkoutUrl })
  } catch (error) {
    console.error('Square checkout creation failed:', error.message)
    const expectedMessage = /cart|quantity|available|connected/i.test(error.message)
      ? error.message
      : 'We could not open secure checkout. Please try again.'
    return response.status(400).json({ error: expectedMessage })
  }
}
