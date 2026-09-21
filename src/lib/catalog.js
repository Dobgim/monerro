// Product categories: cannabinoids, product types and effects.
// Each product can store its own lists (set in Admin → Products → Categories); if it
// hasn't been categorised yet, they are worked out from its name and original shop tags.

export const CANNABINOIDS = [
  { slug: 'cbc', label: 'CBC', test: /\bcbc\b/ },
  { slug: 'cbd', label: 'CBD', test: /(^|[^4])\bcbd\b/ },
  { slug: 'cbg', label: 'CBG', test: /\bcbg\b/ },
  { slug: 'cbn', label: 'CBN', test: /\bcbn\b/ },
  { slug: 'delta-8-thc', label: 'Delta 8', test: /delta[\s-]?8\b/ },
  // plain "THC" counts as Delta 9, unless the product is Delta 8/10/11 or THC-free
  { slug: 'delta-9-thc', label: 'Delta 9', test: (t) => /delta[\s-]?9\b|\bd9\b/.test(t) || (/\bthc\b/.test(t) && !/delta[\s-]?(8|10|11)\b|\bthc[\s-]free\b/.test(t)) },
  { slug: 'delta-10-thc', label: 'Delta 10', test: /delta[\s-]?10\b/ },
  { slug: 'delta-11-thc', label: 'Delta 11', test: /delta[\s-]?11\b/ },
  { slug: 'h4cbd', label: 'H4CBD', test: /\bh4cbd\b/ },
  { slug: 'hhc', label: 'HHC', test: /\bhhc\b/ },
  { slug: 'thca', label: 'THCa', test: /\bthca\b/ },
  { slug: 'thcb', label: 'THCB', test: /\bthcb\b/ },
  { slug: 'thch', label: 'THCH', test: /\bthch\b/ },
  { slug: 'thcp', label: 'THCP', test: /\bthcp\b/ },
  { slug: 'thcv', label: 'THCv', test: /\bthcv\b/ },
]

export const TYPES = [
  { slug: 'concentrates', label: 'Concentrates', test: /crumble|diamond|sugar wax|\bwax\b|\bdabs?\b|badder|shatter|snow ?cap|concentrate/ },
  { slug: 'drinks', label: 'Drinks', test: /seltzer|\bdrinks?\b|beverage|\bsoda\b|\btea\b|coffee|4 pack/ },
  { slug: 'edibles', label: 'Edibles', test: /gumm|\bchews?\b|chocolate|\bmints?\b|cookie|brownie|skybite|cand(y|ies)|edible|honey/ },
  { slug: 'flower', label: 'Flower', test: /\bflowers?\b|\bbud\b/ },
  { slug: 'gummies', label: 'Gummies', test: /gumm/ },
  { slug: 'live-resin', label: 'Live Resin', test: /live resin|live rosin/ },
  { slug: 'pre-roll', label: 'Pre-Rolls', test: /pre-?rolls?|\bblunts?\b/ },
  { slug: 'supplements', label: 'Supplements', test: /capsule|softgel|tablet|supplement|tincture|sublingual/ },
  { slug: 'topicals', label: 'Topicals', test: /topical|\bgel\b|cream|balm|lotion|salve|roll-on/ },
  { slug: 'vapes', label: 'Vapes', test: /\bvapes?\b|cartridge|\bcarts?\b|disposable|battery|box mod|\bpen\b/ },
]

export const EFFECTS = [
  { slug: 'sleep', label: 'Sleep', test: /sleep|\bcbn\b|indica|cozy|midnight|\bnight\b|asleep/ },
  { slug: 'energy-focus', label: 'Energy & Focus', test: /focus|energy|excite|sativa|\bthcv\b|uplift|lifter|refresh|creativ|illuminate/ },
  { slug: 'relief', label: 'Relief', test: /relief|\bpain\b|joint|muscle|recovery|\bcalm\b|balance|soothe/ },
]

const matches = (rule, text) => (typeof rule.test === 'function' ? rule.test(text) : rule.test.test(text))

const bySlug = (list) => Object.fromEntries(list.map((x) => [x.slug, x]))
export const CANNABINOID = bySlug(CANNABINOIDS)
export { matches }
export const TYPE = bySlug(TYPES)
export const EFFECT = bySlug(EFFECTS)

/** Lower-case text used for matching: the product name plus its original shop tags. */
export function productText(p) {
  const tags = (p.className || '')
    .split(' ')
    .filter((c) => c.startsWith('product_cat-') || c.startsWith('product_tag-') || c.startsWith('product-type-'))
    .map((c) => c.replace(/^product_(cat|tag)-|^product-type-/, '').replace(/-/g, ' '))
  return `${p.name} ${tags.join(' ')}`.toLowerCase()
}

/** Categories worked out automatically (used when the product hasn't been categorised in the admin). */
export function deriveCategories(p) {
  const text = productText(p)
  return {
    cannabinoids: CANNABINOIDS.filter((c) => matches(c, text)).map((c) => c.slug),
    types: TYPES.filter((t) => matches(t, text)).map((t) => t.slug),
    effects: EFFECTS.filter((e) => matches(e, text)).map((e) => e.slug),
  }
}

/** The product's categories: what the admin saved, or the automatic guess. */
export function categoriesOf(p) {
  const auto = Array.isArray(p.cannabinoids) && Array.isArray(p.types) && Array.isArray(p.effects) ? null : deriveCategories(p)
  return {
    cannabinoids: Array.isArray(p.cannabinoids) ? p.cannabinoids : auto.cannabinoids,
    types: Array.isArray(p.types) ? p.types : auto.types,
    effects: Array.isArray(p.effects) ? p.effects : auto.effects,
  }
}

// ---- brands -----------------------------------------------------------------

// A few logos in the original data had awkward alt text; show these names instead
const BRAND_NAMES = { urb: 'Urb', 'wnc-cbd': 'WNC CBD', 'viia-hemp': 'VIIA Hemp', pharmacbd: 'Pharma', haygood: 'Haygood Market' }

export const cleanBrandName = (name) => name.replace(/ (brand|Brand Page)? ?(logo|Logo)$/i, '').trim()

/** Display name for a brand. */
export function brandName(brand) {
  const m = /\/product-brands\/([^/?#]+)/.exec(brand.href || '')
  return (m && BRAND_NAMES[m[1]]) || cleanBrandName(brand.name)
}

export function brandSlug(brand) {
  const m = /\/product-brands\/([^/?#]+)/.exec(brand.href || '')
  return m ? m[1] : cleanBrandName(brand.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function productMatchesBrand(p, brand) {
  if (p.brand) return p.brand.toLowerCase() === brandName(brand).toLowerCase()
  const text = p.name.toLowerCase()
  const name = brandName(brand).toLowerCase()
  const first = brandSlug(brand).split('-')[0]
  return text.includes(name) || (first.length >= 3 && new RegExp(`\\b${first}`).test(text))
}
