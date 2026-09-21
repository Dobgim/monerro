import { unitPrice } from './links'

// WhatsApp "click to chat": https://wa.me/<number>?text=<message>
// The number must be digits only, with the country code and no "+".
export function whatsappUrl(number, text) {
  const digits = String(number || '').replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export const money = (n) => `$${n.toFixed(2)}`

function priceLabel(product, qty) {
  const each = unitPrice(product.price)
  const from = product.price?.type === 'range' ? 'from ' : ''
  return qty > 1 ? `${from}${money(each)} each = ${from}${money(each * qty)}` : `${from}${money(each)}`
}

/**
 * The order the customer sends from the checkout page.
 * lines: [{ item, product }], customer: { name, phone, fulfilment, address, note }, method: payment method with account
 */
export function checkoutMessage({ lines, subtotal, customer, method }) {
  const hasRange = lines.some(({ product }) => product?.price?.type === 'range')
  const items = lines.map(({ item, product }) => `• ${item.qty} × ${product ? product.name : item.name}${product ? ` — ${priceLabel(product, item.qty)}` : ''}`)
  const payLine = method.account
    ? `I’ll pay by ${method.label} to: ${method.account}`
    : `I’ll pay by ${method.label} — please send me your ${method.label} details.`

  return [
    'Hi CannaBuddyHub! I’d like to place this order:',
    '',
    ...items,
    '',
    `Total: ${hasRange ? 'from ' : ''}${money(subtotal)}`,
    hasRange ? '(Some items come in different sizes — please confirm the size and final price.)' : null,
    '',
    `💳 Payment: ${method.label}`,
    payLine,
    '',
    `Name: ${customer.name}`,
    customer.phone ? `Phone: ${customer.phone}` : null,
    customer.fulfilment === 'delivery' ? `Delivery to: ${customer.address}` : 'Pickup: I’ll collect the order',
    customer.note ? `Note: ${customer.note}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')
}
