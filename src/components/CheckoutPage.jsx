import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '../data/products.js'

const squareEnvironment = import.meta.env.VITE_SQUARE_ENV || 'sandbox'
const squareAppId = import.meta.env.VITE_SQUARE_APP_ID
const squareLocationId = import.meta.env.VITE_SQUARE_LOCATION_ID
const flatShipping = 9.95

let squareLoadPromise

const friendlyPaymentMessage = (message = '') => {
  const normalizedMessage = message.toUpperCase()

  if (normalizedMessage.includes('GENERIC_DECLINE') || normalizedMessage.includes('CARD_DECLINED')) {
    return 'Your card was declined. Please check the card details or try another payment method.'
  }

  if (normalizedMessage.includes('CVV')) {
    return 'The security code could not be verified. Please check the CVV and try again.'
  }

  if (normalizedMessage.includes('POSTAL')) {
    return 'The billing ZIP code could not be verified. Please check it and try again.'
  }

  if (normalizedMessage.includes('EXPIR')) {
    return 'The card expiration date could not be verified. Please check it and try again.'
  }

  return message || 'The payment could not be completed. Please check your information and try again.'
}

const loadSquare = () => {
  if (window.Square) return Promise.resolve(window.Square)
  if (squareLoadPromise) return squareLoadPromise

  squareLoadPromise = new Promise((resolve, reject) => {
    const script = document.querySelector('script[data-square-sdk]') || document.createElement('script')
    const timeout = window.setTimeout(() => reject(new Error('Square took too long to load.')), 12000)
    const finish = () => {
      window.clearTimeout(timeout)
      if (window.Square) resolve(window.Square)
      else reject(new Error('Square loaded without its payment tools.'))
    }
    const fail = () => {
      window.clearTimeout(timeout)
      reject(new Error('Square could not be reached.'))
    }

    script.addEventListener('load', finish, { once: true })
    script.addEventListener('error', fail, { once: true })
    if (!script.dataset.squareSdk) {
      script.dataset.squareSdk = 'true'
      script.src = squareEnvironment === 'production'
        ? 'https://web.squarecdn.com/v1/square.js'
        : 'https://sandbox.web.squarecdn.com/v1/square.js'
      document.head.appendChild(script)
    }
  })

  return squareLoadPromise
}

