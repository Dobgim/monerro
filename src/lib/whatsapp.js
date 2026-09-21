import { unitPrice } from './links'

// WhatsApp "click to chat": https://wa.me/<number>?text=<message>
// The number must be digits only, with the country code and no "+".
export function whatsappUrl(number, text) {
  const digits = String(number || '').replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

const money = (n) => `$${n.toFixed(2)}`

function priceLabel(product, qty) {
  const each = unitPrice(product.price)
  const from = product.price?.type === 'range' ? 'from ' : ''
  return qty > 1 ? `${from}${money(each)} each = ${from}${money(each * qty)}` : `${from}${money(each)}`
}

/** The order text the customer sends us on WhatsApp. */
export function orderMessage(lines, subtotal) {
  const hasRange = lines.some(({ product }) => product?.price?.type === 'range')
  const items = lines.map(({ item, product }) => `• ${item.qty} × ${product ? product.name : item.name}${product ? ` — ${priceLabel(product, item.qty)}` : ''}`)
  return [
    'Hi CannaBuddyHub! I’d like to place this order:',
    '',
    ...items,
    '',
    `Subtotal: ${hasRange ? 'from ' : ''}${money(subtotal)}`,
    hasRange ? '(Some items come in different sizes — please confirm the size and price.)' : null,
    '',
    'My name:',
    'Delivery address or pickup:',
  ]
    .filter((line) => line !== null)
    .join('\n')
}

/** Message for buying a single product straight from its page. */
export function productMessage(product) {
  return [`Hi CannaBuddyHub! I’d like to buy:`, '', `• 1 × ${product.name}${product.price ? ` — ${priceLabel(product, 1)}` : ''}`, '', 'My name:', 'Delivery address or pickup:'].join('\n')
}
