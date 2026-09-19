import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSiteState } from '../../store/siteStore'
import ActivityChart from '../components/ActivityChart'
import Icon from '../components/Icon'
import { Card, EmptyState, PageHeader } from '../components/ui'
import { timeAgo } from '../format'

const DAYS = 14

function StatTile({ label, value, detail, to, icon }) {
  return (
    <Link to={to} className="adm-stat">
      <span className="adm-stat__icon">
        <Icon name={icon} size={18} />
      </span>
      <span className="adm-stat__label">{label}</span>
      <strong className="adm-stat__value">{value.toLocaleString()}</strong>
      {detail && <span className="adm-stat__detail">{detail}</span>}
    </Link>
  )
}

export default function Overview() {
  const { products, slides, brands, subscribers, cartEvents } = useSiteState()

  const daily = useMemo(() => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      days.push({
        key: d.toISOString().slice(0, 10),
        short: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        long: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }),
        value: 0,
      })
    }
    const index = Object.fromEntries(days.map((d, i) => [d.key, i]))
    cartEvents.forEach((e) => {
      const d = new Date(e.at)
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10)
      if (key in index) days[index[key]].value++
    })
    return days
  }, [cartEvents])

  const topProducts = useMemo(() => {
    const counts = {}
    cartEvents.forEach((e) => (counts[e.productId] = (counts[e.productId] || 0) + 1))
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({ product: products.find((p) => String(p.id) === id), name: cartEvents.findLast((e) => String(e.productId) === id)?.name, count }))
  }, [cartEvents, products])

  const visible = products.filter((p) => p.visible)
  const onSale = products.filter((p) => p.onSale || p.price?.type === 'sale')
  const outOfStock = products.filter((p) => p.stock === 'outofstock')
  const topMax = topProducts[0]?.count || 1

  return (
    <>
      <PageHeader title="Overview" description="Everything on the CannaBuddy home page, at a glance." />

      <div className="adm-stats">
        <StatTile label="Products on home page" value={visible.length} detail={`of ${products.length} in catalog`} to="/admin/products" icon="products" />
        <StatTile label="On sale" value={onSale.length} detail="showing a Sale badge" to="/admin/products?filter=sale" icon="tag" />
        <StatTile label="Out of stock" value={outOfStock.length} detail={outOfStock.length ? 'needs attention' : 'all in stock'} to="/admin/products?filter=outofstock" icon="alert" />
        <StatTile label="Newsletter subscribers" value={subscribers.length} detail={subscribers[0] ? `latest ${timeAgo(subscribers[0].at)}` : 'none yet'} to="/admin/subscribers" icon="mail" />
      </div>

      <div className="adm-grid-2">
        <Card title="Add-to-cart activity">
          <ActivityChart data={daily} />
        </Card>
        <Card title="Most added products">
          {topProducts.length ? (
            <ol className="adm-toplist">
              {topProducts.map(({ product, name, count }) => (
                <li key={product?.id || name}>
                  {product?.image ? <img src={product.image} alt="" /> : <span className="adm-thumb-ph" />}
                  <div>
                    <span className="adm-toplist__name">{product?.name || name}</span>
                    <span className="adm-toplist__meter" aria-hidden="true">
                      <span style={{ width: `${(count / topMax) * 100}%` }} />
                    </span>
                  </div>
                  <strong>{count}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState icon="cart" title="No cart activity yet">
              When shoppers click “Add to cart” on the storefront, it shows up here.
            </EmptyState>
          )}
        </Card>
      </div>

      <div className="adm-grid-3">
        <Card title="Home page content">
          <ul className="adm-checklist">
            <li>
              <Icon name="slides" /> {slides.filter((s) => s.visible).length} of {slides.length} hero slides showing
              <Link to="/admin/slides">Manage</Link>
            </li>
            <li>
              <Icon name="brands" /> {brands.filter((b) => b.visible).length} of {brands.length} brands showing
              <Link to="/admin/brands">Manage</Link>
            </li>
            <li>
              <Icon name="megaphone" /> Announcement bar
              <Link to="/admin/announcement">Edit</Link>
            </li>
          </ul>
        </Card>
        <Card title="Latest subscribers" className="adm-span-2">
          {subscribers.length ? (
            <ul className="adm-simplelist">
              {subscribers.slice(0, 5).map((s) => (
                <li key={s.email}>
                  <span>{s.email}</span>
                  <time dateTime={s.at}>{timeAgo(s.at)}</time>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="mail" title="No subscribers yet">
              Sign-ups from the footer form on the storefront appear here.
            </EmptyState>
          )}
        </Card>
      </div>
    </>
  )
}
