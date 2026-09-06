function ThankYouPage() {
  return (
    <main className="thank-you-page" id="top">
      <div className="container-xl">
        <article className="thank-you-frame">
          <div className="thank-you-glow" aria-hidden="true">✦</div>
          <p className="section-kicker">Order Received</p>
          <h1>Thank You. Your Light Has Found a Home.</h1>
          <p className="thank-you-intro">
            Your payment was completed securely through Square. We’ll prepare your Cyan Dream creation
            with care and send tracking details when it begins its journey to you.
          </p>

          <div className="thank-you-steps" aria-label="What happens next">
            <section>
              <span aria-hidden="true">01</span>
              <h2>Keep Your Receipt</h2>
              <p>Square provides your payment receipt after checkout. Keep it nearby for your records.</p>
            </section>
            <section>
              <span aria-hidden="true">02</span>
              <h2>Prepared With Care</h2>
              <p>Ready-to-ship pieces are normally wrapped and mailed within 1–3 business days.</p>
            </section>
            <section>
              <span aria-hidden="true">03</span>
              <h2>Follow the Light</h2>
              <p>You’ll receive a shipping notice with USPS tracking when your order is on its way.</p>
            </section>
          </div>

          <div className="thank-you-note">
            <h2>Need to correct your shipping address?</h2>
            <p>Please contact us as soon as possible, before the package is placed in the mail.</p>
            <a href="/#contact">Contact Cyan Dream</a>
          </div>

          <a className="dream-button" href="/#shop">
            <span aria-hidden="true">✦</span>
            Return to the Shop
            <span aria-hidden="true">✦</span>
          </a>
        </article>
      </div>
    </main>
  )
}

export default ThankYouPage
