import { useState } from 'react'
import { useSiteState } from '../store/siteStore'
import usePageTitle from '../hooks/usePageTitle'
import { unitPrice } from '../lib/links'
import { whatsappUrl } from '../lib/whatsapp'
import { articlesForTags } from '../content/blog'
import { EFFECT_NOTE } from '../content/categoryCopy'
import { Section, Separator } from '../components/common/Section'
import PageHero from '../components/common/PageHero'
import ProductCard from '../components/home/ProductCard'
import WhatsAppIcon from '../components/common/WhatsAppIcon'
import ArticleCards from '../components/common/ArticleCards'

const SORTS = {
  featured: { label: 'Featured', fn: null },
  newest: { label: 'Newest', fn: (a, b) => b.id - a.id },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => unitPrice(a.price) - unitPrice(b.price) },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => unitPrice(b.price) - unitPrice(a.price) },
  name: { label: 'Name: A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
}

export default function CollectionPage({ collection }) {
  const products = useSiteState((s) => s.products)
  const contact = useSiteState((s) => s.contact)
  const [sort, setSort] = useState(collection.sortDefault || 'featured')
  usePageTitle(collection.title)

  const visible = products.filter((p) => p.visible)
  const matching = visible.filter(collection.filter)
  const shown = SORTS[sort].fn ? [...matching].sort(SORTS[sort].fn) : matching
  const suggestions = visible.filter((p) => !matching.includes(p)).slice(0, 4)
  const articles = articlesForTags(collection.tags)

  return (
    <>
      <Section className="height_medium cb-page cb-collection">
        <PageHero eyebrow={collection.eyebrow} title={collection.title} intro={collection.intro} image={collection.image} logo={collection.logo} breadcrumb={collection.breadcrumb} />

        {collection.chips?.length > 0 && (
          <nav className="cb-chips" aria-label="Related categories">
            {collection.chips.map((c) => (
              <a key={c.href} href={c.href} className={c.active ? 'is-active' : ''} aria-current={c.active ? 'page' : undefined}>
                {c.label}
              </a>
            ))}
          </nav>
        )}

        {shown.length > 0 ? (
          <>
            <div className="cb-toolbar">
              <p>
                {shown.length} product{shown.length === 1 ? '' : 's'}
              </p>
              <label>
                Sort by{' '}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {Object.entries(SORTS).map(([value, s]) => (
                    <option key={value} value={value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="woocommerce columns-4">
              <ul className="products columns-4">
                {shown.map((p, i) => (
                  <ProductCard key={p.id} product={p} first={i % 4 === 0} last={i % 4 === 3} eager={i < 8} />
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="cb-restock">
            <h2>New {collection.title} arriving soon</h2>
            <p>
              We’re restocking this selection. Message us and we’ll tell you what’s available right now — or browse some of our customer favourites
              below.
            </p>
            <p className="cb-cta">
              <a className="cb-whatsapp-btn cb-whatsapp-btn--small" href={whatsappUrl(contact.whatsapp, `Hi CannaBuddyHub! Do you have any ${collection.title} available?`)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> Ask about {collection.title}
              </a>
              <a className="cb-link" href="/shop/">
                Browse all products →
              </a>
            </p>
            {suggestions.length > 0 && (
              <>
                <Separator />
                <h3>You might like</h3>
                <div className="woocommerce columns-4">
                  <ul className="products columns-4">
                    {suggestions.map((p, i) => (
                      <ProductCard key={p.id} product={p} first={i === 0} last={i === 3} />
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {collection.effectNote && <p className="cb-disclaimer">{EFFECT_NOTE}</p>}
      </Section>

      {(collection.about?.length > 0 || articles.length > 0) && (
        <Section className="height_medium cb-collection-about us_custom_216f3251">
          {collection.about?.length > 0 && (
            <div className="cb-prose cb-about">
              <h2>{collection.aboutTitle || `About ${collection.title}`}</h2>
              {collection.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                <a className="cb-link" href="/faqs/">
                  Learn more about cannabinoids →
                </a>
              </p>
            </div>
          )}
          {articles.length > 0 && (
            <>
              <h2 className="cb-section-title">From the blog</h2>
              <ArticleCards articles={articles} />
            </>
          )}
        </Section>
      )}
    </>
  )
}
