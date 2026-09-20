export const SQUARE_API_VERSION = '2026-09-16'

export const SQUARE_PRODUCTS = {
  'radiance-within': { sku: 'radiance-within', name: 'Radiance Within Sun Catcher' },
  'solar-radiance': { sku: 'solar-radiance', name: 'Solar Radiance Sun Catcher' },
  'best-friends-light': { sku: 'best-friends-light', name: 'Best Friend’s Light Sun Catcher' },
  'gilded-dusk': { sku: 'gilded-dusk', name: 'Gilded Dusk Sun Catcher' },
  'midnight-wings': { sku: 'midnight-wings', name: 'Midnight Wings Sun Catcher' },
  'circles-of-dreams': { sku: 'circles-of-dreams', name: 'Circles of Dreams Sun Catcher' },
}

const variationCache = new Map()

export const isSquareConfigured = () => Boolean(
  process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID,
)

export const isProductionPaymentAllowed = () => (
  process.env.SQUARE_ENV === 'sandbox'
  || process.env.ALLOW_PRODUCTION_PAYMENTS === 'true'
)

const getSquareBaseUrl = () => (
  process.env.SQUARE_ENV === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com'
)

export const squareRequest = async (path, options = {}) => {
  const response = await fetch(`${getSquareBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': SQUARE_API_VERSION,
      ...options.headers,
    },
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = result.errors?.map((error) => error.detail).filter(Boolean).join('; ')
    throw new Error(detail || `Square request failed with status ${response.status}`)
  }

  return result
}

export const findVariationId = async ({ sku, name }) => {
  if (variationCache.has(sku)) return variationCache.get(sku)

  const skuCatalog = await squareRequest('/v2/catalog/search', {
    method: 'POST',
    body: JSON.stringify({
      object_types: ['ITEM_VARIATION'],
      query: { exact_query: { attribute_name: 'sku', attribute_value: sku } },
      limit: 100,
    }),
  })

  const skuMatch = (skuCatalog.objects || []).find((variation) => (
    variation.item_variation_data?.sku?.toLowerCase() === sku.toLowerCase()
  ))
  if (skuMatch) {
    variationCache.set(sku, skuMatch.id)
    return skuMatch.id
  }

  const nameCatalog = await squareRequest('/v2/catalog/search-catalog-items', {
    method: 'POST',
    body: JSON.stringify({ text_filter: name, product_types: ['REGULAR'], limit: 100 }),
  })

  for (const item of nameCatalog.items || []) {
    if (item.item_data?.name?.toLowerCase() !== name.toLowerCase()) continue
    const variationId = item.item_data?.variations?.[0]?.id
    if (variationId) {
      variationCache.set(sku, variationId)
      return variationId
    }
  }

  return null
}

export const getVariationStock = async (variationId) => {
  const locationId = process.env.SQUARE_LOCATION_ID
  const query = new URLSearchParams({ location_ids: locationId })
  const inventory = await squareRequest(`/v2/inventory/${encodeURIComponent(variationId)}?${query}`)

  return (inventory.counts || [])
    .filter((count) => count.location_id === locationId && count.state === 'IN_STOCK')
    .reduce((total, count) => total + Number(count.quantity || 0), 0)
}
