import { useEffect, useState } from 'react'
import { formatPrice, isPurchasable } from '../data/products.js'
import ProductMediaGallery from './ProductMediaGallery.jsx'
import ProductStatus from './ProductStatus.jsx'

function QuickView({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const maxQuantity = product.inventory ?? 99
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

            {canPurchase && (maxQuantity === 1 ? (
              <div className="single-availability">
                <span>Quantity: 1</span>
                <strong>One available</strong>
              </div>
            ) : (
              <>
                <label className="quantity-label" htmlFor="quick-view-quantity">Quantity</label>
                <div className="quantity-control">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
                  <input id="quick-view-quantity" value={quantity} readOnly aria-label="Quantity" />
                  <button type="button" onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} aria-label="Increase quantity" disabled={quantity >= maxQuantity}>+</button>
                </div>
              </>
            ))}

            <button className="add-cart-button" type="button" onClick={() => onAddToCart(product, quantity)} disabled={!canPurchase}>
              <span aria-hidden="true">✦</span> {canPurchase ? 'Add to Cart' : 'Not Yet Available'} <span aria-hidden="true">✦</span>
            </button>
            <a className="full-detail-link" href={`#product/${product.id}`} onClick={onClose}>View Full Details</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default QuickView
