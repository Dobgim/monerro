import { useState } from 'react'
import { move, remove, setState, uid, upsert, useSiteState } from '../../store/siteStore'
import Icon from '../components/Icon'
import ImageField from '../components/ImageField'
import { Button, ConfirmDialog, EmptyRow, FormRow, FormTable, Modal, PageHeader, RowAction, SearchBox, Toggle, useSave } from '../components/ui'

const EMPTY = { name: '', href: 'https://cannabuddy.com/cannabis-brands/', image: '', visible: true, width: 300, height: 300, valign: 'valign_top' }

function BrandDialog({ brand, onClose }) {
  const save = useSave()
  const [draft, setDraft] = useState({ ...EMPTY, ...brand })
  const [errors, setErrors] = useState({})
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const submit = () => {
    const errs = {}
    if (!draft.name.trim()) errs.name = 'Please enter the brand name.'
    if (!draft.image) errs.image = 'Please add the brand logo.'
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
    if (save(upsert('brands', next), brand?.id ? 'Brand updated.' : 'Brand added.')) onClose()
  }

  return (
    <Modal
      open
      title={brand?.id ? 'Edit brand' : 'Add brand'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            {brand?.id ? 'Update brand' : 'Add brand'}
          </Button>
        </>
      }
    >
      <ImageField label="Logo" value={draft.image} onChange={(image) => set({ image })} maxWidth={600} setLabel="Set brand logo" />
      {errors.image && <p className="field-error">{errors.image}</p>}
      <FormTable>
        <FormRow label="Brand name">
          <input type="text" className="regular-text" value={draft.name} onChange={(e) => set({ name: e.target.value })} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </FormRow>
        <FormRow label="Brand page link">
          <input type="url" className="large-text" value={draft.href} onChange={(e) => set({ href: e.target.value })} />
        </FormRow>
      </FormTable>
    </Modal>
  )
}

const cleanName = (name) => name.replace(/ (brand|Brand Page)? ?(logo|Logo)$/i, '')

export default function Brands() {
  const brands = useSiteState((s) => s.brands)
  const save = useSave()
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const shown = brands.filter((b) => !q || b.name.toLowerCase().includes(q))
  const setVisible = (id, visible) =>
    save(setState((s) => ({ ...s, brands: s.brands.map((b) => (b.id === id ? { ...b, visible } : b)) })), visible ? 'Brand is now showing.' : 'Brand hidden.')

  return (
    <>
      <PageHeader
        title="Brands"
        action={
          <button type="button" className="page-title-action" onClick={() => setEditing({})}>
            Add New
          </button>
        }
        description="The logos in “Featured Cannabis Brands”, shown four per row in this order."
      />
      <SearchBox label="Search brands" value={query} onChange={setQuery} />

      <table className="wp-list-table widefat fixed striped">
        <thead>
          <tr>
            <th scope="col" className="column-thumb">
              <span className="screen-reader-text">Logo</span>
            </th>
            <th scope="col" className="column-primary">
              Brand
            </th>
            <th scope="col">Link</th>
            <th scope="col" className="column-visible">
              Showing
            </th>
            <th scope="col" className="column-order">
              Order
            </th>
          </tr>
        </thead>
        <tbody>
          {shown.length === 0 && <EmptyRow colSpan={5}>No brands found.</EmptyRow>}
          {shown.map((b) => {
            const i = brands.indexOf(b)
            return (
              <tr key={b.id}>
                <td className="column-thumb">
                  <img src={b.image} alt="" loading="lazy" />
                </td>
                <td className="column-primary has-row-actions">
                  <strong>
                    <button type="button" className="row-title button-link" onClick={() => setEditing(b)}>
                      {cleanName(b.name)}
                    </button>
                  </strong>
                  {!b.visible && <span className="post-state"> — Hidden</span>}
                  <div className="row-actions">
                    <RowAction onClick={() => setEditing(b)}>Edit</RowAction> |{' '}
                    <RowAction danger onClick={() => setToDelete(b)}>
                      Delete
                    </RowAction>
                  </div>
                </td>
                <td data-colname="Link" className="column-link">
                  <a href={b.href} target="_blank" rel="noreferrer">
                    {b.href.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </td>
                <td data-colname="Showing">
                  <Toggle checked={b.visible} onChange={(v) => setVisible(b.id, v)} label={`Show ${cleanName(b.name)}`} />
                </td>
                <td data-colname="Order" className="column-order">
                  <button type="button" className="button button-small" disabled={Boolean(q) || i === 0} aria-label="Move up" onClick={() => save(move('brands', b.id, -1))}>
                    <Icon name="up" size={14} />
                  </button>
                  <button type="button" className="button button-small" disabled={Boolean(q) || i === brands.length - 1} aria-label="Move down" onClick={() => save(move('brands', b.id, 1))}>
                    <Icon name="down" size={14} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {editing && <BrandDialog brand={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete brand"
        message={toDelete && `${cleanName(toDelete.name)} will be removed from the home page.`}
        onConfirm={() => save(remove('brands', toDelete.id), 'Brand deleted.')}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
