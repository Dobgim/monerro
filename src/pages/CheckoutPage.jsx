import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useSiteState } from '../store/siteStore'
import usePageTitle from '../hooks/usePageTitle'
import { productPath, unitPrice } from '../lib/links'
import { enabledMethods } from '../lib/payments'
import { checkoutMessage, money, whatsappUrl } from '../lib/whatsapp'
import { Section, Separator } from '../components/common/Section'
import WhatsAppIcon from '../components/common/WhatsAppIcon'

const EMPTY_CUSTOMER = { name: '', phone: '', fulfilment: 'delivery', address: '', note: '' }

function validate(customer, methodId) {
  const e = {}
  if (!customer.name.trim()) e.name = 'Please enter your name.'
  if (customer.fulfilment === 'delivery' && !customer.address.trim()) e.address = 'Please enter the delivery address.'
  if (!methodId) e.method = 'Please choose how you’ll pay.'
  return e
}

export default function CheckoutPage() {
  const { items, setQty, removeItem } = useCart()
  const products = useSiteState((s) => s.products)
  const contact = useSiteState((s) => s.contact)
  const methods = enabledMethods(useSiteState((s) => s.payments))
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER)
  const [methodId, setMethodId] = useState(null)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  usePageTitle('Checkout')

  const lines = items.map((item) => ({ item, product: products.find((p) => p.id === item.id) }))
  const subtotal = lines.reduce((sum, { item, product }) => sum + (product ? unitPrice(product.price) * item.qty : 0), 0)
  const hasRange = lines.some(({ product }) => product?.price?.type === 'range')
  const method = methods.find((m) => m.id === methodId)
  const set = (patch) => {
    setCustomer((c) => ({ ...c, ...patch }))
    setErrors({})
  }

  const href = method ? whatsappUrl(contact.whatsapp, checkoutMessage({ lines, subtotal, customer: { ...customer, name: customer.name.trim(), address: customer.address.trim(), note: customer.note.trim() }, method })) : '#'

  const onPay = (e) => {
    const errs = validate(customer, methodId)
    setErrors(errs)
    if (Object.keys(errs).length) {
      e.preventDefault()
      document.querySelector('.cb-checkout .is-invalid')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    setSent(true)
  }

  if (lines.length === 0) {
    return (
      <Section className="height_medium cb-page cb-checkout">
        <h1 style={{ textAlign: 'center' }}>Checkout</h1>
        <p className="cb-page__empty">
          Your cart is empty. <a href="/shop/">Browse the shop</a> and add something first.
        </p>
      </Section>
    )
  }

  return (
    <Section className="height_medium cb-page cb-checkout">
      <nav className="cb-breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/cart/">Cart</a> <span aria-hidden="true">/</span> <span aria-current="page">Checkout</span>
      </nav>
      <h1>Checkout</h1>
      <Separator />

      <div className="cb-checkout__grid">
        <div className="cb-checkout__main">
          {/* 1. customer */}
          <section className="cb-checkout__card">
            <h2>
              <span className="cb-step">1</span> Your details
            </h2>
            <div className="cb-field">
              <label htmlFor="co-name">Full name *</label>
              <input id="co-name" type="text" autoComplete="name" value={customer.name} onChange={(e) => set({ name: e.target.value })} className={errors.name ? 'is-invalid' : ''} />
              {errors.name && <p className="cb-error">{errors.name}</p>}
            </div>
            <div className="cb-field">
              <label htmlFor="co-phone">Phone number (optional)</label>
              <input id="co-phone" type="tel" autoComplete="tel" value={customer.phone} onChange={(e) => set({ phone: e.target.value })} />
            </div>
            <fieldset className="cb-field cb-toggle-group">
              <legend>How would you like to get your order?</legend>
              {[
                ['delivery', 'Delivery'],
                ['pickup', 'Pickup'],
              ].map(([value, label]) => (
                <label key={value} className={customer.fulfilment === value ? 'is-selected' : ''}>
                  <input type="radio" name="fulfilment" value={value} checked={customer.fulfilment === value} onChange={() => set({ fulfilment: value })} />
                  {label}
                </label>
              ))}
            </fieldset>
            {customer.fulfilment === 'delivery' && (
              <div className="cb-field">
                <label htmlFor="co-address">Delivery address *</label>
                <textarea id="co-address" rows={3} autoComplete="street-address" value={customer.address} onChange={(e) => set({ address: e.target.value })} className={errors.address ? 'is-invalid' : ''} />
                {errors.address && <p className="cb-error">{errors.address}</p>}
              </div>
            )}
            <div className="cb-field">
              <label htmlFor="co-note">Order note (optional)</label>
              <input id="co-note" type="text" value={customer.note} onChange={(e) => set({ note: e.target.value })} placeholder="e.g. best time to deliver" />
            </div>
          </section>

          {/* 2. payment */}
          <section className="cb-checkout__card">
            <h2>
              <span className="cb-step">2</span> Payment method
            </h2>
            <p className="cb-muted">Choose how you’ll pay. We’ll confirm your order and payment on WhatsApp.</p>
            <div className={`cb-paymethods${errors.method ? ' is-invalid' : ''}`} role="radiogroup" aria-label="Payment method">
              {methods.map((m) => (
                <label key={m.id} className={`cb-paymethod${methodId === m.id ? ' is-selected' : ''}`}>
                  <input type="radio" name="payment" value={m.id} checked={methodId === m.id} onChange={() => { setMethodId(m.id); setErrors({}) }} />
                  <span className="cb-paymethod__logo" style={{ background: m.color }} aria-hidden="true">
                    {m.symbol}
                  </span>
                  <span className="cb-paymethod__name">{m.label}</span>
                  <span className="cb-paymethod__check" aria-hidden="true" />
                </label>
              ))}
            </div>
            {errors.method && <p className="cb-error">{errors.method}</p>}
            {method && (
              <div className="cb-payinfo">
                {method.account ? (
                  <>
                    <p>
                      Send your payment by <strong>{method.label}</strong> to:
                    </p>
                    <p className="cb-payinfo__account">{method.account}</p>
                    <p className="cb-muted">Please send it after we confirm your order on WhatsApp.</p>
                  </>
                ) : (
                  <p>
                    We’ll send you our <strong>{method.label}</strong> details on WhatsApp when we confirm your order.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>

        {/* order summary */}
        <aside className="cb-checkout__card cb-checkout__summary">
          <h2>Your order</h2>
          <ul className="cb-summary">
            {lines.map(({ item, product }) => (
              <li key={item.id}>
                {product && <img src={product.image} alt="" />}
                <div className="cb-summary__info">
                  {product ? <a href={productPath(product)}>{product.name}</a> : item.name}
                  <div className="cb-summary__qty">
                    <button type="button" aria-label={`One fewer ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)}>
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" aria-label={`One more ${item.name}`} onClick={() => setQty(item.id, item.qty + 1)}>
                      +
                    </button>
                    <button type="button" className="cb-summary__remove" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <span className="cb-summary__price">
                  {product?.price?.type === 'range' && <small>from </small>}
                  {product ? money(unitPrice(product.price) * item.qty) : ''}
                </span>
              </li>
            ))}
          </ul>
          <div className="cb-summary__total">
            <span>Total</span>
            <strong>
              {hasRange && <small>from </small>}
              {money(subtotal)}
            </strong>
          </div>
          {hasRange && <p className="cb-muted">Some items come in several sizes; we’ll confirm the size and final price with you.</p>}

          <a className="cb-whatsapp-btn cb-whatsapp-btn--block" href={href} target="_blank" rel="noopener noreferrer" onClick={onPay}>
            <WhatsAppIcon />
            Pay on WhatsApp
          </a>
          {sent ? (
            <p className="cb-sent" role="status">
              ✓ WhatsApp is open with your order. Press <strong>Send</strong> and we’ll confirm it shortly.{' '}
              <a href={href} target="_blank" rel="noopener noreferrer">
                Didn’t open? Try again
              </a>
            </p>
          ) : (
            <p className="cb-muted cb-center">Your order and payment choice are sent to us on WhatsApp. Nothing is charged on this website.</p>
          )}
          <p className="cb-center">
            <a href="/cart/">← Back to cart</a>
          </p>
        </aside>
      </div>
    </Section>
  )
}
