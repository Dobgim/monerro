import { useState } from 'react'
import { addSubscriber } from '../../store/siteStore'

// Stands in for the embedded Klaviyo sign-up form; sign-ups appear in Admin → Subscribers
export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  if (done) {
    return <p className="cb-newsletter-thanks">Thanks for subscribing! Check your inbox for your 10% off code.</p>
  }

  return (
    <form
      className="cb-newsletter w-form-row"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        const ok = await addSubscriber(email.trim())
        setBusy(false)
        setFailed(!ok)
        if (ok) setDone(true)
      }}
    >
      <label className="screen-reader-text" htmlFor="cb-newsletter-email">
        Email address
      </label>
      <input
        id="cb-newsletter-email"
        type="email"
        required
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="w-btn us-btn-style_1" disabled={busy}>
        <span className="w-btn-label">{busy ? 'Subscribing…' : 'Subscribe'}</span>
      </button>
      {failed && (
        <p className="cb-newsletter-error" role="alert">
          Sorry, that didn’t go through. Please check your connection and try again.
        </p>
      )}
    </form>
  )
}
