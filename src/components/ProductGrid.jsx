import products, { applyProductAvailability } from '../data/products.js'
import ProductCard from './ProductCard.jsx'
import floralSpray from '../assets/floral-spray-extracted-v1.png'

function ProductGrid({ onQuickView, availability, featured = false }) {
  const liveProducts = products.map((product) => applyProductAvailability(product, availability))
  const visibleProducts = liveProducts

  return (
    <section className={`products-section${featured ? ' products-featured' : ''}`} id={featured ? 'featured' : 'shop'} aria-labelledby={featured ? 'featured-title' : 'products-title'}>
      {featured && (
        <>
          <img className="section-botanical section-botanical-left" src={floralSpray} alt="" aria-hidden="true" />
          <img className="section-botanical section-botanical-right" src={floralSpray} alt="" aria-hidden="true" />
        </>
      )}
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
            <div className="col-12 col-md-6 col-xl-4" key={product.id}>
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
        {!featured && <a className="section-home-link" href="#top">Return Home <span aria-hidden="true">✦</span></a>}
      </div>
    </section>
  )
}

export default ProductGrid
