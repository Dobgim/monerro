import { useSiteState } from '../../store/siteStore'
import { whatsappUrl } from '../../lib/whatsapp'
import WhatsAppIcon from './WhatsAppIcon'

function Faq({ items }) {
  return (
    <div className="cb-faq">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  )
}

function Cta({ kind }) {
  const contact = useSiteState((s) => s.contact)
  if (kind === 'shop')
    return (
      <p className="cb-cta">
        <a className="w-btn us-btn-style_1" href="/shop/">
          <span className="w-btn-label">Shop all products</span>
        </a>
      </p>
    )
  return (
    <p className="cb-cta">
      <a className="cb-whatsapp-btn cb-whatsapp-btn--small" href={whatsappUrl(contact.whatsapp, 'Hi CannaBuddyHub! I have a question:')} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon size={18} /> Message us on WhatsApp
      </a>
      <span className="cb-cta__or">
        or call <a href={contact.phoneHref}>{contact.phone}</a>
      </span>
    </p>
  )
}

// Renders content blocks from src/content (['h2', text], ['p', text], ['ul', [...]], ['faq', [[q, a]]], ['cta', kind])
export default function ContentBlocks({ blocks }) {
  return (
    <div className="cb-prose">
      {blocks.map(([type, value], i) => {
        if (type === 'h2') return <h2 key={i}>{value}</h2>
        if (type === 'p') return <p key={i}>{value}</p>
        if (type === 'ul')
          return (
            <ul key={i}>
              {value.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )
        if (type === 'faq') return <Faq key={i} items={value} />
        if (type === 'cta') return <Cta key={i} kind={value} />
        return null
      })}
    </div>
  )
}
