import { useLocation } from 'react-router-dom'
import { useSiteState } from '../store/siteStore'
import usePageTitle from '../hooks/usePageTitle'
import LeafLines from '../components/common/LeafLines'
import { Section, Separator } from '../components/common/Section'

const ACRONYMS = { thc: 'THC', thca: 'THCa', thcv: 'THCv', thcp: 'THCP', thch: 'THCH', thcb: 'THCB', cbd: 'CBD', cbn: 'CBN', cbg: 'CBG', cbc: 'CBC', hhc: 'HHC', h4cbd: 'H4CBD', faqs: 'FAQs' }

// "/product-category/delta-9-thc/" -> "Delta 9 THC"
function nameFromPath(pathname) {
  const last = pathname.split('/').filter(Boolean).pop() || ''
  return last
    .split('-')
    .map((w) => ACRONYMS[w] || w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Shown for sections of the site that haven't been built yet (categories, blog, wholesale…)
export default function ComingSoonPage({ title, message }) {
  const { pathname } = useLocation()
  const contact = useSiteState((s) => s.contact)
  const heading = title || nameFromPath(pathname) || 'Page not found'
  usePageTitle(heading)

  return (
    <Section className="height_medium cb-page cb-soon">
      <Separator />
      <LeafLines />
      <Separator />
      <h1 style={{ textAlign: 'center' }}>{heading}</h1>
      <p className="cb-page__lead">{message || 'This page is coming soon. In the meantime, every product is available in our shop.'}</p>
      <div className="cb-soon__actions">
        <a className="w-btn us-btn-style_1" href="/shop/">
          <span className="w-btn-label">Shop all products</span>
        </a>
        <a className="cb-soon__home" href="/">
          Back to the home page
        </a>
      </div>
      <p className="cb-page__lead">
        Questions? Call us at <a href={contact.phoneHref}>{contact.phone}</a>
      </p>
    </Section>
  )
}
