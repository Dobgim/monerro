import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BUTTON_KINDS, remove, resolveButton, upsert, useSiteState } from '../../store/siteStore'
import ImageField from '../components/ImageField'
import GalleryField from '../components/GalleryField'
import { extraPhotos } from '../../lib/gallery'
import { CANNABINOIDS, EFFECTS, TYPES, deriveCategories } from '../../lib/catalog'
import { Button, ConfirmDialog, FormRow, FormTable, Postbox, useSave } from '../components/ui'

const EMPTY = {
  name: '',
  href: 'https://cannabuddyhub.com/shop/',
  image: '',
  imageAlt: '',
  rating: null,
  onSale: false,
  stock: 'instock',
  visible: true,
  buttonKind: 'add',
  description: '',
  shortDescription: '',
  profile: '',
  suggestedUse: '',
  ingredients: '',
  coaUrl: '',
  reviews: [],
  gallery: [],
  cannabinoids: [],
  types: [],
  effects: [],
  price: { type: 'single', prefix: null, amount: '', min: '', max: '', regular: '', sale: '', subscribeDiscount: '15%' },
}

const money = /^\d+(\.\d{1,2})?$/
const fixed = (v) => (v === '' || v == null ? v : Number(v).toFixed(2))

function validate(p) {
  const e = {}
  if (!p.name.trim()) e.name = 'Please enter a product name.'
  if (!p.image) e.image = 'Please add a product photo.'
  const pr = p.price
  const bad = (v) => !money.test(String(v ?? '').trim())
  if (pr.type === 'single' && bad(pr.amount)) e.amount = 'Enter a price like 24.95'
  if (pr.type === 'range') {
    if (bad(pr.min)) e.min = 'Enter a price like 14.00'
    if (bad(pr.max)) e.max = 'Enter a price like 220.00'
    if (!e.min && !e.max && Number(pr.min) > Number(pr.max)) e.max = 'The highest price must be more than the lowest.'
  }
  if (pr.type === 'sale') {
    if (bad(pr.regular)) e.regular = 'Enter a price like 34.95'
    if (bad(pr.sale)) e.sale = 'Enter a price like 24.95'
    if (!e.regular && !e.sale && Number(pr.sale) >= Number(pr.regular)) e.sale = 'The sale price should be lower than the normal price.'
  }
  if (p.rating !== null && p.rating !== '' && !(Number(p.rating) >= 0 && Number(p.rating) <= 5)) e.rating = 'Enter a number between 0 and 5.'
  return e
}

// How the card will look on the home page (the real card needs the site's theme CSS)
function Preview({ product }) {
  const button = resolveButton(product)
  const pr = product.price
  return (
    <div className="cb-preview">
      <div className="cb-preview__img">
        {(product.onSale || pr.type === 'sale') && <span className="cb-preview__sale">Sale!</span>}
        {product.image ? <img src={product.image} alt="" /> : <span className="cb-thumb-ph" />}
      </div>
      <p className="cb-preview__name">{product.name || 'Product name'}</p>
      {product.rating !== null && product.rating !== '' && <p className="cb-preview__stars">★★★★★</p>}
      <p className="cb-preview__price">
        {pr.type === 'sale' ? (
          <>
            <del>${fixed(pr.regular) || '0.00'}</del> <ins>${fixed(pr.sale) || '0.00'}</ins>
          </>
        ) : pr.type === 'range' ? (
          `$${fixed(pr.min) || '0.00'} – $${fixed(pr.max) || '0.00'}`
        ) : (
          `${pr.prefix ? `${pr.prefix} ` : ''}$${fixed(pr.amount) || '0.00'}`
        )}
      </p>
      {pr.subscribeDiscount && (
        <p className="cb-preview__sub">
          Subscribe &amp; Save up to <strong>{pr.subscribeDiscount}</strong>
        </p>
      )}
      <span className={`cb-preview__btn${product.buttonKind === 'more' && product.stock === 'outofstock' ? ' is-dark' : ''}`}>{button.label}</span>
    </div>
  )
}

