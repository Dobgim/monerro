import { CANNABINOID, CANNABINOIDS, EFFECT, EFFECTS, TYPE, TYPES, brandSlug, categoriesOf, brandName, productMatchesBrand, productText } from './catalog'
import { CANNABINOID_COPY, EFFECT_COPY, TYPE_COPY } from '../content/categoryCopy'

// Banner images already used for these sections in the mega menus
const IMAGES = {
  thca: '/assets/images/2026/02/Thcapick.webp',
  'delta-9-thc': '/assets/images/2026/02/2-EnergyMainImage.webp',
  cbd: '/assets/images/2026/02/3-ReliefMainImage.webp',
  sleep: '/assets/images/2026/02/1-SleepMainImage.webp',
  'energy-focus': '/assets/images/2026/02/2-EnergyMainImage.webp',
  relief: '/assets/images/2026/02/3-ReliefMainImage.webp',
  concentrates: '/assets/images/2026/02/1-Concentrates.webp',
  drinks: '/assets/images/2026/02/2-Drinks.webp',
  edibles: '/assets/images/2026/02/3-Edibles.webp',
  flower: '/assets/images/2026/02/4-Flower.webp',
  gummies: '/assets/images/2026/02/5-Gummies.webp',
  'live-resin': '/assets/images/2026/02/6-LiveResin.webp',
  'pre-roll': '/assets/images/2026/02/7-PreRolls.webp',
  supplements: '/assets/images/2026/02/8-Supplements.webp',
  topicals: '/assets/images/2026/02/9-Topicals.webp',
  vapes: '/assets/images/2026/02/10-Vapes.webp',
  shop: '/assets/images/2026/02/1-MainImage.webp',
}

const hasType = (slug) => (p) => categoriesOf(p).types.includes(slug)
const textHas = (re) => (p) => re.test(productText(p))
const anyOf = (...fns) => (p) => fns.some((f) => f(p))

// Sub-categories shown as chips on the THCa, Delta 9 and CBD pages (same links as the mega menus)
const SUBCATEGORIES = {
  thca: [
    { slug: 'thca-vapes', label: 'THCa Carts', filter: hasType('vapes') },
    { slug: 'thca-concentrates', label: 'THCa Dabs', filter: hasType('concentrates') },
    { slug: 'thca-diamonds', label: 'THCa Diamonds', filter: textHas(/diamond/) },
    { slug: 'thca-flowers-pre-rolls', label: 'THCa Flower', filter: anyOf(hasType('flower'), hasType('pre-roll')) },
    { slug: 'thca-snow-caps', label: 'THCa Snow Caps', filter: textHas(/snow ?cap/) },
  ],
  'delta-9-thc': [
    { slug: 'delta-9-thc-candies', label: 'Delta 9 Candies', filter: textHas(/cand(y|ies)|\bchews?\b|\bmints?\b|caramel|chocolate/) },
    { slug: 'delta-9-thc-beverages-drink-enhancers', label: 'Delta 9 Drinks', filter: hasType('drinks') },
    { slug: 'delta-9-thc-cookies-brownies-cereal-treats', label: 'Delta 9 Edibles', filter: hasType('edibles') },
    { slug: 'delta-9-thc-gummies', label: 'Delta 9 Gummies', filter: hasType('gummies') },
    { slug: 'delta-9-thc-tinctures-oils-sublinguals', label: 'Delta 9 Tincture', filter: textHas(/tincture|sublingual|\boils?\b/) },
  ],
  cbd: [
    { slug: 'cbd-candies', label: 'CBD Candies', filter: textHas(/cand(y|ies)|\bchews?\b|\bmints?\b|caramel|chocolate/) },
    { slug: 'cbd-capsules', label: 'CBD Capsules & Tablets', filter: textHas(/capsule|softgel|tablet/) },
    { slug: 'cbd-vape-cartridges', label: 'CBD Carts', filter: hasType('vapes') },
    { slug: 'cbd-edibles', label: 'CBD Edibles', filter: hasType('edibles') },
    { slug: 'cbd-hemp-flowers-pre-rolls', label: 'CBD Flower', filter: anyOf(hasType('flower'), hasType('pre-roll')) },
    { slug: 'cbd-gummies', label: 'CBD Gummies', filter: hasType('gummies') },
    { slug: 'cbd-honey', label: 'CBD Honey', filter: textHas(/honey/) },
    { slug: 'cbd-teas-coffee', label: 'CBD Tea', filter: textHas(/\btea\b|coffee/) },
    { slug: 'cbd-tinctures-oils-sublinguals', label: 'CBD Tincture', filter: textHas(/tincture|sublingual|\boils?\b/) },
    { slug: 'cbd-topicals', label: 'CBD Topicals', filter: hasType('topicals') },
  ],
}

const cannabinoidChips = (active) => CANNABINOIDS.map((c) => ({ label: c.label, href: `/product-category/${c.slug}/`, active: c.slug === active }))
const typeChips = (active) => TYPES.map((t) => ({ label: t.label, href: `/shop-by-type/${t.slug}/`, active: t.slug === active }))
const effectChips = (active) => EFFECTS.map((e) => ({ label: e.label, href: `/shop-by-effect/${e.slug}/`, active: e.slug === active }))

