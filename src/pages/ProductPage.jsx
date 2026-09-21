import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSiteState } from '../store/siteStore'
import menuProducts from '../data/menuProducts'
import usePageTitle from '../hooks/usePageTitle'
import { productPath, productSlug } from '../lib/links'
import { Section, Separator } from '../components/common/Section'
import ProductCard from '../components/home/ProductCard'
import ComingSoonPage from './ComingSoonPage'
import WhatsAppIcon from '../components/common/WhatsAppIcon'
import { productMessage, whatsappUrl } from '../lib/whatsapp'

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

// Products shown inside the mega menus aren't all in the home-page catalog; they still get a page.
const menuOnly = Object.values(menuProducts).flatMap((c) => c.products)

export default function ProductPage() {
  const { slug } = useParams()
  const products = useSiteState((s) => s.products)
  const phone = useSiteState((s) => s.contact)
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const product = products.find((p) => productSlug(p) === slug) || menuOnly.find((p) => productSlug(p) === slug)
  usePageTitle(product?.name || 'Product not found')

  if (!product) return <ComingSoonPage title="Product not found" message="We couldn’t find that product. It may have been removed or renamed." />

  const inCatalog = products.includes(product)
  const inStock = product.stock !== 'outofstock'
  const related = products.filter((p) => p.visible && p.id !== product.id).slice(0, 4)

  return (
    <>
      <Section className="height_medium cb-page cb-product">
        <nav className="cb-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/shop/">Shop</a> <span aria-hidden="true">/</span>{' '}
          <span aria-current="page">{product.name}</span>
        </nav>
        <div className="cb-product__grid">
          <div className="cb-product__media">
            {(product.onSale || product.price?.type === 'sale') && <span className="onsale">Sale!</span>}
            <img src={product.image} alt={product.imageAlt || product.name} width="680" height="680" />
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

            {product.description ? (
              <div className="cb-product__description">
                {product.description.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="cb-product__description">Questions about this product? Our team is happy to help — give us a call.</p>
            )}

            <div className="cb-product__actions">
              {inCatalog && inStock && (
                <button
                  type="button"
                  className="w-btn us-btn-style_1"
                  onClick={() => {
                    addToCart(product)
                    setAdded(true)
                  }}
                >
                  <span className="w-btn-label">{added ? 'Added — add another' : 'Add to cart'}</span>
                </button>
              )}
              {inStock && (
                <a className="cb-whatsapp-btn cb-whatsapp-btn--small" href={whatsappUrl(phone.whatsapp, productMessage(product))} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={18} />
                  Buy on WhatsApp
                </a>
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
          </div>
        </div>
      </Section>

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
