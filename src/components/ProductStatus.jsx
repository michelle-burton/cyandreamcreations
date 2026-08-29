import { getProductStatus } from '../data/products.js'

function ProductStatus({ product, showMessage = false }) {
  const status = getProductStatus(product)

  return (
    <div className={`product-status-wrap status-${product.status || 'available'}`}>
      <span className="product-status"><span aria-hidden="true">✦</span>{status.label}</span>
      {showMessage && <p>{status.message}</p>}
    </div>
  )
}

export default ProductStatus
