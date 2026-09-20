import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSiteState } from '../../store/siteStore'
import ActivityChart from '../components/ActivityChart'
import Icon from '../components/Icon'
import { timeAgo } from '../format'

const DAYS = 14

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

  const visible = products.filter((p) => p.visible).length
  const outOfStock = products.filter((p) => p.stock === 'outofstock').length

  return (
    <>
      <h1>Dashboard</h1>

      <div className="welcome-panel">
        <h2>Welcome to CannaBuddy!</h2>
        <p className="about-description">Here’s how to look after your shop.</p>
        <div className="welcome-panel-column-container">
          <div className="welcome-panel-column">
            <h3>Get started</h3>
            <Link to="/admin/products/new" className="button button-primary button-hero">
              Add a new product
            </Link>
            <p className="hide-if-no-customize">or, <Link to="/admin/products">edit the products you have</Link></p>
          </div>
          <div className="welcome-panel-column">
            <h3>Next steps</h3>
            <ul>
              <li>
                <Link to="/admin/products" className="welcome-icon">
                  <Icon name="products" size={16} /> Change a price or photo
                </Link>
              </li>
              <li>
                <Link to="/admin/announcement" className="welcome-icon">
                  <Icon name="megaphone" size={16} /> Edit the banner at the top
                </Link>
              </li>
              <li>
                <a href="/" target="_blank" rel="noreferrer" className="welcome-icon">
                  <Icon name="external" size={16} /> View your site
                </a>
              </li>
            </ul>
          </div>
          <div className="welcome-panel-column">
            <h3>More actions</h3>
            <ul>
              <li>
                <Link to="/admin/slides" className="welcome-icon">
                  <Icon name="slides" size={16} /> Change the big banner photos
                </Link>
              </li>
              <li>
                <Link to="/admin/subscribers" className="welcome-icon">
                  <Icon name="mail" size={16} /> See newsletter sign-ups
                </Link>
              </li>
              <li>
                <Link to="/admin/settings" className="welcome-icon">
                  <Icon name="settings" size={16} /> Change your password
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="cb-dashboard-columns">
        <div className="postbox">
          <div className="postbox-header">
            <h2>At a Glance</h2>
          </div>
          <div className="inside">
            <ul className="cb-glance">
              <li>
                <Link to="/admin/products">
                  <Icon name="products" size={18} /> {products.length} Products
                </Link>
              </li>
              <li>
                <Link to="/admin/slides">
                  <Icon name="slides" size={18} /> {slides.length} Hero slides
                </Link>
              </li>
              <li>
                <Link to="/admin/brands">
                  <Icon name="brands" size={18} /> {brands.length} Brands
                </Link>
              </li>
              <li>
                <Link to="/admin/subscribers">
                  <Icon name="mail" size={18} /> {subscribers.length} Subscriber{subscribers.length === 1 ? '' : 's'}
                </Link>
              </li>
            </ul>
            <p className="cb-glance__note">
              {visible} of {products.length} products are shown on the home page
              {outOfStock > 0 && (
                <>
                  {' · '}
                  <Link to="/admin/products?filter=outofstock">{outOfStock} out of stock</Link>
                </>
              )}
              .
            </p>
          </div>
        </div>

        <div className="postbox">
          <div className="postbox-header">
            <h2>Activity</h2>
          </div>
          <div className="inside">
            <ActivityChart data={daily} />
            <h3>Most added to cart</h3>
            {topProducts.length ? (
              <ul className="cb-toplist">
                {topProducts.map(({ product, name, count }) => (
                  <li key={product?.id || name}>
                    {product?.image ? <img src={product.image} alt="" /> : <span className="cb-thumb-ph" />}
                    <span className="cb-toplist__name">{product?.name || name}</span>
                    <span className="cb-toplist__count">{count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="description">Nothing yet. When shoppers click “Add to cart” on your site, it shows up here.</p>
            )}
          </div>
        </div>

        <div className="postbox">
          <div className="postbox-header">
            <h2>Newsletter sign-ups</h2>
          </div>
          <div className="inside">
            {subscribers.length ? (
              <ul className="cb-simplelist">
                {subscribers.slice(0, 5).map((s) => (
                  <li key={s.email}>
                    <a href={`mailto:${s.email}`}>{s.email}</a>
                    <time dateTime={s.at}>{timeAgo(s.at)}</time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="description">No sign-ups yet. They come from the form at the bottom of your site.</p>
            )}
            <p>
              <Link to="/admin/subscribers">See all sign-ups</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
