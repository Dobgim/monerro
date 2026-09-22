import { useSyncExternalStore } from 'react'
import featuredProducts from '../data/featuredProducts'
import heroSlides from '../data/heroSlides'
import brands from '../data/brands'
import { defaultPayments } from '../lib/payments'
import { errorText, supabase } from '../lib/supabase'

// Single source of truth for everything the admin dashboard can edit.
// The live copy is in Supabase (see supabase/schema.sql). Pages render straight away from
// a copy cached in this browser, then refresh from the database and stay up to date through
// Supabase Realtime. Admin edits change the local state immediately and are then written
// to the database in the background (see pushChanges).

const KEY = 'cannabuddy-site-v2'
const LEGACY_KEY = 'cannabuddy-site-v1' // browser-only saves from before the site went live
const NL = String.fromCharCode(10) // line break inside multi-line addresses
const COLLECTIONS = ['products', 'slides', 'brands']
const SETTINGS = ['announcement', 'contact', 'payments', 'locations']
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

/** The content the site was delivered with (also used to fill a brand-new database). */
export function buildDefaults() {
  return {
    announcement: {
      enabled: true,
      text: '💙 Buy one Blue Dream 1/8th, get one free September 17–20 with code “bluebogo” at Cart. 💙',
      href: 'https://cannabuddyhub.com/product/high-thca-flower-blue-dream/',
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
      // orders are sent here from the cart's "Proceed to checkout" button
      whatsapp: '15103942813',
      email: 'support@cannabuddyhub.com',
    },
    payments: defaultPayments(),
    // shown on the Locations page and in the footer; editable in Admin → Settings
    locations: [
      {
        id: 'charlotte',
        name: 'Charlotte',
        address: '5371 E Independence Blvd' + NL + 'Suite A' + NL + 'Charlotte, NC 28212',
        hours: '11:00 AM to 8:00 PM daily',
      },
      {
        id: 'matthews',
        name: 'Matthews',
        address: '215 N Ames Street' + NL + 'Suite 1000' + NL + 'Matthews, NC 28105',
        hours: 'Sun: 2pm – 8pm, Mon–Wed: 4pm – 8pm, Thu: 4pm – 9pm, Fri: 2pm – 10pm, Sat: 12pm – 10pm',
      },
    ],
    // admin-only data, loaded from the database after the admin logs in
    subscribers: [],
    cartEvents: [],
    orders: [],
    media: [],
    updatedAt: null,
  }
}

// objects saved in settings are merged over the defaults, so new fields still get a value
const mergeSetting = (key, defaults, saved) =>
  saved == null ? defaults[key] : Array.isArray(defaults[key]) ? saved : { ...defaults[key], ...saved }

function load() {
  const defaults = buildDefaults()
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (!saved) return defaults
    const next = { ...defaults, updatedAt: saved.updatedAt || null }
    COLLECTIONS.forEach((c) => Array.isArray(saved[c]) && (next[c] = saved[c]))
    SETTINGS.forEach((k) => (next[k] = mergeSetting(k, defaults, saved[k])))
    return next
  } catch {
    return defaults
  }
}

let state = load()

function emit() {
  listeners.forEach((l) => l())
}

function cache(s) {
  try {
    const content = { updatedAt: s.updatedAt }
    ;[...COLLECTIONS, ...SETTINGS].forEach((k) => (content[k] = s[k]))
    localStorage.setItem(KEY, JSON.stringify(content))
  } catch {
    // storage full or blocked — the live database still has everything
  }
}

// replace the state without writing anything to the database
function replaceState(next) {
  state = next
  cache(state)
  emit()
}

// ---- saving to the database ----------------------------------------------------

const syncListeners = new Set()
let sync = { pending: 0, error: null }
function setSync(patch) {
  sync = { ...sync, ...patch }
  syncListeners.forEach((l) => l())
}
/** { pending, error } — shown in the admin as "Saving…" / "All changes saved". */
export function useSyncStatus() {
  return useSyncExternalStore(
    (l) => {
      syncListeners.add(l)
      return () => syncListeners.delete(l)
    },
    () => sync,
  )
}

const failed = (results) => results.find((r) => r?.error)?.error

