import { useCart } from '../context/CartContext'
import { useSiteState } from '../store/siteStore'
import usePageTitle from '../hooks/usePageTitle'
import { productPath, unitPrice } from '../lib/links'
import { Section, Separator } from '../components/common/Section'

export default function CartPage() {
  const { items, setQty, removeItem } = useCart()
  const products = useSiteState((s) => s.products)
  usePageTitle('Cart')

  const lines = items.map((item) => ({ item, product: products.find((p) => p.id === item.id) }))
  const subtotal = lines.reduce((sum, { item, product }) => sum + (product ? unitPrice(product.price) * item.qty : 0), 0)

  return (
    <Section className="height_medium cb-page cb-cart">
      <h1 style={{ textAlign: 'center' }}>Your Cart</h1>
      <Separator />
      {lines.length === 0 ? (
        <p className="cb-page__empty">
          Your cart is empty. <a href="/shop/">Browse the shop</a>
        </p>
      ) : (
        <>
          <table className="cb-cart__table">
            <thead>
              <tr>
                <th colSpan={2}>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>
                  <span className="screen-reader-text">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map(({ item, product }) => {
                const price = product ? unitPrice(product.price) : 0
                return (
                  <tr key={item.id}>
                    <td className="cb-cart__thumb">{product && <img src={product.image} alt="" />}</td>
                    <td data-label="Product">{product ? <a href={productPath(product)}>{product.name}</a> : item.name}</td>
                    <td data-label="Price">
                      ${price.toFixed(2)}
                      {product?.price?.type === 'range' && <small> (from)</small>}
                    </td>
                    <td data-label="Quantity">
                      <div className="cb-qty">
                        <button type="button" aria-label={`One fewer ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)}>
                          −
                        </button>
                        <span aria-live="polite">{item.qty}</span>
                        <button type="button" aria-label={`One more ${item.name}`} onClick={() => setQty(item.id, item.qty + 1)}>
                          +
                        </button>
                      </div>
                    </td>
                    <td data-label="Total">${(price * item.qty).toFixed(2)}</td>
                    <td>
                      <button type="button" className="cb-cart__remove" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}>
                        ×
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="cb-cart__summary">
            <p>
              Subtotal: <strong>${subtotal.toFixed(2)}</strong>
            </p>
            <a className="cb-checkout-btn cb-checkout-btn--block" href="/checkout/">
              Proceed to checkout →
            </a>
            <p className="cb-cart__note">
              Choose PayPal, Venmo, Zelle, Bitcoin or Cash App on the next page, then send your order to us on WhatsApp.
            </p>
            <p>
              <a href="/shop/">← Continue shopping</a>
            </p>
          </div>
        </>
      )}
    </Section>
  )
}