function cannabinoidCollection(slug, sub) {
  const c = CANNABINOID[slug]
  const copy = CANNABINOID_COPY[slug]
  const has = (p) => categoriesOf(p).cannabinoids.includes(slug)
  const subs = SUBCATEGORIES[slug] || []
  const subDef = sub && subs.find((s) => s.slug === sub)
  if (sub && !subDef) return null
  const chips = subs.length
    ? [{ label: `All ${copy.title}`, href: `/product-category/${slug}/`, active: !subDef }, ...subs.map((s) => ({ label: s.label, href: `/product-category/${slug}/${s.slug}/`, active: s === subDef }))]
    : cannabinoidChips(slug)
  return {
    key: `cannabinoid:${slug}:${sub || ''}`,
    eyebrow: subDef ? copy.title : 'Shop by Cannabinoid',
    title: subDef ? subDef.label : `${copy.title} Products`,
    intro: copy.intro,
    about: copy.about,
    aboutTitle: `About ${c.label}`,
    image: IMAGES[slug],
    chips,
    filter: subDef ? (p) => has(p) && subDef.filter(p) : has,
    tags: [slug],
    breadcrumb: subDef ? [{ label: `${copy.title} Products`, href: `/product-category/${slug}/` }] : [],
  }
}

const SPECIAL = {
  'on-sale': { title: 'Sales & Deals', eyebrow: 'Shop', intro: 'Limited-time prices on products our customers love. When they’re gone, they’re gone.', filter: (p) => p.onSale || p.price?.type === 'sale' },
  bundles: { title: 'Product Bundles', eyebrow: 'Shop', intro: 'Curated collections that pair our favourite products together — at a better price than buying separately.', filter: (p) => /collection|bundle/i.test(p.name) || (p.className || '').includes('product-type-bundle') },
  'cbd-for-dogs': { title: 'CBD for Dogs', eyebrow: 'CBD', intro: 'CBD chews and treats made especially for pets. Always check with your vet before starting anything new.', filter: textHas(/\bdogs?\b|\bpets?\b|\bcats?\b|holistapet/) },
}

/** Works out which collection a URL shows, or null if it isn't a collection page. */
export function resolveCollection(pathname, brands = []) {
  const parts = pathname.split('/').filter(Boolean)
  const [root, a, b] = parts

  if (root === 'product-category' && a) {
    if (SPECIAL[a]) return { key: `special:${a}`, chips: cannabinoidChips(null), image: IMAGES.shop, tags: [], breadcrumb: [], ...SPECIAL[a] }
    if (CANNABINOID[a]) return cannabinoidCollection(a, b)
    return null
  }
  if (root === 'shop-by-type' && TYPE[a]) {
    const copy = TYPE_COPY[a]
    return { key: `type:${a}`, eyebrow: 'Shop by Type', title: copy.title, intro: copy.intro, image: IMAGES[a], chips: typeChips(a), filter: hasType(a), tags: [a], breadcrumb: [] }
  }
  if (root === 'shop-by-effect' && EFFECT[a]) {
    const copy = EFFECT_COPY[a]
    return { key: `effect:${a}`, eyebrow: 'Shop by Effect', title: copy.title, intro: copy.intro, image: IMAGES[a], chips: effectChips(a), filter: (p) => categoriesOf(p).effects.includes(a), tags: [a], effectNote: true, breadcrumb: [] }
  }
  if (root === 'product-tag' && a === 'thc-free') {
    return {
      key: 'tag:thc-free',
      eyebrow: 'CBD',
      title: 'THC-Free CBD',
      intro: 'CBD products made without THC — a good fit if you need to avoid THC completely.',
      image: IMAGES.cbd,
      chips: cannabinoidChips('cbd'),
      filter: textHas(/thc[\s-]free|broad[\s-]spectrum|isolate/),
      tags: ['cbd'],
      breadcrumb: [{ label: 'CBD Products', href: '/product-category/cbd/' }],
    }
  }
  if (root === 'whats-new-at-cannabuddy' || root === 'whats-new') {
    return { key: 'new', eyebrow: 'Shop', title: 'What’s New', intro: 'The latest arrivals at CannaBuddyHub, newest first.', image: IMAGES.shop, chips: typeChips(null), filter: () => true, sortDefault: 'newest', tags: [], breadcrumb: [] }
  }
  if (root === 'product-brands' && a) {
    const brand = brands.find((br) => brandSlug(br) === a)
    if (!brand) return null
    const name = brandName(brand)
    return {
      key: `brand:${a}`,
      eyebrow: 'Shop by Brand',
      title: name,
      intro: `Shop ${name} products at CannaBuddyHub.`,
      logo: brand.image,
      chips: [],
      filter: (p) => productMatchesBrand(p, brand),
      tags: [],
      breadcrumb: [{ label: 'All Brands', href: '/cannabis-brands/' }],
    }
  }
  return null
}
