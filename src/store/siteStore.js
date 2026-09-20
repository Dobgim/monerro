import { useSyncExternalStore } from 'react'
import featuredProducts from '../data/featuredProducts'
import heroSlides from '../data/heroSlides'
import brands from '../data/brands'

// Single source of truth for everything the admin dashboard can edit.
// Defaults come from src/data; edits are saved in localStorage (there is no backend),
// and a `storage` listener keeps other open tabs (e.g. the storefront) in sync.

const KEY = 'cannabuddy-site-v1'
const listeners = new Set()

export function buttonKindOf(button) {
  if (button.ajax) return 'add'
  if (button.className.includes('product_type_variable')) return 'options'
  return 'more'
}

export const BUTTON_KINDS = {
  add: { label: 'Add to cart', className: 'button product_type_simple add_to_cart_button ajax_add_to_cart' },
  options: { label: 'Select options', className: 'button product_type_variable add_to_cart_button' },
  more: { label: 'Read more', className: 'button product_type_simple' },
}

const BASE_PRODUCT_CLASS = 'has-subscription-plans product type-product status-publish has-post-thumbnail taxable shipping-taxable purchasable'

// The storefront button for a product, honouring the kind chosen in the admin.
export function resolveButton(product) {
  const original = product.button
  if (original && buttonKindOf(original) === product.buttonKind) return original
  const kind = BUTTON_KINDS[product.buttonKind] || BUTTON_KINDS.more
  return {
    label: kind.label,
    className: kind.className,
    ajax: product.buttonKind === 'add',
    href: product.buttonKind === 'add' ? '#' : product.href,
    ariaLabel: `${kind.label}: “${product.name}”`,
  }
}

export function productClassName(product) {
  const base = product.className || `${BASE_PRODUCT_CLASS} post-${product.id} product-type-simple`
  const withoutState = base.split(' ').filter((c) => !['instock', 'outofstock', 'sale'].includes(c))
  return [...withoutState, product.stock === 'outofstock' ? 'outofstock' : 'instock', product.onSale && 'sale'].filter(Boolean).join(' ')
}

const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function buildDefaults() {
  return {
    announcement: {
      enabled: true,
      text: '💙 Buy one Blue Dream 1/8th, get one free September 17–20 with code “bluebogo” at Cart. 💙',
      href: 'https://cannabuddy.com/product/high-thca-flower-blue-dream/',
    },
    products: featuredProducts.flatMap((g) =>
      g.products.map((p) => ({ ...p, visible: true, buttonKind: buttonKindOf(p.button) })),
    ),
    slides: heroSlides.map((s) => ({ ...s, visible: true })),
    brands: brands.map((b, i) => ({ ...b, id: `brand-${i}`, visible: true })),
    contact: {
      // shown as "Customer Support" in the footer; editable in Admin → Settings
      phone: '(510) 394-2813',
      phoneHref: 'tel:+15103942813',
    },
    subscribers: [],
    cartEvents: [],
    admin: {
      username: 'admin',
      email: 'admin@cannabuddy.com',
      // SHA-256 of the default password "cannabuddy123" — change it in Settings
      passwordHash: '3c2b93bca2df4c1e16b4e40cb0638078cfd921ebb033293e3ade19153fa43d16',
    },
    updatedAt: null,
  }
}

function load() {
  const defaults = buildDefaults()
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    // admin is merged (not replaced) so data saved by older versions still gains new fields
    return saved ? { ...defaults, ...saved, admin: { ...defaults.admin, ...saved.admin }, contact: { ...defaults.contact, ...saved.contact } } : defaults
  } catch {
    return defaults
  }
}

let state = load()

function emit() {
  listeners.forEach((l) => l())
}

// Returns false (and keeps the old state) when the browser's storage quota is exceeded,
// which can happen after uploading many large images.
export function setState(updater) {
  const next = { ...(typeof updater === 'function' ? updater(state) : { ...state, ...updater }), updatedAt: new Date().toISOString() }
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    return false
  }
  state = next
  emit()
  return true
}

export function getState() {
  return state
}

export function resetState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
  state = buildDefaults()
  emit()
}

export function importState(data) {
  return setState(() => ({ ...buildDefaults(), ...data }))
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return
    state = load()
    emit()
  })
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSiteState(selector = (s) => s) {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state))
}

// ---- collection helpers ----------------------------------------------------

export function upsert(collection, item, idPrefix) {
  return setState((s) => {
    const list = s[collection]
    if (item.id && list.some((x) => x.id === item.id)) {
      return { ...s, [collection]: list.map((x) => (x.id === item.id ? item : x)) }
    }
    return { ...s, [collection]: [{ ...item, id: item.id || uid(idPrefix) }, ...list] }
  })
}

export function remove(collection, id) {
  return setState((s) => ({ ...s, [collection]: s[collection].filter((x) => x.id !== id) }))
}

export function move(collection, id, delta) {
  return setState((s) => {
    const list = [...s[collection]]
    const i = list.findIndex((x) => x.id === id)
    const j = i + delta
    if (i < 0 || j < 0 || j >= list.length) return s
    ;[list[i], list[j]] = [list[j], list[i]]
    return { ...s, [collection]: list }
  })
}

export function logCartEvent(product) {
  setState((s) => ({
    ...s,
    cartEvents: [...s.cartEvents, { productId: product.id, name: product.name, at: new Date().toISOString() }].slice(-2000),
  }))
}

export function addSubscriber(email) {
  setState((s) =>
    s.subscribers.some((x) => x.email.toLowerCase() === email.toLowerCase())
      ? s
      : { ...s, subscribers: [{ email, at: new Date().toISOString() }, ...s.subscribers] },
  )
}

export { uid }
