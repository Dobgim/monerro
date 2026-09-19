import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BUTTON_KINDS, remove, resolveButton, upsert, useSiteState } from '../../store/siteStore'
import ImageField from '../components/ImageField'
import { Button, Card, ConfirmDialog, EmptyState, PageHeader, Segmented, Select, TextInput, Toggle, useSave } from '../components/ui'

const EMPTY = {
  name: '',
  href: 'https://cannabuddy.com/shop/',
  image: '',
  imageAlt: '',
  rating: null,
  onSale: false,
  stock: 'instock',
  visible: true,
  buttonKind: 'add',
  price: { type: 'single', prefix: null, amount: '', min: '', max: '', regular: '', sale: '', subscribeDiscount: '15%' },
}

const money = /^\d+(\.\d{1,2})?$/

function validate(p) {
  const e = {}
  if (!p.name.trim()) e.name = 'Give the product a name.'
  if (!p.image) e.image = 'Add a product image.'
  const pr = p.price
  const bad = (v) => !money.test(String(v ?? '').trim())
  if (pr.type === 'single' && bad(pr.amount)) e.amount = 'Enter a price like 24.95'
  if (pr.type === 'range') {
    if (bad(pr.min)) e.min = 'Enter a price like 14.00'
    if (bad(pr.max)) e.max = 'Enter a price like 220.00'
    if (!e.min && !e.max && Number(pr.min) > Number(pr.max)) e.max = 'Must be at least the lowest price.'
  }
  if (pr.type === 'sale') {
    if (bad(pr.regular)) e.regular = 'Enter a price like 34.95'
    if (bad(pr.sale)) e.sale = 'Enter a price like 24.95'
    if (!e.regular && !e.sale && Number(pr.sale) >= Number(pr.regular)) e.sale = 'Sale price should be below the regular price.'
  }
  if (p.rating !== null && p.rating !== '' && !(Number(p.rating) >= 0 && Number(p.rating) <= 5)) e.rating = 'Between 0 and 5.'
  return e
}

const fixed = (v) => (v === '' || v == null ? v : Number(v).toFixed(2))

// Preview in the storefront's style (the real card needs the theme CSS, which admin doesn't load)
function Preview({ product }) {
  const button = resolveButton(product)
  const pr = product.price
  return (
    <div className="adm-preview">
      <div className="adm-preview__img">
        {(product.onSale || pr.type === 'sale') && <span className="adm-preview__sale">Sale!</span>}
        {product.image ? <img src={product.image} alt="" /> : <span className="adm-thumb-ph" />}
      </div>
      <p className="adm-preview__name">{product.name || 'Product name'}</p>
      {product.rating !== null && product.rating !== '' && <p className="adm-preview__stars" aria-label={`Rated ${product.rating} out of 5`}>★★★★★</p>}
      <p className="adm-preview__price">
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
        <p className="adm-preview__sub">
          Subscribe &amp; Save up to <strong>{pr.subscribeDiscount}</strong>
        </p>
      )}
      <span className={`adm-preview__btn${product.buttonKind === 'more' && product.stock === 'outofstock' ? ' is-dark' : ''}`}>{button.label}</span>
    </div>
  )
}

