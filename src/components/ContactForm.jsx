import { useState } from 'react'

function ContactForm() {
  const [status, setStatus] = useState(null)
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setIsSending(true)
    setStatus(null)

    try {
      const response = await fetch('/api/send-contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent.')
      form.reset()
      setStatus({ type: 'success', message: 'Your note has been sent. We’ll be in touch soon.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-grid">
        <div><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" maxLength="100" required /></div>
        <div><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength="254" required /></div>
      </div>
      <div><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" maxLength="140" required /></div>
      <div><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" rows="7" minLength="10" maxLength="3000" required /></div>
      <label className="contact-honeypot" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" /></label>
      {status && <div className={`contact-status ${status.type}`} role="status" aria-live="polite">{status.message}</div>}
      <button type="submit" disabled={isSending}>{isSending ? 'Sending…' : 'Send My Note'}</button>
    </form>
  )
}

export default ContactForm
