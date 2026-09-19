import { useState } from 'react'
import { addSubscriber } from '../../store/siteStore'

// Stands in for the embedded Klaviyo sign-up form; sign-ups appear in Admin → Subscribers
export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  if (done) {
    return <p className="cb-newsletter-thanks">Thanks for subscribing! Check your inbox for your 10% off code.</p>
  }

  return (
    <form
      className="cb-newsletter w-form-row"
      onSubmit={(e) => {
        e.preventDefault()
        addSubscriber(email.trim())
        setDone(true)
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
      <button type="submit" className="w-btn us-btn-style_1">
        <span className="w-btn-label">Subscribe</span>
      </button>
    </form>
  )
}
