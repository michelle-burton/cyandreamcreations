import { useState } from 'react'

const confirmationMessages = {
  confirmed: 'Your place on the Dream List is confirmed. Welcome.',
  expired: 'That confirmation link has expired. Please join again for a fresh link.',
  invalid: 'That confirmation link is not valid. Please join again below.',
  error: 'We could not confirm your place just now. Please try again.',
}

const statusDetails = {
  sent: { icon: '✉', title: 'Confirmation Email Sent' },
  confirmation: { icon: '✦', title: 'Almost There' },
  confirmed: { icon: '✓', title: 'You’re on the Dream List' },
  error: { icon: '!', title: 'Something Went Quiet' },
}

function SiteFooter() {
  const query = new URLSearchParams(window.location.search)
  const confirmationOutcome = query.get('newsletter')
  const [confirmationToken] = useState(() => query.get('newsletter-confirm'))
  const [signupStatus, setSignupStatus] = useState(() => confirmationToken
    ? { type: 'confirmation', message: 'One final step: confirm your place on the Dream List.' }
    : confirmationOutcome
      ? { type: confirmationOutcome === 'confirmed' ? 'confirmed' : 'error', message: confirmationMessages[confirmationOutcome] || confirmationMessages.error }
      : null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form).entries())
    setIsSubmitting(true)
    setSignupStatus(null)

    try {
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'The Dream List is temporarily unavailable.')
      setSignupStatus({ type: 'sent', message: 'Check your inbox to confirm your place on the Dream List.' })
      form.reset()
    } catch (error) {
      setSignupStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmation = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/confirm-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: confirmationToken }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || confirmationMessages.error)
      window.history.replaceState({}, '', '/?newsletter=confirmed#join')
      setSignupStatus({ type: 'confirmed', message: confirmationMessages.confirmed })
    } catch (error) {
      setSignupStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="signup-section" id="join" aria-labelledby="signup-title">
        <div className="container-xl">
          <div className={`signup-frame text-center${signupStatus ? ` signup-frame-${signupStatus.type}` : ''}`}>
            <div className="signup-star" aria-hidden="true">✦</div>
            <p className="section-kicker">The Dream List</p>
            <h2 id="signup-title">Stay Close to What Is Emerging</h2>
            <p className="signup-copy">
              New sun catchers, Oracle updates, and quiet notes from the world
              of Cyan Dream—sent with intention.
            </p>

            {(!signupStatus || signupStatus.type === 'error') && <form className="signup-form" onSubmit={handleSubmit}>
              <label className="visually-hidden" htmlFor="dream-list-email">
                Email address
              </label>
              <input
                id="dream-list-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="your@email.com"
                aria-describedby="signup-note"
                required
              />
              <label className="signup-honeypot" aria-hidden="true">
                Website
                <input name="website" tabIndex="-1" autoComplete="off" />
              </label>
              <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Join the Dream List'}</button>
            </form>}

            {signupStatus ? (
              <div className={`signup-status ${signupStatus.type}`} id="signup-note" role="status" aria-live="polite">
                <span className="signup-status-icon" aria-hidden="true">{statusDetails[signupStatus.type].icon}</span>
                <h3>{statusDetails[signupStatus.type].title}</h3>
                <p>{signupStatus.message}</p>
                <div className="signup-status-actions">
                  {signupStatus.type === 'confirmation' && (
                    <button className="signup-confirm-button" type="button" onClick={handleConfirmation} disabled={isSubmitting}>
                      {isSubmitting ? 'Confirming…' : 'Confirm My Place'}
                    </button>
                  )}
                  {signupStatus.type === 'sent' && (
                    <button className="signup-secondary-button" type="button" onClick={() => setSignupStatus(null)}>
                      Use a different email
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="layout-note" id="signup-note">Please confirm your subscription by email. You can unsubscribe at any time.</p>
            )}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container-xl">
          <div className="row gy-4 align-items-center">
            <div className="col-lg-4 text-center text-lg-start">
              <a className="brand-mark footer-brand" href="#top">
                <span className="brand-name">Cyan Dream</span>
                <span className="brand-subtitle">Creations</span>
              </a>
            </div>

            <div className="col-lg-4">
              <nav aria-label="Footer navigation">
                <ul className="footer-links">
                  <li><a href="#shop">Sun Catchers</a></li>
                  <li><a href="#story">The Dream</a></li>
                  <li><a href="#oracle">The Oracle</a></li>
                </ul>
              </nav>
            </div>

            <div className="col-lg-4 text-center text-lg-end">
              <p className="footer-cycle">Dream · Become · Illuminate · Reflect</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Cyan Dream Creations</p>
            <p>Created with reflection, intention, and care.</p>
          </div>

          <p className="quantum-footer-link">
            Curious about the ideas and technology behind the studio?{' '}
            <a href="https://www.youtube.com/@QuantumAIDesign" target="_blank" rel="noreferrer">
              Visit Quantum AI Design
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}

export default SiteFooter
