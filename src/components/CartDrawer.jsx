import { useEffect } from 'react'
import { formatPrice } from '../data/products.js'

function CartDrawer({ isOpen, items, itemCount, subtotal, onClose, onUpdateQuantity, onRemove, onCheckout }) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.classList.add('cart-open')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('cart-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="cart-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="cart-header">
          <div>
            <p className="section-kicker">Your Selections</p>
            <h2 id="cart-title">Shopping Cart</h2>
          </div>
          <button className="cart-close" type="button" onClick={onClose} aria-label="Close shopping cart">×</button>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span aria-hidden="true">✦</span>
            <h3>Your cart is waiting for light.</h3>
            <p>Explore the sun catchers and choose the piece that speaks to you.</p>
            <button className="dream-button" type="button" onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items" aria-live="polite">
              {items.map(({ product, quantity }) => {
                const maxQuantity = product.inventory ?? 99
                return (
                  <article className="cart-item" key={product.id}>
                    <a className="cart-item-image" href={`#product/${product.id}`} onClick={onClose}>
                      <img src={product.image} alt="" style={{ objectPosition: product.imagePosition, objectFit: product.imageFit || 'cover' }} />
                    </a>
                    <div className="cart-item-copy">
                      <p className={`house-label house-${product.house.toLowerCase()}`}>
                        <span aria-hidden="true">{product.houseSymbol}</span> House of the {product.house}
                      </p>
                      <h3><a href={`#product/${product.id}`} onClick={onClose}>{product.name}</a></h3>
                      <p className="cart-item-price">{formatPrice(product.price)}</p>
                      <div className="cart-item-controls">
                        {maxQuantity === 1 ? (
                          <span className="cart-one-of-kind">Quantity: 1 · One of a kind</span>
                        ) : (
                          <div className="quantity-control cart-quantity">
                            <button type="button" onClick={() => onUpdateQuantity(product.id, quantity - 1)} aria-label={`Decrease ${product.name} quantity`}>−</button>
                            <input value={quantity} readOnly aria-label={`${product.name} quantity`} />
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              aria-label={`Increase ${product.name} quantity`}
                              disabled={quantity >= maxQuantity}
                            >+</button>
                          </div>
                        )}
                        <button className="cart-remove" type="button" onClick={() => onRemove(product.id)}>Remove</button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <footer className="cart-footer">
              <div className="cart-subtotal">
                <span>Subtotal · {itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p>Shipping and taxes are being finalized before production launch.</p>
              <button className="checkout-button" type="button" onClick={onCheckout}>Continue to Sandbox Checkout</button>
              <button className="continue-shopping" type="button" onClick={onClose}>Continue Shopping</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