// Writes the difference between two states. Resolves to an error message, or null.
async function pushChanges(prev, next) {
  const now = new Date().toISOString()
  const ops = []
  for (const c of COLLECTIONS) {
    if (prev[c] === next[c]) continue
    const before = new Map(prev[c].map((x, i) => [String(x.id), { x, i }]))
    const rows = []
    next[c].forEach((x, i) => {
      const old = before.get(String(x.id))
      if (!old || old.x !== x || old.i !== i) rows.push({ id: String(x.id), position: i, data: x, updated_at: now })
    })
    const keep = new Set(next[c].map((x) => String(x.id)))
    const gone = prev[c].filter((x) => !keep.has(String(x.id))).map((x) => String(x.id))
    if (rows.length) ops.push(supabase.from(c).upsert(rows))
    if (gone.length) ops.push(supabase.from(c).delete().in('id', gone))
  }
  const settings = SETTINGS.filter((k) => prev[k] !== next[k]).map((k) => ({ key: k, value: next[k], updated_at: now }))
  if (settings.length) ops.push(supabase.from('settings').upsert(settings))

  const keepEmails = new Set(next.subscribers.map((s) => s.email))
  const goneEmails = prev.subscribers.filter((s) => !keepEmails.has(s.email)).map((s) => s.email)
  if (goneEmails.length) ops.push(supabase.from('subscribers').delete().in('email', goneEmails))

  const error = failed(await Promise.all(ops))
  return error ? errorText(error) : null
}

let chain = Promise.resolve(null)
let lastWrite = Promise.resolve(null)

function queueSync(prev, next) {
  setSync({ pending: sync.pending + 1 })
  lastWrite = chain = chain.then(() => pushChanges(prev, next)).catch((e) => errorText(e))
  lastWrite.then((error) => {
    setSync({ pending: sync.pending - 1, error })
    // show what the database really holds if a write didn't go through
    if (error) refreshContent()
  })
}

/** Resolves once the most recent change is saved: null, or an error message. */
export const whenSaved = () => lastWrite

// Updates the state now and saves the change to the database in the background.
// Always returns true; use whenSaved() (the admin's useSave does) to hear how it went.
export function setState(updater) {
  const prev = state
  const next = { ...(typeof updater === 'function' ? updater(state) : { ...state, ...updater }), updatedAt: new Date().toISOString() }
  replaceState(next)
  queueSync(prev, next)
  return true
}

export function getState() {
  return state
}

/** Put every product, slide, brand and setting back to how the site was delivered. */
export async function resetState() {
  const fresh = buildDefaults()
  setState((s) => ({ ...fresh, subscribers: [], cartEvents: [], orders: s.orders, media: s.media }))
  const { error } = await supabase.from('cart_events').delete().gte('id', 0)
  return (await whenSaved()) || (error ? errorText(error) : null)
}

// Copies any embedded (data:) photos to the media bucket so the database stays small.
async function uploadEmbeddedPhotos(data) {
  const { uploadDataUrl } = await import('../lib/media')
  const done = new Map()
  const up = async (src) => {
    if (typeof src !== 'string' || !src.startsWith('data:')) return src
    if (!done.has(src)) done.set(src, await uploadDataUrl(src))
    return done.get(src)
  }
  const fix = async (item) => ({
    ...item,
    ...(item.image && { image: await up(item.image) }),
    ...(item.activeImage && { activeImage: await up(item.activeImage) }),
    ...(Array.isArray(item.gallery) && { gallery: await Promise.all(item.gallery.map(up)) }),
  })
  const out = { ...data }
  for (const c of COLLECTIONS) if (Array.isArray(out[c])) out[c] = await Promise.all(out[c].map(fix))
  return out
}

/** Restore a backup (or browser-only saves) to the live site. Resolves to true once uploaded. */
export async function importState(data) {
  const clean = await uploadEmbeddedPhotos(data)
  const defaults = buildDefaults()
  return setState((s) => {
    const next = { ...s }
    COLLECTIONS.forEach((c) => Array.isArray(clean[c]) && (next[c] = clean[c]))
    SETTINGS.forEach((k) => clean[k] != null && (next[k] = mergeSetting(k, defaults, clean[k])))
    return next
  })
}

/** Changes the admin made before the site was connected to the database, if any. */
export function legacyLocalChanges() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEGACY_KEY))
    return saved?.updatedAt && Array.isArray(saved.products) ? saved : null
  } catch {
    return null
  }
}
export function discardLegacyLocalChanges() {
  try {
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    // ignore
  }
}

// ---- loading from the database -------------------------------------------------

const loadListeners = new Set()
let loadStatus = { loaded: false, error: null }
function setLoad(patch) {
  loadStatus = { ...loadStatus, ...patch }
  loadListeners.forEach((l) => l())
}
/** { loaded, error } for the first fetch from the database. */
export function useLoadStatus() {
  return useSyncExternalStore(
    (l) => {
      loadListeners.add(l)
      return () => loadListeners.delete(l)
    },
    () => loadStatus,
  )
}

