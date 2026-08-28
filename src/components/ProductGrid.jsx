import products from '../data/products.js'
import ProductCard from './ProductCard.jsx'

function ProductGrid({ onQuickView }) {
  return (
    <section className="products-section" id="shop" aria-labelledby="products-title">
      <div className="container-xl">
        <header className="section-heading text-center">
          <div className="celestial-divider mx-auto" aria-hidden="true">
            <span />
            <b>✦</b>
            <span />
          </div>
          <p className="section-kicker">Sun Catchers</p>
          <h2 id="products-title">Made for Moments of Wonder</h2>
          <p className="layout-note">Sample content for layout review</p>
        </header>

        <div className="row g-4">
          {products.map((product) => (
            <div className="col-12 col-md-6 col-lg-4" key={product.id}>
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid
