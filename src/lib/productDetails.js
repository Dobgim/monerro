import { CANNABINOID, EFFECT, TYPE, brandName, brandSlug, categoriesOf, productMatchesBrand } from './catalog'

// Extra product-page content. Anything the client types in Admin → Products wins;
// otherwise we write a plain, factual line from the product's categories.

const list = (words) => (words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`)

/** Links shown in the "Category / Features / Brand" block under the buttons. */
export function productMeta(product, brands = []) {
  const cats = categoriesOf(product)
  const categories = [
    ...cats.cannabinoids.filter((s) => CANNABINOID[s]).map((s) => ({ label: CANNABINOID[s].label, href: `/product-category/${s}/` })),
    ...cats.types.filter((s) => TYPE[s]).map((s) => ({ label: TYPE[s].label, href: `/shop-by-type/${s}/` })),
  ]
  const features = cats.effects.filter((s) => EFFECT[s]).map((s) => ({ label: EFFECT[s].label, href: `/shop-by-effect/${s}/` }))
  const brand = brands.find((b) => b.visible !== false && productMatchesBrand(product, b))
  return {
    categories,
    features,
    brand: brand ? { label: brandName(brand), href: `/product-brands/${brandSlug(brand)}/` } : product.brand ? { label: product.brand, href: null } : null,
  }
}

function kindOf(product) {
  const cats = categoriesOf(product)
  const cannabinoid = cats.cannabinoids.map((s) => CANNABINOID[s]?.label).filter(Boolean)
  const type = cats.types.filter((s) => s !== 'gummies' || !cats.types.includes('edibles')).map((s) => TYPE[s]?.label.toLowerCase()).filter(Boolean)
  return { cannabinoid, type, effects: cats.effects.map((s) => EFFECT[s]?.label.toLowerCase()).filter(Boolean) }
}

/** The one-or-two line summary next to the photo. */
export function shortDescription(product) {
  if (product.shortDescription?.trim()) return product.shortDescription.trim()
  if (product.description?.trim()) return product.description.trim().split(/\n{2,}/)[0]
  const { cannabinoid, type } = kindOf(product)
  const what = [list(cannabinoid), type[0] ? type[0].replace(/s$/, '') : 'product'].filter(Boolean).join(' ')
  return `${product.name} — a ${what} from the CannaBuddyHub range, lab tested and shipped discreetly.`
}

/** Paragraphs for the Description tab. */
export function longDescription(product) {
  if (product.description?.trim()) return product.description.trim().split(/\n{2,}/)
  const { cannabinoid, type, effects } = kindOf(product)
  const paras = [
    `${product.name} is part of our ${[list(cannabinoid), list(type)].filter(Boolean).join(' ') || 'hemp'} collection. Every product we carry is hemp-derived and third-party lab tested, so you know exactly what you are getting.`,
  ]
  if (effects.length) paras.push(`Customers often choose it for ${list(effects)}. Everyone responds differently — start low and go slow until you know how it works for you.`)
  paras.push('Not sure if it’s the right fit? Message us on WhatsApp or give us a call and our team will help you choose.')
  return paras
}

/** "THCa: 88%" style lines → [{ label, value }]. */
export function profileRows(product) {
  return String(product.profile || '')
    .split(/\n+/)
    .map((line) => line.split(/:\s*/))
    .filter(([label, value]) => label?.trim() && value?.trim())
    .map(([label, ...rest]) => ({ label: label.trim(), value: rest.join(': ').trim() }))
}

/** Products from the same category first, then anything else visible. */
export function alsoBought(product, products, count = 4) {
  const cats = categoriesOf(product)
  const mine = new Set([...cats.types, ...cats.cannabinoids])
  const score = (p) => {
    const c = categoriesOf(p)
    return [...c.types, ...c.cannabinoids].filter((s) => mine.has(s)).length
  }
  return products
    .filter((p) => p.visible && p.id !== product.id && p.stock !== 'outofstock')
    .map((p, i) => ({ p, s: score(p), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, count)
    .map((x) => x.p)
}