async function fetchContent() {
  const results = await Promise.all([
    ...COLLECTIONS.map((c) => supabase.from(c).select('data, updated_at').order('position')),
    supabase.from('settings').select('key, value, updated_at'),
  ])
  const error = failed(results)
  if (error) {
    setLoad({ error: errorText(error) })
    return
  }
  const settingsRows = results[COLLECTIONS.length].data
  // a database that has never been filled keeps showing the delivered content
  if (!settingsRows.length && COLLECTIONS.every((_, i) => !results[i].data.length)) {
    setLoad({ loaded: true, error: null })
    return
  }
  const defaults = buildDefaults()
  const next = { ...state }
  let latest = ''
  COLLECTIONS.forEach((c, i) => {
    next[c] = results[i].data.map((r) => r.data)
    results[i].data.forEach((r) => r.updated_at > latest && (latest = r.updated_at))
  })
  const byKey = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]))
  settingsRows.forEach((r) => r.updated_at > latest && (latest = r.updated_at))
  SETTINGS.forEach((k) => (next[k] = mergeSetting(k, defaults, byKey[k])))
  next.updatedAt = latest || null
  replaceState(next)
  setLoad({ loaded: true, error: null })
}

// Wait for our own pending writes first, so an older copy never overwrites a newer edit.
function refreshContent() {
  return chain.then(fetchContent)
}

let refreshTimer
function scheduleRefresh(fn) {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => chain.then(fn), 400)
}

// ---- admin-only data (sign-ups, cart activity, orders, uploaded photos) -----------

export async function fetchAdminData() {
  const [subs, events, orders] = await Promise.all([
    supabase.from('subscribers').select('email, created_at').order('created_at', { ascending: false }),
    supabase.from('cart_events').select('product_id, name, created_at').order('created_at', { ascending: false }).limit(2000),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(500),
  ])
  if (subs.error || events.error || orders.error) return
  replaceState({
    ...state,
    subscribers: subs.data.map((r) => ({ email: r.email, at: r.created_at })),
    cartEvents: events.data.reverse().map((r) => ({ productId: r.product_id, name: r.name, at: r.created_at })),
    orders: orders.data,
  })
}

export async function refreshMedia() {
  const { listUploads } = await import('../lib/media')
  replaceState({ ...state, media: await listUploads() })
}

let adminChannel = null
/** Called when the admin signs in: loads their data and keeps it live. */
export function startAdminData() {
  if (adminChannel) return
  fetchAdminData()
  refreshMedia()
  adminChannel = supabase.channel('admin-data')
  ;['subscribers', 'cart_events', 'orders'].forEach((table) =>
    adminChannel.on('postgres_changes', { event: '*', schema: 'public', table }, () => scheduleRefresh(fetchAdminData)),
  )
  adminChannel.subscribe()
}
export function stopAdminData() {
  if (adminChannel) supabase.removeChannel(adminChannel)
  adminChannel = null
  replaceState({ ...state, subscribers: [], cartEvents: [], orders: [], media: [] })
}

/** Adds a photo to the Media Library list straight after it is uploaded. */
export function addMedia(url) {
  replaceState({ ...state, media: [url, ...state.media.filter((m) => m !== url)] })
}

if (typeof window !== 'undefined') {
  refreshContent()
  const live = supabase.channel('site-content')
  ;[...COLLECTIONS, 'settings'].forEach((table) => live.on('postgres_changes', { event: '*', schema: 'public', table }, () => scheduleRefresh(fetchContent)))
  live.subscribe()
  // phones pause background tabs and can miss live updates — catch up when the page is back
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return
    scheduleRefresh(fetchContent)
    if (adminChannel) scheduleRefresh(fetchAdminData)
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

// ---- things shoppers send (they can add rows, only the admin can read them) ----

export function logCartEvent(product) {
  supabase
    .from('cart_events')
    .insert({ product_id: String(product.id).slice(0, 64), name: String(product.name || '').slice(0, 300) })
    .then(() => {})
}

/** Resolves to true when the email is saved (or was already on the list). */
export async function addSubscriber(email) {
  const { error } = await supabase.from('subscribers').upsert({ email: email.trim().toLowerCase() }, { onConflict: 'email', ignoreDuplicates: true })
  return !error
}

/** Saves a checkout order for the admin's Orders screen. Never blocks the WhatsApp message. */
export function submitOrder({ customer, items, total, payment }) {
  return supabase
    .from('orders')
    .insert({ customer, items, total, payment: String(payment || '').slice(0, 60) })
    .then(({ error }) => !error)
}

export { uid }
