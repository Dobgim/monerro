// Helpers for turning the site's links into in-app routes.

const SITE_HOSTS = new Set(['cannabuddyhub.com', 'www.cannabuddyhub.com'])

/** Returns the in-app path for a link on this site, or null for external/tel/mailto links. */
export function internalPath(href) {
  if (!href || href.startsWith('#') || /^(tel|mailto|sms|javascript):/i.test(href)) return null
  if (href.startsWith('/') && !href.startsWith('//')) return href
  try {
    const url = new URL(href, window.location.origin)
    if (url.origin === window.location.origin || SITE_HOSTS.has(url.hostname)) return url.pathname + url.search + url.hash
  } catch {
    // not a URL
  }
  return null
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

/** Stable URL slug for a product: the WordPress slug when it has one, otherwise name + id. */
export function productSlug(product) {
  const match = /\/product\/([^/?#]+)/.exec(product.href || '')
  return match ? match[1] : `${slugify(product.name)}-${product.id}`
}

export function productPath(product) {
  return `/product/${productSlug(product)}/`
}

/** Number used to total up a cart line, whatever kind of price the product has. */
export function unitPrice(price) {
  if (!price) return 0
  if (price.type === 'sale') return Number(price.sale) || 0
  if (price.type === 'range') return Number(price.min) || 0
  return Number(price.amount) || 0
}