function CheckoutPage({ items, subtotal, onPaymentSuccess }) {
  const cardRef = useRef(null)
  const [cardReady, setCardReady] = useState(false)
  const [setupError, setSetupError] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const orderTotal = subtotal + flatShipping

  useEffect(() => {
    if (!squareAppId || !squareLocationId || items.length === 0) return undefined
    let cancelled = false

    const initializeCard = async () => {
      try {
        const Square = await loadSquare()
        if (cancelled) return
        const payments = Square.payments(squareAppId, squareLocationId)
        const card = await payments.card()
        if (cancelled) {
          await card.destroy()
          return
        }
        await card.attach('#square-card-container')
        if (cancelled) {
          await card.destroy()
          return
        }
        cardRef.current = card
        setCardReady(true)
      } catch {
        if (!cancelled) setSetupError('The secure Square card form could not be loaded.')
      }
    }

    initializeCard()
    return () => {
      cancelled = true
      if (cardRef.current) cardRef.current.destroy()
      cardRef.current = null
    }
  }, [items.length])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!cardRef.current || isPaying) return

    const form = new FormData(event.currentTarget)
    const customer = Object.fromEntries(form.entries())
    setIsPaying(true)
    setPaymentError('')

    try {
      const tokenResult = await cardRef.current.tokenize({
        amount: orderTotal.toFixed(2),
        currencyCode: 'USD',
        intent: 'CHARGE',
        customerInitiated: true,
        sellerKeyedIn: false,
        billingContact: {
          givenName: customer.firstName,
          familyName: customer.lastName,
          email: customer.email,
          addressLines: [customer.addressLine1, customer.addressLine2].filter(Boolean),
          city: customer.city,
          state: customer.state,
          postalCode: customer.postalCode,
          countryCode: 'US',
        },
      })

      if (tokenResult.status !== 'OK') {
        throw new Error(tokenResult.errors?.[0]?.message || 'Please check the card information and try again.')
      }

      const paymentResponse = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: tokenResult.token,
          items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
          customer,
        }),
      })
      const payment = await paymentResponse.json()
      if (!paymentResponse.ok) throw new Error(payment.error || 'The test payment could not be completed.')

      setConfirmation(payment)
      onPaymentSuccess()
    } catch (error) {
      setPaymentError(friendlyPaymentMessage(error.message))
    } finally {
      setIsPaying(false)
    }
  }

  if (confirmation) {
    return (
      <main className="checkout-page" id="top">
        <div className="container-xl">
          <section className="checkout-confirmation">
            <span aria-hidden="true">✦</span>
            <p className="section-kicker">Sandbox Test Complete</p>
            <h1>Your light is on its way.</h1>
            <p>The Square test payment completed successfully. No real card was charged.</p>
            <p className="confirmation-number">Test payment: {confirmation.paymentId}</p>
            <a className="dream-button" href="#shop">Return to the Shop</a>
          </section>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page" id="top">
        <div className="container-xl">
          <section className="checkout-confirmation">
            <span aria-hidden="true">✦</span>
            <h1>Your cart is waiting for light.</h1>
            <a className="dream-button" href="#shop">Explore Sun Catchers</a>
          </section>
        </div>
      </main>
    )
  }

  const isConfigured = Boolean(squareAppId && squareLocationId)

  return (
    <main className="checkout-page" id="top">
      <div className="container-xl">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <a href="#shop">Sun Catchers</a><span aria-hidden="true">✦</span><span>Secure Checkout</span>
        </nav>

        <div className="checkout-frame">
          <div className="checkout-heading text-center">
            <p className="section-kicker">Square Sandbox</p>
            <h1>Secure Checkout</h1>
            <p>Test mode only — no real card will be charged.</p>
          </div>

          <div className="row g-0">
            <section className="col-lg-7 checkout-form-panel" aria-labelledby="contact-heading">
              <form onSubmit={handleSubmit}>
                <h2 id="contact-heading">Contact &amp; Shipping</h2>
                <div className="row g-3">
                  <div className="col-sm-6"><label htmlFor="firstName">First name</label><input id="firstName" name="firstName" autoComplete="given-name" required /></div>
                  <div className="col-sm-6"><label htmlFor="lastName">Last name</label><input id="lastName" name="lastName" autoComplete="family-name" required /></div>
                  <div className="col-12"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
                  <div className="col-12"><label htmlFor="addressLine1">Street address</label><input id="addressLine1" name="addressLine1" autoComplete="address-line1" required /></div>
                  <div className="col-12"><label htmlFor="addressLine2">Apartment, suite, etc. <span>optional</span></label><input id="addressLine2" name="addressLine2" autoComplete="address-line2" /></div>
                  <div className="col-sm-5"><label htmlFor="city">City</label><input id="city" name="city" autoComplete="address-level2" required /></div>
                  <div className="col-sm-3"><label htmlFor="state">State</label><input id="state" name="state" autoComplete="address-level1" maxLength="2" placeholder="WI" required /></div>
                  <div className="col-sm-4"><label htmlFor="postalCode">ZIP code</label><input id="postalCode" name="postalCode" autoComplete="postal-code" inputMode="numeric" required /></div>
                </div>

                <div className="payment-heading">
                  <h2>Payment</h2>
                  <span>Secured by Square</span>
                </div>
                {!isConfigured ? (
                  <div className="checkout-setup-note">Add the saved Square Sandbox values to the protected environment file to activate the card form.</div>
                ) : (
                  <div id="square-card-container" className="square-card-container" aria-label="Secure card information" />
                )}
                {setupError && <p className="checkout-error" role="alert">{setupError}</p>}
                {paymentError && <p className="checkout-error" role="alert">{paymentError}</p>}

                <button className="checkout-pay-button" type="submit" disabled={!cardReady || isPaying}>
                  <span aria-hidden="true">✦</span>
                  {isPaying ? 'Completing Test Payment…' : `Pay ${formatPrice(orderTotal)} in Sandbox`}
                  <span aria-hidden="true">✦</span>
                </button>
              </form>
            </section>

            <aside className="col-lg-5 checkout-summary" aria-label="Order summary">
              <h2>Order Summary</h2>
              {items.map(({ product, quantity }) => (
                <article className="checkout-item" key={product.id}>
                  <img src={product.image} alt="" style={{ objectPosition: product.imagePosition, objectFit: product.imageFit || 'cover' }} />
                  <div><p>{product.name}</p><span>Quantity {quantity}</span><strong>{formatPrice(product.price * quantity)}</strong></div>
                </article>
              ))}
              <dl className="checkout-totals">
                <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div><dt>U.S. flat-rate shipping</dt><dd>{formatPrice(flatShipping)}</dd></div>
                <div><dt>Tax</dt><dd>Pending</dd></div>
                <div className="checkout-total"><dt>Sandbox test total</dt><dd>{formatPrice(orderTotal)}</dd></div>
              </dl>
              <p className="checkout-pending-note">A $9.95 flat shipping rate is included for U.S. orders. Tax is not yet included, and production payments remain locked until tax and order notifications are finalized.</p>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CheckoutPage
