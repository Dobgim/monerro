import { useState } from 'react'
import { useSiteState } from '../store/siteStore'
import usePageTitle from '../hooks/usePageTitle'
import { whatsappUrl } from '../lib/whatsapp'
import { Section } from '../components/common/Section'
import PageHero from '../components/common/PageHero'
import WhatsAppIcon from '../components/common/WhatsAppIcon'

const mapsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\n/g, ', '))}`

function LocationCard({ loc, contact }) {
  return (
    <article className="cb-location" id={loc.id}>
      <h3>{loc.name}</h3>
      <p className="cb-location__address">
        {loc.address.split('\n').map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
      </p>
      {loc.hours && (
        <p>
          <strong>Hours:</strong> {loc.hours}
        </p>
      )}
      <p>
        <strong>Phone:</strong> <a href={contact.phoneHref}>{contact.phone}</a>
      </p>
      <a className="cb-link" href={mapsUrl(loc.address)} target="_blank" rel="noopener noreferrer">
        Get directions →
      </a>
    </article>
  )
}

/** A small form whose "Send" button opens WhatsApp with the message written out. */
function WhatsAppForm({ intro, fields, buildMessage, submitLabel }) {
  const contact = useSiteState((s) => s.contact)
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ''])))
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const href = whatsappUrl(contact.whatsapp, buildMessage(values))

  const onSend = (e) => {
    const errs = {}
    fields.forEach((f) => {
      if (f.required && !values[f.name].trim()) errs[f.name] = `Please enter your ${f.label.toLowerCase()}.`
    })
    setErrors(errs)
    if (Object.keys(errs).length) e.preventDefault()
    else setSent(true)
  }

  return (
    <div className="cb-form">
      {intro && <p>{intro}</p>}
      {fields.map((f) => (
        <div className="cb-field" key={f.name}>
          <label htmlFor={`f-${f.name}`}>
            {f.label}
            {f.required ? ' *' : ''}
          </label>
          {f.multiline ? (
            <textarea id={`f-${f.name}`} rows={4} value={values[f.name]} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} className={errors[f.name] ? 'is-invalid' : ''} />
          ) : (
            <input id={`f-${f.name}`} type={f.type || 'text'} value={values[f.name]} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} className={errors[f.name] ? 'is-invalid' : ''} />
          )}
          {errors[f.name] && <p className="cb-error">{errors[f.name]}</p>}
        </div>
      ))}
      <a className="cb-whatsapp-btn" href={href} target="_blank" rel="noopener noreferrer" onClick={onSend}>
        <WhatsAppIcon /> {submitLabel}
      </a>
      {sent && <p className="cb-sent">✓ WhatsApp is open with your message — press Send and we’ll reply as soon as we can.</p>}
    </div>
  )
}

export function ContactPage() {
  usePageTitle('Contact Us')
  const contact = useSiteState((s) => s.contact)
  const locations = useSiteState((s) => s.locations)
  return (
    <Section className="height_medium cb-page cb-contact">
      <PageHero eyebrow="We’re here to help" title="Contact Us" intro="Questions about a product, an order or what might suit you best? Reach us the way that’s easiest for you." />
      <div className="cb-two-col">
        <div className="cb-contact__methods">
          <div className="cb-contact__method">
            <h2>Message us on WhatsApp</h2>
            <p>The fastest way to reach us — send a message and a real person will reply.</p>
            <a className="cb-whatsapp-btn cb-whatsapp-btn--small" href={whatsappUrl(contact.whatsapp, 'Hi CannaBuddyHub! I have a question:')} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={18} /> Start a chat
            </a>
          </div>
          <div className="cb-contact__method">
            <h2>Call us</h2>
            <p>
              <a className="cb-contact__phone" href={contact.phoneHref}>
                {contact.phone}
              </a>
            </p>
          </div>
          {contact.email && (
            <div className="cb-contact__method">
              <h2>Email us</h2>
              <p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            </div>
          )}
          {locations.length > 0 && (
            <div className="cb-contact__method">
              <h2>Visit us</h2>
              {locations.map((l) => (
                <p key={l.id}>
                  <strong>{l.name}</strong> — {l.address.replace(/\n/g, ', ')}{' '}
                  <a className="cb-link" href={`/locations/#${l.id}`}>
                    Details
                  </a>
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="cb-checkout__card">
          <h2>Send us a message</h2>
          <WhatsAppForm
            fields={[
              { name: 'name', label: 'Name', required: true },
              { name: 'message', label: 'Message', required: true, multiline: true },
            ]}
            buildMessage={(v) => `Hi CannaBuddyHub! My name is ${v.name.trim()}.\n\n${v.message.trim()}`}
            submitLabel="Send on WhatsApp"
          />
        </div>
      </div>
    </Section>
  )
}

export function LocationsPage() {
  usePageTitle('Locations')
  const contact = useSiteState((s) => s.contact)
  const locations = useSiteState((s) => s.locations)
  return (
    <Section className="height_medium cb-page cb-locations">
      <PageHero eyebrow="Visit us" title="Locations" intro="Shop online any time, or stop by and talk to our team in person." />
      {locations.length > 0 ? (
        <div className="cb-location-grid">
          {locations.map((l) => (
            <LocationCard key={l.id} loc={l} contact={contact} />
          ))}
        </div>
      ) : (
        <p className="cb-page__empty">We’re an online dispensary — order from the shop and we’ll arrange delivery or pickup with you on WhatsApp.</p>
      )}
      <div className="cb-note-box">
        <h2>Prefer to order ahead?</h2>
        <p>Add products to your cart, choose pickup at checkout, and we’ll have your order ready.</p>
        <a className="w-btn us-btn-style_1" href="/shop/">
          <span className="w-btn-label">Shop now</span>
        </a>
      </div>
    </Section>
  )
}

export function WholesalePage() {
  usePageTitle('Wholesale')
  return (
    <Section className="height_medium cb-page cb-wholesale">
      <PageHero eyebrow="For businesses" title="Wholesale" intro="Stock quality hemp-derived products in your store. We work with retailers, smoke shops, cafés and wellness businesses." />
      <div className="cb-two-col">
        <div className="cb-prose">
          <h2>Why partner with us</h2>
          <ul>
            <li>A curated range of THCa, Delta 9, CBD, vapes, drinks and more.</li>
            <li>Lab reports available for the products we supply.</li>
            <li>Volume pricing for regular orders.</li>
            <li>A real person to talk to — no ticket queues.</li>
          </ul>
          <h2>How it works</h2>
          <ol>
            <li>Send us your business details using the form.</li>
            <li>We’ll share our wholesale catalogue and pricing.</li>
            <li>Place your order and we’ll arrange delivery.</li>
          </ol>
        </div>
        <div className="cb-checkout__card">
          <h2>Wholesale enquiry</h2>
          <WhatsAppForm
            fields={[
              { name: 'name', label: 'Your name', required: true },
              { name: 'business', label: 'Business name', required: true },
              { name: 'location', label: 'City and state', required: true },
              { name: 'interest', label: 'Products you’re interested in', multiline: true },
            ]}
            buildMessage={(v) =>
              [
                'Hi CannaBuddyHub! I’d like to ask about wholesale.',
                '',
                `Name: ${v.name.trim()}`,
                `Business: ${v.business.trim()}`,
                `Location: ${v.location.trim()}`,
                v.interest.trim() ? `Interested in: ${v.interest.trim()}` : null,
              ]
                .filter((l) => l !== null)
                .join('\n')
            }
            submitLabel="Send enquiry on WhatsApp"
          />
        </div>
      </div>
    </Section>
  )
}