export default function ProductEditor() {
  const { id } = useParams()
  const existing = useSiteState((s) => s.products.find((p) => String(p.id) === id))
  const isNew = !id
  const navigate = useNavigate()
  const save = useSave()
  const [draft, setDraft] = useState(() =>
    existing
      ? { ...(Array.isArray(existing.types) ? {} : deriveCategories(existing)), ...existing, gallery: extraPhotos(existing), price: { ...EMPTY.price, ...existing.price } }
      : EMPTY,
  )
  const [errors, setErrors] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!isNew && !existing) {
    return (
      <>
        <h1>Product not found</h1>
        <p>
          <Link to="/admin/products">← Back to products</Link>
        </p>
      </>
    )
  }

  // clear the red messages as soon as the field is touched again
  const set = (patch) => {
    setErrors({})
    setDraft((d) => ({ ...d, ...patch }))
  }
  const setPrice = (patch) => {
    setErrors({})
    setDraft((d) => ({ ...d, price: { ...d.price, ...patch } }))
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = validate(draft)
    setErrors(errs)
    if (Object.keys(errs).length) return
    const pr = draft.price
    const price = {
      type: pr.type,
      prefix: pr.type === 'single' && pr.prefix ? pr.prefix : null,
      subscribeDiscount: pr.subscribeDiscount || null,
      ...(pr.type === 'single' && { amount: fixed(pr.amount) }),
      ...(pr.type === 'range' && { min: fixed(pr.min), max: fixed(pr.max) }),
      ...(pr.type === 'sale' && { regular: fixed(pr.regular), sale: fixed(pr.sale) }),
    }
    const product = {
      ...draft,
      name: draft.name.trim(),
      imageAlt: draft.imageAlt || draft.name.trim(),
      rating: draft.rating === '' || draft.rating == null ? null : Number(draft.rating),
      onSale: pr.type === 'sale' || draft.onSale,
      price,
      reviews: (draft.reviews || []).filter((r) => (r.text || '').trim() || (r.name || '').trim()),
      id: draft.id ?? Date.now(),
    }
    if (!product.cannabinoids.length && !product.types.length && !product.effects.length) Object.assign(product, deriveCategories(product))
    if (save(upsert('products', product), isNew ? 'Product published. It is now on the home page.' : 'Product updated.')) navigate('/admin/products')
  }

  const priceTypes = [
    { value: 'single', label: 'One price' },
    { value: 'range', label: 'A price range (for different sizes)' },
    { value: 'sale', label: 'On sale (normal price crossed out)' },
  ]

  return (
    <form id="post" onSubmit={submit} noValidate>
      <h1 className="wp-heading-inline">{isNew ? 'Add New Product' : 'Edit Product'}</h1>
      {!isNew && (
        <Link to="/admin/products/new" className="page-title-action">
          Add New
        </Link>
      )}
      <hr className="wp-header-end" />
      {Object.keys(errors).length > 0 && (
        <div className="notice notice-error">
          <p>Please check the highlighted fields below.</p>
        </div>
      )}

      <div id="poststuff">
        <div id="post-body" className="metabox-holder columns-2">
          <div id="post-body-content">
            <div id="titlediv">
              <input
                type="text"
                id="title"
                value={draft.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Add product name"
                autoComplete="off"
                spellCheck="true"
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <Postbox title="Description">
              <textarea
                className="large-text"
                rows={6}
                value={draft.description || ''}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="Tell shoppers about this product: strength, flavour, effects, how to use it…"
              />
              <p className="description">Shown on the product’s own page. Leave a blank line between paragraphs.</p>
            </Postbox>

            <Postbox title="Short description">
              <textarea
                className="large-text"
                rows={2}
                value={draft.shortDescription || ''}
                onChange={(e) => set({ shortDescription: e.target.value })}
                placeholder="One or two lines shown next to the photo, e.g. “Potent THCa crumble with a sweet, earthy Trainwreck taste.”"
              />
              <p className="description">Leave empty to use the first paragraph of the description.</p>
            </Postbox>

            <Postbox title="Price">
              <fieldset className="cb-radios">
                <legend className="screen-reader-text">Price type</legend>
                {priceTypes.map((t) => (
                  <label key={t.value}>
                    <input type="radio" name="price-type" value={t.value} checked={draft.price.type === t.value} onChange={() => setPrice({ type: t.value })} />
                    {t.label}
                  </label>
                ))}
              </fieldset>
              <FormTable>
                {draft.price.type === 'single' && (
                  <>
                    <FormRow label="Price">
                      <span className="cb-money">
                        $
                        <input type="text" inputMode="decimal" className="small-text" value={draft.price.amount ?? ''} onChange={(e) => setPrice({ amount: e.target.value })} placeholder="24.95" />
                      </span>
                      {errors.amount && <p className="field-error">{errors.amount}</p>}
                    </FormRow>
                    <FormRow label="Starting from">
                      <label className="checkbox-label">
                        <input type="checkbox" checked={Boolean(draft.price.prefix)} onChange={(e) => setPrice({ prefix: e.target.checked ? 'Starting From:' : null })} />
                        Show “Starting From:” before the price
                      </label>
                    </FormRow>
                  </>
                )}
                {draft.price.type === 'range' && (
                  <FormRow label="Price range">
                    <span className="cb-money">
                      $
                      <input type="text" inputMode="decimal" className="small-text" value={draft.price.min ?? ''} onChange={(e) => setPrice({ min: e.target.value })} placeholder="14.00" aria-label="Lowest price" />
                    </span>
                    <span className="cb-dash">to</span>
                    <span className="cb-money">
                      $
                      <input type="text" inputMode="decimal" className="small-text" value={draft.price.max ?? ''} onChange={(e) => setPrice({ max: e.target.value })} placeholder="220.00" aria-label="Highest price" />
                    </span>
                    {(errors.min || errors.max) && <p className="field-error">{errors.min || errors.max}</p>}
                  </FormRow>
                )}
                {draft.price.type === 'sale' && (
                  <>
                    <FormRow label="Normal price">
                      <span className="cb-money">
                        $
                        <input type="text" inputMode="decimal" className="small-text" value={draft.price.regular ?? ''} onChange={(e) => setPrice({ regular: e.target.value })} placeholder="34.95" />
                      </span>
                      {errors.regular && <p className="field-error">{errors.regular}</p>}
                    </FormRow>
                    <FormRow label="Sale price">
                      <span className="cb-money">
                        $
                        <input type="text" inputMode="decimal" className="small-text" value={draft.price.sale ?? ''} onChange={(e) => setPrice({ sale: e.target.value })} placeholder="24.95" />
                      </span>
                      {errors.sale && <p className="field-error">{errors.sale}</p>}
                    </FormRow>
                  </>
                )}
                <FormRow label="In stock">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={draft.stock === 'instock'} onChange={(e) => set({ stock: e.target.checked ? 'instock' : 'outofstock' })} />
                    This product is available to buy
                  </label>
                </FormRow>
              </FormTable>
            </Postbox>

            <Postbox title="Categories">
              <p className="description">Tick where this product should appear in the menus (Shop by Cannabinoid, Type and Effect). Leave everything unticked and we’ll choose from the product name.</p>
              {[
                ['cannabinoids', 'Cannabinoid', CANNABINOIDS],
                ['types', 'Product type', TYPES],
                ['effects', 'Effect', EFFECTS],
              ].map(([field, label, options]) => (
                <fieldset key={field} className="cb-catgroup">
                  <legend>{label}</legend>
                  {options.map((o) => (
                    <label key={o.slug} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={(draft[field] || []).includes(o.slug)}
                        onChange={(e) => set({ [field]: e.target.checked ? [...(draft[field] || []), o.slug] : (draft[field] || []).filter((s) => s !== o.slug) })}
                      />
                      {o.label}
                    </label>
                  ))}
                </fieldset>
              ))}
            </Postbox>

            <Postbox title="Product details (Additional information tab)" collapsible defaultOpen={false}>
              <p className="description">Optional. Anything you fill in here appears in the “Additional information” tab on the product page.</p>
              <FormTable>
                <FormRow label="Cannabinoid profile" description="One per line, like “THCa: 88.5%”.">
                  <textarea className="large-text" rows={4} value={draft.profile || ''} onChange={(e) => set({ profile: e.target.value })} placeholder={'THCa: 88.5%\nDelta 9 THC: 0.2%\nTotal cannabinoids: 91%'} />
                </FormRow>
                <FormRow label="Suggested use">
                  <textarea className="large-text" rows={2} value={draft.suggestedUse || ''} onChange={(e) => set({ suggestedUse: e.target.value })} />
                </FormRow>
                <FormRow label="Ingredients">
                  <textarea className="large-text" rows={2} value={draft.ingredients || ''} onChange={(e) => set({ ingredients: e.target.value })} />
                </FormRow>
                <FormRow label="Lab results (COA) link" description="A link to the lab report PDF or page.">
                  <input type="url" className="large-text" value={draft.coaUrl || ''} onChange={(e) => set({ coaUrl: e.target.value })} placeholder="https://" />
                </FormRow>
              </FormTable>
            </Postbox>

            <Postbox title="Reviews" collapsible defaultOpen={false}>
              <p className="description">Customers send reviews to you on WhatsApp. Paste the ones you want to show here.</p>
              {(draft.reviews || []).map((r, i) => {
                const setReview = (patch) => set({ reviews: draft.reviews.map((x, j) => (j === i ? { ...x, ...patch } : x)) })
                return (
                  <div key={i} className="cb-review-edit">
                    <div className="cb-review-edit__row">
                      <input type="text" value={r.name || ''} onChange={(e) => setReview({ name: e.target.value })} placeholder="Customer name" aria-label="Customer name" />
                      <select value={r.rating || 5} onChange={(e) => setReview({ rating: Number(e.target.value) })} aria-label="Stars">
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {'★'.repeat(n)} ({n})
                          </option>
                        ))}
                      </select>
                      <input type="text" value={r.date || ''} onChange={(e) => setReview({ date: e.target.value })} placeholder="Date, e.g. March 3, 2026" aria-label="Date" />
                      <button type="button" className="button-link submitdelete" onClick={() => set({ reviews: draft.reviews.filter((_, j) => j !== i) })}>
                        Remove
                      </button>
                    </div>
                    <textarea className="large-text" rows={2} value={r.text || ''} onChange={(e) => setReview({ text: e.target.value })} placeholder="What the customer said" aria-label="Review text" />
                  </div>
                )
              })}
              <Button type="button" onClick={() => set({ reviews: [...(draft.reviews || []), { name: '', rating: 5, date: '', text: '' }] })}>
                Add review
              </Button>
            </Postbox>

            <Postbox title="More options" collapsible defaultOpen={false}>
              <p className="description">You can leave these as they are. They only change small details on the product card.</p>
              <FormTable>
                <FormRow label="Product page link" description="Where the product card links to when a shopper clicks it.">
                  <input type="url" className="large-text" value={draft.href} onChange={(e) => set({ href: e.target.value })} />
                </FormRow>
                <FormRow label="Button" description="“Add to cart” puts it straight in the cart. The others open the product page.">
                  <select value={draft.buttonKind} onChange={(e) => set({ buttonKind: e.target.value })}>
                    {Object.entries(BUTTON_KINDS).map(([value, k]) => (
                      <option key={value} value={value}>
                        {k.label}
                      </option>
                    ))}
                  </select>
                </FormRow>
                <FormRow label="Star rating" description="A number from 0 to 5. Leave empty to hide the stars.">
                  <input type="text" inputMode="decimal" className="small-text" value={draft.rating ?? ''} onChange={(e) => set({ rating: e.target.value })} placeholder="4.89" />
                  {errors.rating && <p className="field-error">{errors.rating}</p>}
                </FormRow>
                <FormRow label="Subscribe &amp; Save">
                  <select value={draft.price.subscribeDiscount || ''} onChange={(e) => setPrice({ subscribeDiscount: e.target.value || null })}>
                    <option value="">Don’t show</option>
                    {['5%', '10%', '15%', '20%'].map((v) => (
                      <option key={v} value={v}>
                        Up to {v}
                      </option>
                    ))}
                  </select>
                </FormRow>
                <FormRow label="Photo description" description="Read aloud by screen readers. Defaults to the product name.">
                  <input type="text" className="large-text" value={draft.imageAlt} onChange={(e) => set({ imageAlt: e.target.value })} />
                </FormRow>
                <FormRow label="Sale badge">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={draft.onSale || draft.price.type === 'sale'} disabled={draft.price.type === 'sale'} onChange={(e) => set({ onSale: e.target.checked })} />
                    Show the orange “Sale!” badge
                  </label>
                </FormRow>
              </FormTable>
            </Postbox>
          </div>

          <div id="postbox-container-1" className="postbox-container">
            <div className="postbox" id="submitdiv">
              <div className="postbox-header">
                <h2>Publish</h2>
              </div>
              <div className="inside">
                <div id="minor-publishing">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={draft.visible} onChange={(e) => set({ visible: e.target.checked })} />
                    Show on the home page
                  </label>
                </div>
                <div id="major-publishing-actions">
                  {isNew ? (
                    <Link to="/admin/products" className="button-link cancel">
                      Cancel
                    </Link>
                  ) : (
                    <button type="button" className="button-link submitdelete" onClick={() => setConfirmDelete(true)}>
                      Move to Trash
                    </button>
                  )}
                  <Button variant="primary" size="large" type="submit">
                    {isNew ? 'Publish' : 'Update'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="postbox" id="postimagediv">
              <div className="postbox-header">
                <h2>Product photo</h2>
              </div>
              <div className="inside">
                <ImageField value={draft.image} onChange={(image) => set({ image })} />
                {errors.image && <p className="field-error">{errors.image}</p>}
              </div>
            </div>

            <Postbox title="Product gallery">
              <GalleryField images={(draft.gallery || []).filter((g) => g !== draft.image)} onChange={(gallery) => set({ gallery })} />
            </Postbox>

            <Postbox title="How it will look">
              <Preview product={draft} />
            </Postbox>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete product"
        message={`“${draft.name}” will be removed from the home page.`}
        onConfirm={() => save(remove('products', draft.id), 'Product deleted.') && navigate('/admin/products')}
        onClose={() => setConfirmDelete(false)}
      />
    </form>
  )
}
