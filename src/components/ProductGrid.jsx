import products from '../data/products.js'
import ProductCard from './ProductCard.jsx'

function ProductGrid({ onQuickView, featured = false }) {
  const visibleProducts = featured ? products.filter((product) => product.status === 'available').slice(0, 1) : products

  return (
    <section className={`products-section${featured ? ' products-featured' : ''}`} id={featured ? 'featured' : 'shop'} aria-labelledby={featured ? 'featured-title' : 'products-title'}>
      <div className="container-xl">
        <header className="section-heading text-center">
          <div className="celestial-divider mx-auto" aria-hidden="true">
            <span />
            <b>✦</b>
            <span />
          </div>
          <p className="section-kicker">{featured ? 'A Featured Light' : 'Sun Catchers'}</p>
          <h2 id={featured ? 'featured-title' : 'products-title'}>{featured ? 'Created to Catch the Light' : 'Made for Moments of Wonder'}</h2>
        </header>

        <div className="row g-4">
          {visibleProducts.map((product) => (
            <div className={featured ? 'col-12 col-md-8 col-lg-5 mx-auto' : 'col-12 col-md-6 col-lg-4'} key={product.id}>
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
        {featured && <div className="featured-shop-link"><a className="dream-button" href="#shop"><span aria-hidden="true">✦</span> View All Sun Catchers <span aria-hidden="true">✦</span></a></div>}
      </div>
    </section>
  )
}

export default ProductGrid
