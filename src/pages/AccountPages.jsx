import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useSiteState } from '../store/siteStore'
import usePageTitle from '../hooks/usePageTitle'
import { loadOrders } from '../lib/orders'
import { money, whatsappUrl } from '../lib/whatsapp'
import { productPath } from '../lib/links'
import { brandSlug, brandName, productMatchesBrand, CANNABINOIDS, TYPES, EFFECTS } from '../lib/catalog'
import { ARTICLES } from '../content/blog'
import { PAGES } from '../content/pages'
import { Section } from '../components/common/Section'
import PageHero from '../components/common/PageHero'
import WhatsAppIcon from '../components/common/WhatsAppIcon'

export function MyAccountPage() {
  usePageTitle('My Account')
  const [orders] = useState(loadOrders)
  const { count } = useCart()
  const contact = useSiteState((s) => s.contact)

  return (
    <Section className="height_medium cb-page cb-account">
      <PageHero eyebrow="Welcome" title="My Account" intro="No sign-up needed — you can order as a guest. Your recent orders from this device are listed below." />
      <div className="cb-account__tiles">
        <a className="cb-tile" href="/cart/">
          <strong>Your cart</strong>
          <span>
            {count} item{count === 1 ? '' : 's'}
          </span>
        </a>
        <a className="cb-tile" href="/shop/">
          <strong>Shop</strong>
          <span>Browse all products</span>
        </a>
        <a className="cb-tile" href={whatsappUrl(contact.whatsapp, 'Hi CannaBuddyHub! I have a question about my order.')} target="_blank" rel="noopener noreferrer">
          <strong>Order help</strong>
          <span>Message us on WhatsApp</span>
        </a>
      </div>

      <h2 className="cb-section-title">Recent orders</h2>
      {orders.length === 0 ? (
        <p className="cb-page__empty">
          You haven’t placed an order from this device yet. <a href="/shop/">Start shopping</a>
        </p>
      ) : (
        <ul className="cb-orders">
          {orders.map((o) => (
            <li key={o.id} className="cb-checkout__card">
              <div className="cb-orders__head">
                <strong>{new Date(o.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                <span>
                  {o.method} · {o.fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}
                </span>
              </div>
              <ul className="cb-orders__items">
                {o.items.map((it, i) => (
                  <li key={i}>
                    {it.image && <img src={it.image} alt="" />}
                    <span>
                      {it.qty} × {it.name}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="cb-orders__foot">
                <span>
                  Total: <strong>{o.fromPrice ? 'from ' : ''}{money(o.total)}</strong>
                </span>
                <a className="cb-whatsapp-btn cb-whatsapp-btn--small" href={o.href} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={16} /> Send again
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

export function BrandsPage() {
  usePageTitle('Shop by Cannabis Brand')
  const brands = useSiteState((s) => s.brands).filter((b) => b.visible)
  const products = useSiteState((s) => s.products).filter((p) => p.visible)
  return (
    <Section className="height_medium cb-page cb-brands">
      <PageHero eyebrow="Shop" title="Shop by Cannabis Brand" intro="We partner with brands that test their products with independent labs. Pick a brand to see what we carry." />
      <ul className="cb-brand-grid">
        {brands.map((b) => {
          const n = products.filter((p) => productMatchesBrand(p, b)).length
          return (
            <li key={b.id}>
              <a href={`/product-brands/${brandSlug(b)}/`}>
                <span className="cb-brand-grid__logo">
                  <img src={b.image} alt="" loading="lazy" />
                </span>
                <strong>{brandName(b)}</strong>
                <span>{n ? `${n} product${n === 1 ? '' : 's'}` : 'View brand'}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

export function SitemapPage() {
  usePageTitle('Sitemap')
  const products = useSiteState((s) => s.products).filter((p) => p.visible)
  const brands = useSiteState((s) => s.brands).filter((b) => b.visible)
  const groups = [
    ['Shop', [['Home', '/'], ['All Products', '/shop/'], ['Sales & Deals', '/product-category/on-sale/'], ['What’s New', '/whats-new-at-cannabuddy/'], ['Product Bundles', '/product-category/bundles/'], ['Brands', '/cannabis-brands/'], ['Cart', '/cart/']]],
    ['Shop by Cannabinoid', CANNABINOIDS.map((c) => [c.label, `/product-category/${c.slug}/`])],
    ['Shop by Type', TYPES.map((t) => [t.label, `/shop-by-type/${t.slug}/`])],
    ['Shop by Effect', EFFECTS.map((e) => [e.label, `/shop-by-effect/${e.slug}/`])],
    ['Company', [['Our Story', '/about-us/'], ['Contact Us', '/contact-us/'], ['Locations', '/locations/'], ['Wholesale', '/wholesale/'], ['My Account', '/my-account/']]],
    ['Help', Object.entries(PAGES).map(([slug, p]) => [p.title, `/${slug}/`])],
    ['Cannabis Blog', [['All articles', '/blog/'], ...ARTICLES.map((a) => [a.title, `/${a.slug}/`])]],
    ['Brands', brands.map((b) => [brandName(b), `/product-brands/${brandSlug(b)}/`])],
    ['Products', products.map((p) => [p.name, productPath(p)])],
  ]
  return (
    <Section className="height_medium cb-page cb-sitemap">
      <PageHero title="Sitemap" intro="Every page on CannaBuddyHub in one place." />
      <div className="cb-sitemap__grid">
        {groups.map(([title, links]) => (
          <section key={title}>
            <h2>{title}</h2>
            <ul>
              {links.map(([label, href]) => (
                <li key={href + label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  )
}
