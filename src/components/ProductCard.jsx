import { formatPrice } from '../data/products.js'

function ProductCard({ product, onQuickView }) {
  const detailUrl = `#product/${product.id}`

  return (
    <article className="product-card h-100">
      <button
        className="product-image-wrap product-image-button"
        type="button"
        onClick={() => onQuickView(product)}
        aria-label={`Quick view ${product.name}`}
      >
        <img
          src={product.image}
          className="product-image"
          style={{ objectPosition: product.imagePosition, objectFit: product.imageFit || 'cover' }}
          alt={product.name}
        />
        <span className="quick-view-label">Quick View</span>
      </button>

      <div className="product-card-body">
        <p className={`house-label house-${product.house.toLowerCase()}`}>
          <span aria-hidden="true">{product.houseSymbol}</span> House of the {product.house}
        </p>
        <h3><a href={detailUrl}>{product.name}</a></h3>
        <div className="product-divider" aria-hidden="true">✦</div>
        <p className="product-price">{formatPrice(product.price)}</p>
        <div className="product-card-actions">
          <button className="product-button" type="button" onClick={() => onQuickView(product)}>
            Quick View
          </button>
          <a className="product-detail-link" href={detailUrl}>Full Story</a>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
