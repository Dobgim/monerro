import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSiteState } from '../store/siteStore'
import menuProducts from '../data/menuProducts'
import usePageTitle from '../hooks/usePageTitle'
import { productPath, productSlug } from '../lib/links'
import { Section, Separator } from '../components/common/Section'
import ProductCard from '../components/home/ProductCard'
import ComingSoonPage from './ComingSoonPage'
import ProductGallery from '../components/product/ProductGallery'
import { galleryOf } from '../lib/gallery'
import { planUnitPrice, subscriptionPlans } from '../lib/subscription'
import { alsoBought, longDescription, productMeta, profileRows, shortDescription } from '../lib/productDetails'
import { money, whatsappUrl } from '../lib/whatsapp'

function PriceLine({ price }) {
  if (!price) return null
  if (price.type === 'sale')
    return (
      <p className="cb-product__price">
        <del>${price.regular}</del> <ins>${price.sale}</ins>
      </p>
    )
  if (price.type === 'range')
    return (
      <p className="cb-product__price">
        ${price.min} – ${price.max}
      </p>
    )
  return (
    <p className="cb-product__price">
      {price.prefix ? `${price.prefix} ` : ''}${price.amount}
    </p>
  )
}

function Stars({ rating }) {
  const pct = Math.max(0, Math.min(100, (Number(rating) / 5) * 100))
  return (
    <span className="cb-stars" aria-hidden="true">
      <span className="cb-stars__fill" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
      ★★★★★
    </span>
  )
}

function MetaLinks({ label, links }) {
  if (!links.length) return null
  return (
    <span className="cb-product__metarow">
      <strong>{links.length > 1 && label.endsWith('y') ? `${label.slice(0, -1)}ies` : label}:</strong>{' '}
      {links.map((l, i) => (
        <span key={l.label}>
          {i > 0 && ', '}
          {l.href ? <a href={l.href}>{l.label}</a> : l.label}
        </span>
      ))}
    </span>
  )
}

// Products shown inside the mega menus aren't all in the home-page catalog; they still get a page.
const menuOnly = Object.values(menuProducts).flatMap((c) => c.products)

