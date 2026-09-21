import { useLocation } from 'react-router-dom'
import { useSiteState } from '../store/siteStore'
import { resolveCollection } from '../lib/collections'
import { articleBySlug } from '../content/blog'
import { PAGES } from '../content/pages'
import CollectionPage from './CollectionPage'
import InfoPage from './InfoPage'
import { ArticlePage, BlogIndexPage } from './BlogPages'
import { ContactPage, LocationsPage, WholesalePage } from './ContactPages'
import { BrandsPage, MyAccountPage, SitemapPage } from './AccountPages'
import ComingSoonPage from './ComingSoonPage'

// Pages with their own component, by first path segment
const NAMED = {
  'contact-us': ContactPage,
  locations: LocationsPage,
  charlotte: LocationsPage, // old footer "Dispensary" link
  wholesale: WholesalePage,
  'my-account': MyAccountPage,
  blog: BlogIndexPage,
  'cannabis-brands': BrandsPage,
  'html-sitemap': SitemapPage,
}

// Picks the right page for any address that isn't the home page, shop, product, cart or checkout.
export default function ContentRouter() {
  const { pathname } = useLocation()
  const brands = useSiteState((s) => s.brands)
  const [first] = pathname.split('/').filter(Boolean)

  const collection = resolveCollection(pathname, brands)
  if (collection) return <CollectionPage key={collection.key} collection={collection} />

  const Named = NAMED[first]
  if (Named) return <Named />

  if (PAGES[first]) return <InfoPage key={first} page={PAGES[first]} />
  if (articleBySlug[first]) return <ArticlePage key={first} article={articleBySlug[first]} />

  return <ComingSoonPage title="Page not found" message="Sorry, we couldn’t find that page. It may have moved — try the shop or search for what you need." />
}
