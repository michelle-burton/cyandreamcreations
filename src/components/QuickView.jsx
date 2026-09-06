import { useEffect } from 'react'
import { formatPrice, isPurchasable } from '../data/products.js'
import ProductMediaGallery from './ProductMediaGallery.jsx'
import ProductStatus from './ProductStatus.jsx'

function QuickView({ product, onClose, onAddToCart }) {
  const canPurchase = isPurchasable(product)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="quick-view-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="quick-view-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="quick-view-heading">
          <span aria-hidden="true">✦</span>
          <p>Quick View</p>
          <span aria-hidden="true">✦</span>
        </div>
        <button className="quick-view-close" type="button" onClick={onClose} aria-label="Close quick view">×</button>

        <div className="row g-4 g-xl-5">
          <div className="col-lg-7">
            <ProductMediaGallery product={product} />
          </div>

          <div className="col-lg-5 quick-view-copy">
            <p className={`house-label house-${product.house.toLowerCase()}`}>
              <span aria-hidden="true">{product.houseSymbol}</span> House of the {product.house}
            </p>
            <ProductStatus product={product} showMessage={!canPurchase} />
            <h2 id="quick-view-title">{product.name}</h2>
            <div className="product-divider" aria-hidden="true">✦</div>
            <p className="quick-view-price">{formatPrice(product.price)}</p>
            <p className="quick-view-description">{product.shortDescription}</p>
            {product.meaning && <p className="product-meaning">{product.meaning}</p>}
            <ul className="product-facts">
              {product.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>

            {canPurchase && (
              <div className="single-availability">
                <span>Quantity selected in secure checkout</span>
                <strong>In stock</strong>
              </div>
            )}

            <button className="add-cart-button" type="button" onClick={() => onAddToCart(product, 1)} disabled={!canPurchase}>
              <span aria-hidden="true">✦</span> {canPurchase ? 'Add to Cart' : product.status === 'sold-out' ? 'Sold Out' : 'Not Yet Available'} <span aria-hidden="true">✦</span>
            </button>
            <a className="full-detail-link" href={`#product/${product.id}`} onClick={onClose}>View Full Details</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default QuickView