export default function ProductPage() {
  const { slug } = useParams()
  const products = useSiteState((s) => s.products)
  const phone = useSiteState((s) => s.contact)
  const { items, addToCart } = useCart()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const brands = useSiteState((s) => s.brands)
  const [qty, setQty] = useState(1)
  const [planIndex, setPlanIndex] = useState(-1) // -1 = one-time purchase
  const [tab, setTab] = useState('description')

  const product = products.find((p) => productSlug(p) === slug) || menuOnly.find((p) => productSlug(p) === slug)
  usePageTitle(product?.name || 'Product not found')

  if (!product) return <ComingSoonPage title="Product not found" message="We couldn’t find that product. It may have been removed or renamed." />

  const inCatalog = products.includes(product)
  const inStock = product.stock !== 'outofstock'
  const bought = alsoBought(product, products)
  const related = products.filter((p) => p.visible && p.id !== product.id && !bought.includes(p)).slice(0, 4)
  const plans = inCatalog ? subscriptionPlans(product) : []
  const plan = plans[planIndex] || null
  const from = product.price?.type === 'range' ? 'from ' : ''
  const meta = productMeta(product, brands)
  const profile = profileRows(product)
  const reviews = (product.reviews || []).filter((r) => r.text || r.rating)
  const hasInfo = profile.length > 0 || product.suggestedUse || product.ingredients || product.coaUrl
  const reviewUrl = whatsappUrl(phone.whatsapp, `Hi CannaBuddyHub! I’d like to leave a review for ${product.name}:\n\nRating (1–5): \nMy review: `)
  const lineInCart = items.some((i) => i.key === `${product.id}|${plan ? plan.interval : 'once'}`)

  return (
    <>
      <Section className="height_medium cb-page cb-product">
        <nav className="cb-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/shop/">Shop</a> <span aria-hidden="true">/</span>{' '}
          <span aria-current="page">{product.name}</span>
        </nav>
        <div className="cb-product__grid">
          <div className="cb-product__media">
            <ProductGallery
              images={galleryOf(product)}
              alt={product.imageAlt || product.name}
              badge={(product.onSale || product.price?.type === 'sale') && <span className="onsale">Sale!</span>}
            />
          </div>
          <div className="cb-product__summary">
            <h1>{product.name}</h1>
            {product.rating != null && (
              <p className="cb-product__rating" aria-label={`Rated ${Number(product.rating).toFixed(2)} out of 5`}>
                <span aria-hidden="true">★★★★★</span> {Number(product.rating).toFixed(2)} out of 5
              </p>
            )}
            {inCatalog ? <PriceLine price={product.price} /> : <p className="cb-product__price">Call for price</p>}
            {product.price?.subscribeDiscount && (
              <p className="cb-product__sub">
                Subscribe &amp; Save up to <strong>{product.price.subscribeDiscount}</strong>
              </p>
            )}
            <p className={`cb-product__stock ${inStock ? 'is-in' : 'is-out'}`}>{inStock ? 'In stock' : 'Out of stock'}</p>

            <div className="cb-product__description cb-product__short">
              <p>{shortDescription(product)}</p>
            </div>

            {inCatalog && inStock && plans.length > 0 && (
              <fieldset className="cb-plans">
                <legend className="screen-reader-text">Purchase options</legend>
                <label className={`cb-plan-opt${planIndex < 0 ? ' is-on' : ''}`}>
                  <input type="radio" name="plan" checked={planIndex < 0} onChange={() => setPlanIndex(-1)} />
                  <span className="cb-plan-opt__name">One-time purchase</span>
                  <span className="cb-plan-opt__price">
                    {from}
                    {money(planUnitPrice(product, null))}
                  </span>
                </label>
                <label className={`cb-plan-opt${planIndex >= 0 ? ' is-on' : ''}`}>
                  <input type="radio" name="plan" checked={planIndex >= 0} onChange={() => setPlanIndex(0)} />
                  <span className="cb-plan-opt__name">
                    Subscribe &amp; Save <em>up to {plans[0].off}% off</em>
                  </span>
                  <span className="cb-plan-opt__price">
                    {from}
                    {money(planUnitPrice(product, plans[Math.max(planIndex, 0)]))}
                  </span>
                  {planIndex >= 0 && (
                    <span className="cb-plan-opt__every">
                      Deliver{' '}
                      <select value={planIndex} onChange={(e) => setPlanIndex(Number(e.target.value))} aria-label="Delivery frequency">
                        {plans.map((pl, i) => (
                          <option key={pl.interval} value={i}>
                            {pl.label.toLowerCase()} ({pl.off}% off)
                          </option>
                        ))}
                      </select>
                      <small>Cancel or change anytime — just message us.</small>
                    </span>
                  )}
                </label>
              </fieldset>
            )}

            {inCatalog && inStock && (
              <div className="cb-qty" role="group" aria-label="Quantity">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)))}
                  aria-label="Quantity"
                />
                <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity">
                  +
                </button>
              </div>
            )}

            <div className="cb-product__actions">
              {inCatalog && inStock && (
                <button
                  type="button"
                  className="w-btn us-btn-style_1"
                  onClick={() => {
                    addToCart(product, qty, plan)
                    setAdded(true)
                  }}
                >
                  <span className="w-btn-label">{added ? 'Added — add another' : 'Add to cart'}</span>
                </button>
              )}
              {inCatalog && inStock && (
                <button
                  type="button"
                  className="cb-checkout-btn"
                  onClick={() => {
                    // make sure this product is in the order, then go to checkout
                    if (!lineInCart || qty > 1) addToCart(product, qty, plan)
                    navigate('/checkout/')
                  }}
                >
                  Proceed to checkout →
                </button>
              )}
              {added && (
                <a className="cb-product__viewcart" href="/cart/">
                  View cart →
                </a>
              )}
            </div>
            <p className="cb-product__call">
              Or call us: <a href={phone.phoneHref}>{phone.phone}</a>
            </p>
            {(meta.categories.length > 0 || meta.features.length > 0 || meta.brand) && (
              <div className="cb-product__meta">
                <MetaLinks label="Category" links={meta.categories} />
                <MetaLinks label="Features" links={meta.features} />
                {meta.brand && <MetaLinks label="Brand" links={[meta.brand]} />}
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section className="height_small cb-tabs-section">
        <div className="cb-tabs" role="tablist" aria-label="Product details">
          {[
            ['description', 'Description'],
            ...(hasInfo ? [['info', 'Additional information']] : []),
            ['reviews', `Reviews (${reviews.length})`],
          ].map(([id, label]) => (
            <button key={id} type="button" role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls={`panel-${id}`} className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <div className="cb-tabpanel" role="tabpanel" id="panel-description" aria-labelledby="tab-description">
            <h2>Description</h2>
            {longDescription(product).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            {!hasInfo && (
              <p className="cb-tabpanel__note">
                Lab results (COA) for our products are available on request — see our <a href="/lab-results/">lab results</a> page.
              </p>
            )}
          </div>
        )}

        {tab === 'info' && hasInfo && (
          <div className="cb-tabpanel" role="tabpanel" id="panel-info" aria-labelledby="tab-info">
            {profile.length > 0 && (
              <>
                <h2>Cannabinoid profile</h2>
                <table className="cb-profile">
                  <tbody>
                    {profile.map((r) => (
                      <tr key={r.label}>
                        <th scope="row">{r.label}</th>
                        <td>{r.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {product.suggestedUse && (
              <>
                <h3>Suggested use</h3>
                <p>{product.suggestedUse}</p>
              </>
            )}
            {product.ingredients && (
              <>
                <h3>Ingredients</h3>
                <p>{product.ingredients}</p>
              </>
            )}
            {product.coaUrl && (
              <p>
                <a className="cb-coa" href={product.coaUrl} target="_blank" rel="noreferrer">
                  View lab results (COA) ↗
                </a>
              </p>
            )}
          </div>
        )}

        {tab === 'reviews' && (
          <div className="cb-tabpanel" role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews">
            <h2>{reviews.length ? `${reviews.length} review${reviews.length > 1 ? 's' : ''} for ${product.name}` : 'Reviews'}</h2>
            {product.rating != null && (
              <p className="cb-reviews__avg">
                <Stars rating={product.rating} /> <strong>{Number(product.rating).toFixed(2)}</strong> out of 5
              </p>
            )}
            {reviews.length > 0 ? (
              <ol className="cb-reviews">
                {reviews.map((r, i) => (
                  <li key={i} className="cb-review">
                    <p className="cb-review__head">
                      {r.rating ? <Stars rating={r.rating} /> : null}
                      <strong>{r.name || 'Verified customer'}</strong>
                      {r.date && <span className="cb-review__date"> – {r.date}</span>}
                    </p>
                    {r.text && <p>{r.text}</p>}
                  </li>
                ))}
              </ol>
            ) : (
              <p>There are no written reviews yet. Bought this product? Be the first to tell others what you think.</p>
            )}
            <a className="cb-review-btn" href={reviewUrl} target="_blank" rel="noreferrer">
              Write a review on WhatsApp
            </a>
          </div>
        )}
      </Section>

      {bought.length > 0 && (
        <Section className="height_medium cb-related cb-alsobought">
          <h2 style={{ textAlign: 'center' }}>Customers Also Bought</h2>
          <Separator />
          <div className="woocommerce columns-4">
            <ul className="products columns-4">
              {bought.map((p, i) => (
                <ProductCard key={p.id} product={p} first={i === 0} last={i === 3} />
              ))}
            </ul>
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section className="height_medium cb-related">
          <h2 style={{ textAlign: 'center' }}>You may also like</h2>
          <Separator />
          <div className="woocommerce columns-4">
            <ul className="products columns-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} first={i === 0} last={i === 3} />
              ))}
            </ul>
          </div>
        </Section>
      )}
      <link rel="canonical" href={`https://cannabuddyhub.com${productPath(product)}`} />
    </>
  )
}
