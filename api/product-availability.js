const SQUARE_API_VERSION = '2026-08-19'

const PRODUCTS = {
  'radiance-within': 'radiance-within',
}

const getSquareBaseUrl = () => (
  process.env.SQUARE_ENV === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com'
)

const squareRequest = async (path, options = {}) => {
  const response = await fetch(`${getSquareBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': SQUARE_API_VERSION,
      ...options.headers,
    },
  })

  if (!response.ok) throw new Error(`Square request failed with status ${response.status}`)
  return response.json()
}

const findVariationIdBySku = async (sku) => {
  const catalog = await squareRequest('/v2/catalog/search-catalog-items', {
    method: 'POST',
    body: JSON.stringify({ text_filter: sku, product_types: ['REGULAR'], limit: 100 }),
  })

  for (const item of catalog.items || []) {
    for (const variation of item.item_data?.variations || []) {
      if (variation.item_variation_data?.sku === sku) return variation.id
    }
  }

  return null
}

const isVariationInStock = async (variationId) => {
  const locationId = process.env.SQUARE_LOCATION_ID
  const query = new URLSearchParams({ location_ids: locationId })
  const inventory = await squareRequest(`/v2/inventory/${encodeURIComponent(variationId)}?${query}`)

  return (inventory.counts || []).some((count) => (
    count.location_id === locationId
    && count.state === 'IN_STOCK'
    && Number(count.quantity) > 0
  ))
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
    return response.status(503).json({ error: 'Availability is temporarily unavailable' })
  }

  try {
    const entries = await Promise.all(Object.entries(PRODUCTS).map(async ([productId, sku]) => {
      const variationId = await findVariationIdBySku(sku)
      if (!variationId) throw new Error(`No Square variation found for ${productId}`)
      const available = await isVariationInStock(variationId)
      return [productId, available]
    }))

    response.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300')
    return response.status(200).json({ products: Object.fromEntries(entries) })
  } catch (error) {
    console.error('Square availability check failed:', error.message)
    return response.status(503).json({ error: 'Availability is temporarily unavailable' })
  }
}
