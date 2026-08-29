import { useCallback, useEffect, useState } from 'react'
import heroSuncatcher from './assets/hero-suncatcher.png'
import { findProduct, isPurchasable } from './data/products.js'
import ProductGrid from './components/ProductGrid.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import QuickView from './components/QuickView.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import StorySection from './components/StorySection.jsx'
import OraclePreview from './components/OraclePreview.jsx'
import QuantumPomSection from './components/QuantumPomSection.jsx'
import SiteFooter from './components/SiteFooter.jsx'

function App() {
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('cyan-dream-cart')) || []
    } catch {
      return []
    }
  })
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('cyan-dream-cart', JSON.stringify(cart))
  }, [cart])

  const closeQuickView = useCallback(() => setQuickViewProduct(null), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const addToCart = (product, quantity) => {
    if (!isPurchasable(product)) return
    const maxQuantity = product.inventory ?? 99
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.productId === product.id)
      if (existing) {
        return currentCart.map((item) => item.productId === product.id
          ? { ...item, quantity: Math.min(maxQuantity, item.quantity + quantity) }
          : item)
      }
      return [...currentCart, { productId: product.id, quantity: Math.min(maxQuantity, quantity) }]
    })
    setQuickViewProduct(null)
    setIsCartOpen(true)
  }
  const updateCartQuantity = (productId, quantity) => {
    if (quantity < 1) {
      setCart((currentCart) => currentCart.filter((item) => item.productId !== productId))
      return
    }
    const product = findProduct(productId)
    if (!product || !isPurchasable(product)) {
      setCart((currentCart) => currentCart.filter((item) => item.productId !== productId))
      return
    }
    const maxQuantity = product?.inventory ?? 99
    setCart((currentCart) => currentCart.map((item) => item.productId === productId
      ? { ...item, quantity: Math.min(maxQuantity, quantity) }
      : item))
  }
  const removeFromCart = (productId) => setCart((currentCart) => currentCart.filter((item) => item.productId !== productId))
  const cartItems = cart
    .map((item) => ({ ...item, product: findProduct(item.productId) }))
    .filter((item) => item.product && isPurchasable(item.product))
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
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
              <button className="cart-link" type="button" onClick={() => setIsCartOpen(true)} aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
                <span aria-hidden="true">♢</span>
                <span className="d-none d-sm-inline">Cart</span>
                <span>({cartCount})</span>
              </button>

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
        <QuantumPomSection />
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
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        itemCount={cartCount}
        subtotal={cartSubtotal}
        onClose={closeCart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
      />
    </div>
  )
}

export default App
