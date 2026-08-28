import { useState } from 'react'
import { formatPrice } from '../data/products.js'
import ProductMediaGallery from './ProductMediaGallery.jsx'

function ProductDetail({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <main className="product-detail-page" id="top">
      <div className="container-xl">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <a href="#shop">Sun Catchers</a><span aria-hidden="true">✦</span><span>{product.name}</span>
        </nav>

        <section className="product-detail-purchase" aria-labelledby="product-detail-title">
          <div className="row g-4 g-xl-5 align-items-start">
            <div className="col-lg-7">
              <ProductMediaGallery product={product} variant="detail" />
            </div>

            <div className="col-lg-5 detail-purchase-copy">
              <p className={`house-label house-${product.house.toLowerCase()}`}>
                <span aria-hidden="true">{product.houseSymbol}</span> House of the {product.house}
              </p>
              <h1 id="product-detail-title">{product.name}</h1>
              <div className="product-divider" aria-hidden="true">✦</div>
              <p className="quick-view-price">{formatPrice(product.price)}</p>
              <p className="quick-view-description">{product.shortDescription}</p>
              <ul className="product-facts">
                {product.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              <label className="quantity-label" htmlFor="detail-quantity">Quantity</label>
              <div className="quantity-control">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
                <input id="detail-quantity" value={quantity} readOnly aria-label="Quantity" />
                <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button>
              </div>
              <button className="add-cart-button" type="button" onClick={() => onAddToCart(quantity)}>
                <span aria-hidden="true">✦</span> Add to Cart <span aria-hidden="true">✦</span>
              </button>
            </div>
          </div>
        </section>

        {product.story && (
          <section className="product-lore" aria-labelledby="product-story-title">
            <div className="row g-0">
              <div className="col-lg-3 lore-emblem" aria-hidden="true">
                <div className="moon-emblem"><span>☾</span></div>
              </div>
              <div className="col-lg-6 lore-story">
                <p className="section-kicker">The House of the {product.house}</p>
                <h2 id="product-story-title">The Story of the Moonlit Guardian</h2>
                {product.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <aside className="col-lg-3 lore-summary" aria-label={`${product.house} House meaning`}>
                <dl>
                  <div><dt>Energy</dt><dd>{product.lore.energy}</dd></div>
                  <div><dt>Motion</dt><dd>{product.lore.motion}</dd></div>
                  <div><dt>Gift</dt><dd>{product.lore.gift}</dd></div>
                  <div><dt>Question to Carry</dt><dd><em>{product.lore.question}</em></dd></div>
                </dl>
              </aside>
            </div>
            <a className="explore-house-link" href="#oracle">Explore the House of the {product.house} <span aria-hidden="true">✦</span></a>
          </section>
        )}
      </div>
    </main>
  )
}

export default ProductDetail
