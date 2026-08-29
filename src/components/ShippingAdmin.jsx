import { useState } from 'react'

function ShippingAdmin() {
  const [status, setStatus] = useState(null)
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSending(true)
    setStatus(null)

    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form).entries())

    try {
      const response = await fetch('/api/send-shipping-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'The shipping notice could not be sent.')

      setStatus({ type: 'success', message: `Shipping notice sent to ${fields.customerEmail}.` })
      form.reset()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="shipping-admin-page" id="top">
      <div className="container-xl">
        <section className="shipping-admin-frame">
          <div className="checkout-heading text-center">
            <p className="section-kicker">Private Fulfillment Tool</p>
            <h1>Send a Shipping Notice</h1>
            <p>Enter the details from your order email and USPS label.</p>
          </div>

          <form className="shipping-admin-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="shippingKey">Private shipping key</label>
              <input id="shippingKey" name="key" type="password" autoComplete="current-password" required />
            </div>
            <div className="shipping-admin-grid">
              <div>
                <label htmlFor="shippingCustomerName">Customer name</label>
                <input id="shippingCustomerName" name="customerName" autoComplete="off" required />
              </div>
              <div>
                <label htmlFor="shippingCustomerEmail">Customer email</label>
                <input id="shippingCustomerEmail" name="customerEmail" type="email" autoComplete="off" required />
              </div>
            </div>
            <div>
              <label htmlFor="shippingTracking">USPS tracking number</label>
              <input id="shippingTracking" name="trackingNumber" inputMode="numeric" autoComplete="off" required />
            </div>
            <div>
              <label htmlFor="shippingNote">Personal note <span>optional</span></label>
              <textarea id="shippingNote" name="note" rows="4" maxLength="500" />
            </div>

            {status && <p className={`shipping-admin-status ${status.type}`} role="status">{status.message}</p>}
            <button className="checkout-pay-button" type="submit" disabled={isSending}>
              <span aria-hidden="true">✦</span>
              {isSending ? 'Sending Notice…' : 'Send Shipping Notice'}
              <span aria-hidden="true">✦</span>
            </button>
            <p className="shipping-admin-privacy">The private key is checked securely and is not saved by this page.</p>
          </form>
        </section>
      </div>
    </main>
  )
}

export default ShippingAdmin
