import { useCallback, useEffect, useState } from 'react'
import heroSuncatcher from './assets/hero-suncatcher.png'
import { findProduct } from './data/products.js'
import ProductGrid from './components/ProductGrid.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import QuickView from './components/QuickView.jsx'
import StorySection from './components/StorySection.jsx'
import OraclePreview from './components/OraclePreview.jsx'
import SiteFooter from './components/SiteFooter.jsx'

function App() {
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const closeQuickView = useCallback(() => setQuickViewProduct(null), [])
  const addToCart = (quantity) => setCartCount((count) => count + quantity)
  const productId = route.startsWith('#product/') ? route.replace('#product/', '') : null
  const activeProduct = productId ? findProduct(productId) : null

  return (
    <div className="site-shell">
      <header className="site-header">
        <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
          <div className="container-xl">
            <a className="brand-mark" href="#top" aria-label="Cyan Dream Creations home">
              <span className="brand-name">Cyan Dream</span>
              <span className="brand-subtitle">Creations</span>
            </a>

            <div className="d-flex align-items-center gap-2 order-lg-3">
              <a className="cart-link" href="#cart" aria-label={`Shopping cart, ${cartCount} items`}>
                <span aria-hidden="true">♢</span>
                <span className="d-none d-sm-inline">Cart</span>
                <span>({cartCount})</span>
              </a>

              <button
                className="navbar-toggler menu-toggle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainMenu"
                aria-controls="mainMenu"
                aria-expanded="false"
                aria-label="Open navigation menu"
              >
                <span className="menu-line" />
                <span className="menu-line" />
                <span className="menu-line" />
              </button>
            </div>

            <div className="collapse navbar-collapse order-lg-2" id="mainMenu">
              <ul className="navbar-nav mx-auto align-items-lg-center">
                <li className="nav-item">
                  <a className="nav-link" href="#shop">Sun Catchers</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#story">Our Story</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#oracle">Oracle</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {activeProduct ? (
        <ProductDetail product={activeProduct} onAddToCart={addToCart} />
      ) : (
      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="container-xl">
            <div className="hero-frame">
              <span className="hero-flourish hero-flourish-left" aria-hidden="true">✦</span>
              <span className="hero-flourish hero-flourish-right" aria-hidden="true">✦</span>

              <div className="row g-0 align-items-stretch">
                <div className="col-lg-6 order-1">
                  <div className="hero-copy">
                    <div className="celestial-divider" aria-hidden="true">
                      <span />
                      <b>✦</b>
                      <span />
                    </div>

                    <h1 id="hero-title">Where Dreams Become Light.</h1>
                    <p>
                      Handmade sun catchers and symbolic creations for
                      reflection, ritual, and the sacred within.
                    </p>

                    <a className="dream-button" href="#shop">
                      <span aria-hidden="true">✦</span>
                      Shop Sun Catchers
                      <span aria-hidden="true">✦</span>
                    </a>
                  </div>
                </div>

                <div className="col-lg-6 order-2">
                  <figure className="hero-image-wrap">
                    <img
                      src={heroSuncatcher}
                      className="hero-image"
                      alt="A temporary concept image of a crystal sun catcher casting rainbow light beside a dark window"
                    />
                    <figcaption className="visually-hidden">
                      Temporary concept artwork; final product photography will replace this image.
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProductGrid onQuickView={setQuickViewProduct} />
        <StorySection />
        <OraclePreview />
      </main>
      )}

      <SiteFooter />
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={closeQuickView}
          onAddToCart={addToCart}
        />
      )}
    </div>
  )
}

export default App
