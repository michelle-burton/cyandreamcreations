import { useCallback, useEffect, useState } from 'react'
import heroSuncatcher from './assets/hero-suncatcher.png'
import { applyProductAvailability, findProduct, isPurchasable } from './data/products.js'
import ProductGrid from './components/ProductGrid.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import QuickView from './components/QuickView.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import StorySection from './components/StorySection.jsx'
import OraclePreview from './components/OraclePreview.jsx'
import QuantumPomSection from './components/QuantumPomSection.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import ShippingAdmin from './components/ShippingAdmin.jsx'
import InfoPage from './components/InfoPage.jsx'
import HomePathways from './components/HomePathways.jsx'
import OraclePage from './components/OraclePage.jsx'
import ThankYouPage from './components/ThankYouPage.jsx'

function App() {
  const squareCheckoutUrl = import.meta.env.VITE_SQUARE_CHECKOUT_URL?.trim()
  const pathname = window.location.pathname.replace(/\/$/, '')
  const isThankYou = pathname === '/thank-you'
  const sectionHref = (hash) => `${isThankYou ? '/' : ''}${hash}`
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cart, setCart] = useState(() => {
    if (isThankYou) return []
    try {
      return JSON.parse(window.localStorage.getItem('cyan-dream-cart')) || []
    } catch {
      return []
    }
  })
  const [route, setRoute] = useState(window.location.hash)
  const [availability, setAvailability] = useState({})

  useEffect(() => {
    let cancelled = false

    const refreshAvailability = async () => {
      try {
        const response = await fetch('/api/product-availability')
        if (!response.ok) return
        const result = await response.json()
        if (!cancelled && result?.products) setAvailability(result.products)
      } catch {
        // Keep the most recent storefront status if Square is briefly unavailable.
      }
    }

    const handleFocus = () => refreshAvailability()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshAvailability()
    }

    refreshAvailability()
    const refreshTimer = window.setInterval(refreshAvailability, 60_000)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelled = true
      window.clearInterval(refreshTimer)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const sectionRoutes = new Set(['#top', '#join'])
    if (sectionRoutes.has(route)) {
      window.requestAnimationFrame(() => {
        document.getElementById(route.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

  useEffect(() => {
    window.localStorage.setItem('cyan-dream-cart', JSON.stringify(cart))
  }, [cart])

  const closeQuickView = useCallback(() => setQuickViewProduct(null), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const addToCart = (product) => {
    if (!isPurchasable(product)) return
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.productId === product.id)
      if (existing) return currentCart
      return [...currentCart, { productId: product.id, quantity: 1 }]
    })
    setQuickViewProduct(null)
    setIsCartOpen(true)
  }
  const removeFromCart = (productId) => setCart((currentCart) => currentCart.filter((item) => item.productId !== productId))
  const cartItems = cart
    .map((item) => ({ ...item, product: applyProductAvailability(findProduct(item.productId), availability) }))
    .filter((item) => item.product && isPurchasable(item.product))
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  const productId = route.startsWith('#product/') ? route.replace('#product/', '') : null
  const activeProduct = productId ? applyProductAvailability(findProduct(productId), availability) : null
  const liveQuickViewProduct = applyProductAvailability(quickViewProduct, availability)
  const isShippingAdmin = route === '#shipping-admin'
  const isShop = route === '#shop'
  const isStory = route === '#story'
  const isOracle = route === '#oracle'
  const infoPage = new Map([
    ['#shipping', 'shipping'],
    ['#returns', 'returns'],
    ['#privacy', 'privacy'],
    ['#terms', 'terms'],
    ['#contact', 'contact'],
  ]).get(route)

  useEffect(() => {
    if (route !== '#checkout') return

    if (squareCheckoutUrl) {
      window.location.replace(squareCheckoutUrl)
      return
    }

    window.location.replace(`${window.location.pathname}${window.location.search}#shop`)
  }, [route, squareCheckoutUrl])

  useEffect(() => {
    const infoTitles = {
      shipping: 'Shipping',
      returns: 'Returns & Refunds',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
    }
    let pageTitle = 'Handmade Sun Catchers'
    if (isThankYou) pageTitle = 'Order Received'
    else if (activeProduct) pageTitle = activeProduct.name
    else if (isShippingAdmin) pageTitle = 'Shipping Notice'
    else if (infoPage) pageTitle = infoTitles[infoPage]
    else if (isShop) pageTitle = 'Sun Catchers'
    else if (isStory) pageTitle = 'The Dream'
    else if (isOracle) pageTitle = 'The Oracle'
    document.title = `${pageTitle} | Cyan Dream Creations`
  }, [activeProduct, infoPage, isOracle, isShippingAdmin, isShop, isStory, isThankYou])
  const handleCheckout = () => {
    if (!squareCheckoutUrl) return
    setIsCartOpen(false)
    window.location.assign(squareCheckoutUrl)
  }
  const closeMobileMenu = () => {
    document.getElementById('mainMenu')?.classList.remove('show')
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false')
  }

  if (pathname === '/oracle') return <OraclePage />

  return (
    <div className="site-shell">
      <header className="site-header">
        <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
          <div className="container-xl">
            <a className="brand-mark" href={sectionHref('#top')} aria-label="Cyan Dream Creations home" onClick={closeMobileMenu}>
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
                  <a className="nav-link" href={sectionHref('#shop')} onClick={closeMobileMenu}>Sun Catchers</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={sectionHref('#story')} onClick={closeMobileMenu}>The Dream</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/oracle" onClick={closeMobileMenu}>The Oracle</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {isThankYou ? (
        <ThankYouPage />
      ) : isShippingAdmin ? (
        <ShippingAdmin />
      ) : activeProduct ? (
        <ProductDetail product={activeProduct} onAddToCart={addToCart} />
      ) : infoPage ? (
        <InfoPage page={infoPage} />
      ) : isShop ? (
        <main id="top"><ProductGrid onQuickView={setQuickViewProduct} availability={availability} /></main>
      ) : isStory ? (
        <main id="top"><StorySection /><QuantumPomSection /></main>
      ) : isOracle ? (
        <main id="top"><OraclePreview /></main>
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

        <ProductGrid onQuickView={setQuickViewProduct} availability={availability} featured />
        <HomePathways />
      </main>
      )}

      <SiteFooter
        showSignup={!isThankYou && !isShippingAdmin && !activeProduct && !infoPage && !isShop && !isStory && !isOracle}
        sectionBase={isThankYou ? '/' : ''}
      />
      {liveQuickViewProduct && (
        <QuickView
          product={liveQuickViewProduct}
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
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        checkoutAvailable={Boolean(squareCheckoutUrl)}
      />
    </div>
  )
}

export default App