export default function ProductEditor() {
  const { id } = useParams()
  const existing = useSiteState((s) => s.products.find((p) => String(p.id) === id))
  const isNew = !id
  const navigate = useNavigate()
  const save = useSave()
  const [draft, setDraft] = useState(() => (existing ? { ...existing, price: { ...EMPTY.price, ...existing.price } } : EMPTY))
  const [errors, setErrors] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!isNew && !existing) {
    return (
      <EmptyState title="Product not found">
        <Link to="/admin/products">Back to products</Link>
      </EmptyState>
    )
  }

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const setPrice = (patch) => setDraft((d) => ({ ...d, price: { ...d.price, ...patch } }))

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
      id: draft.id ?? Date.now(),
    }
    if (save(upsert('products', product), isNew ? 'Product added to the home page' : 'Product saved')) navigate('/admin/products')
  }

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader
        title={isNew ? 'Add product' : 'Edit product'}
        description={isNew ? 'New products are added to the top of the home page grid.' : existing.name}
        actions={
          <>
            <Button onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button variant="primary" type="submit" icon="check">
              {isNew ? 'Add product' : 'Save changes'}
            </Button>
          </>
        }
      />

      <div className="adm-editor">
        <div className="adm-editor__main">
          <Card title="Details">
            <TextInput label="Product name" value={draft.name} onChange={(e) => set({ name: e.target.value })} error={errors.name} placeholder="e.g. THCa Flower Blue Dream" />
            <TextInput label="Product page link" type="url" value={draft.href} onChange={(e) => set({ href: e.target.value })} hint="Where the card links to." />
            <ImageField label="Product image" value={draft.image} onChange={(image) => set({ image })} />
            {errors.image && <p className="adm-field__error">{errors.image}</p>}
            <TextInput label="Image description (alt text)" value={draft.imageAlt} onChange={(e) => set({ imageAlt: e.target.value })} hint="Read by screen readers. Defaults to the product name." />
          </Card>

          <Card title="Pricing">
            <Segmented
              label="Price type"
              value={draft.price.type}
              onChange={(type) => setPrice({ type })}
              options={[
                { value: 'single', label: 'Single price' },
                { value: 'range', label: 'Price range' },
                { value: 'sale', label: 'On sale' },
              ]}
            />
            {draft.price.type === 'single' && (
              <div className="adm-row">
                <TextInput label="Price ($)" inputMode="decimal" value={draft.price.amount ?? ''} onChange={(e) => setPrice({ amount: e.target.value })} error={errors.amount} />
                <Toggle checked={Boolean(draft.price.prefix)} onChange={(v) => setPrice({ prefix: v ? 'Starting From:' : null })} label="Show “Starting From:”" description="For products with several sizes" />
              </div>
            )}
            {draft.price.type === 'range' && (
              <div className="adm-row">
                <TextInput label="Lowest price ($)" inputMode="decimal" value={draft.price.min ?? ''} onChange={(e) => setPrice({ min: e.target.value })} error={errors.min} />
                <TextInput label="Highest price ($)" inputMode="decimal" value={draft.price.max ?? ''} onChange={(e) => setPrice({ max: e.target.value })} error={errors.max} />
              </div>
            )}
            {draft.price.type === 'sale' && (
              <div className="adm-row">
                <TextInput label="Regular price ($)" inputMode="decimal" value={draft.price.regular ?? ''} onChange={(e) => setPrice({ regular: e.target.value })} error={errors.regular} />
                <TextInput label="Sale price ($)" inputMode="decimal" value={draft.price.sale ?? ''} onChange={(e) => setPrice({ sale: e.target.value })} error={errors.sale} />
              </div>
            )}
            <Select
              label="Subscribe & Save line"
              value={draft.price.subscribeDiscount || ''}
              onChange={(e) => setPrice({ subscribeDiscount: e.target.value || null })}
              options={[
                { value: '', label: 'Don’t show' },
                { value: '5%', label: 'Up to 5%' },
                { value: '10%', label: 'Up to 10%' },
                { value: '15%', label: 'Up to 15%' },
                { value: '20%', label: 'Up to 20%' },
              ]}
            />
          </Card>

          <Card title="Display">
            <div className="adm-row">
              <Select
                label="Button"
                value={draft.buttonKind}
                onChange={(e) => set({ buttonKind: e.target.value })}
                options={Object.entries(BUTTON_KINDS).map(([value, k]) => ({ value, label: k.label }))}
                hint="“Add to cart” adds straight to the cart; the others open the product page."
              />
              <TextInput
                label="Star rating (0–5)"
                inputMode="decimal"
                value={draft.rating ?? ''}
                onChange={(e) => set({ rating: e.target.value })}
                error={errors.rating}
                hint="Leave empty to hide the stars."
              />
            </div>
            <div className="adm-stack">
              <Toggle checked={draft.visible} onChange={(visible) => set({ visible })} label="Show on the home page" />
              <Toggle checked={draft.stock === 'instock'} onChange={(v) => set({ stock: v ? 'instock' : 'outofstock' })} label="In stock" />
              <Toggle
                checked={draft.onSale || draft.price.type === 'sale'}
                onChange={(onSale) => set({ onSale })}
                label="Show “Sale!” badge"
                description={draft.price.type === 'sale' ? 'Always on for sale prices' : undefined}
              />
            </div>
          </Card>

          {!isNew && (
            <Card title="Danger zone">
              <div className="adm-danger">
                <p>Delete this product from the catalog and the home page.</p>
                <Button variant="danger" icon="trash" onClick={() => setConfirmDelete(true)}>
                  Delete product
                </Button>
              </div>
            </Card>
          )}
        </div>

        <aside className="adm-editor__side">
          <Card title="Preview">
            <Preview product={draft} />
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete product?"
        message={`“${draft.name}” will be removed from the catalog and the home page.`}
        onConfirm={() => save(remove('products', draft.id), 'Product deleted') && navigate('/admin/products')}
        onClose={() => setConfirmDelete(false)}
      />
    </form>
  )
}
