import { useState } from 'react'
import { move, remove, setState, uid, upsert, useSiteState } from '../../store/siteStore'
import ImageField from '../components/ImageField'
import { Button, ConfirmDialog, EmptyState, IconButton, Modal, PageHeader, TextInput, Toggle, useSave } from '../components/ui'
import Icon from '../components/Icon'

const EMPTY = { name: '', href: 'https://cannabuddy.com/cannabis-brands/', image: '', visible: true, width: 300, height: 300, valign: 'valign_top' }

function BrandDialog({ brand, onClose }) {
  const save = useSave()
  const [draft, setDraft] = useState({ ...EMPTY, ...brand })
  const [errors, setErrors] = useState({})
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const submit = () => {
    const errs = {}
    if (!draft.name.trim()) errs.name = 'Enter the brand name.'
    if (!draft.image) errs.image = 'Add the brand logo.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const next = {
      ...draft,
      id: draft.id || uid('brand'),
      name: draft.name.trim(),
      ariaLabel: draft.ariaLabel || draft.name.trim(),
      title: `view all ${draft.name.trim()} products`,
      // the hover state reuses the same logo, as on the original site
      activeImage: draft.image,
    }
    if (save(upsert('brands', next), brand?.id ? 'Brand saved' : 'Brand added')) onClose()
  }

  return (
    <Modal
      open
      title={brand?.id ? 'Edit brand' : 'Add brand'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="check" onClick={submit}>
            {brand?.id ? 'Save brand' : 'Add brand'}
          </Button>
        </>
      }
    >
      <TextInput label="Brand name" value={draft.name} onChange={(e) => set({ name: e.target.value })} error={errors.name} />
      <TextInput label="Brand page link" type="url" value={draft.href} onChange={(e) => set({ href: e.target.value })} />
      <ImageField label="Logo" value={draft.image} onChange={(image) => set({ image })} maxWidth={600} />
      {errors.image && <p className="adm-field__error">{errors.image}</p>}
    </Modal>
  )
}

export default function Brands() {
  const brands = useSiteState((s) => s.brands)
  const save = useSave()
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const shown = brands.filter((b) => !q || b.name.toLowerCase().includes(q))
  const setVisible = (id, visible) => save(setState((s) => ({ ...s, brands: s.brands.map((b) => (b.id === id ? { ...b, visible } : b)) })))

  return (
    <>
      <PageHeader
        title="Brands"
        description="Logos in “Featured Cannabis Brands”, four per row in this order."
        actions={
          <Button variant="primary" icon="plus" onClick={() => setEditing({})}>
            Add brand
          </Button>
        }
      />
      <div className="adm-toolbar">
        <label className="adm-search">
          <Icon name="search" size={16} />
          <input type="search" placeholder="Search brands…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search brands" />
        </label>
      </div>

      {shown.length ? (
        <ul className="adm-brandgrid">
          {shown.map((b) => {
            const i = brands.indexOf(b)
            return (
              <li key={b.id} className={`adm-card adm-brandcard${b.visible ? '' : ' is-muted'}`}>
                <div className="adm-brandcard__logo">
                  <img src={b.image} alt="" loading="lazy" />
                </div>
                <p className="adm-brandcard__name">{b.name.replace(/ (brand|Brand Page)? ?(logo|Logo)$/i, '')}</p>
                <div className="adm-brandcard__actions">
                  <Toggle checked={b.visible} onChange={(v) => setVisible(b.id, v)} label={<span className="sr-only">Show {b.name}</span>} />
                  {!q && (
                    <>
                      <IconButton icon="up" label="Move earlier" disabled={i === 0} onClick={() => save(move('brands', b.id, -1))} />
                      <IconButton icon="down" label="Move later" disabled={i === brands.length - 1} onClick={() => save(move('brands', b.id, 1))} />
                    </>
                  )}
                  <IconButton icon="edit" label={`Edit ${b.name}`} onClick={() => setEditing(b)} />
                  <IconButton icon="trash" label={`Delete ${b.name}`} variant="danger" onClick={() => setToDelete(b)} />
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyState icon="brands" title="No brands match" />
      )}

      {editing && <BrandDialog brand={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete brand?"
        message={toDelete && `${toDelete.name} will be removed from the home page.`}
        onConfirm={() => save(remove('brands', toDelete.id), 'Brand deleted')}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
