import {
  findVariationId,
  getVariationStock,
  isSquareConfigured,
  SQUARE_PRODUCTS,
} from './_square.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  if (!isSquareConfigured()) {
    return response.status(503).json({ error: 'Availability is temporarily unavailable' })
  }

  try {
    const entries = await Promise.all(Object.entries(SQUARE_PRODUCTS).map(async ([productId, squareProduct]) => {
      const variationId = await findVariationId(squareProduct)
      if (!variationId) throw new Error(`No Square variation found for ${productId}`)
      const stock = await getVariationStock(variationId)
      return [productId, stock > 0]
    }))

    response.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300')
    return response.status(200).json({ products: Object.fromEntries(entries) })
  } catch (error) {
    console.error('Square availability check failed:', error.message)
    return response.status(503).json({ error: 'Availability is temporarily unavailable' })
  }
}
