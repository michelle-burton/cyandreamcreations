import heroSuncatcher from '../assets/hero-suncatcher.png'

const sampleProducts = [
  { name: 'Celestial Prism Sun Catcher', price: '$48.00', position: '64% center' },
  { name: 'Solar Radiance Sun Catcher', price: '$52.00', position: '72% center' },
  { name: 'Tree of Light Sun Catcher', price: '$50.00', position: '58% center' },
]

function ProductGrid() {
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
          {sampleProducts.map((product) => (
            <div className="col-12 col-md-6 col-lg-4" key={product.name}>
              <article className="product-card h-100">
                <div className="product-image-wrap">
                  <img
                    src={heroSuncatcher}
                    className="product-image"
                    style={{ objectPosition: product.position }}
                    alt="Temporary sun catcher concept used to review the product-card layout"
                  />
                </div>

                <div className="product-card-body">
                  <h3>{product.name}</h3>
                  <div className="product-divider" aria-hidden="true">✦</div>
                  <p className="product-price">{product.price}</p>
                  <button className="product-button" type="button">
                    Add to Cart
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGrid
