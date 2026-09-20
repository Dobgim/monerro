import { useState } from 'react'
import { move, remove, setState, upsert, useSiteState } from '../../store/siteStore'
import Icon from '../components/Icon'
import ImageField from '../components/ImageField'
import { Button, ConfirmDialog, EmptyRow, FormRow, FormTable, Modal, PageHeader, RowAction, Toggle, useSave } from '../components/ui'

const EMPTY = { image: '', alt: '', title: '', caption: '', captionMobile: [], href: 'https://cannabuddy.com/shop/', ariaLabel: '', visible: true, width: 1600, height: 680 }

function SlideDialog({ slide, onClose }) {
  const save = useSave()
  const [draft, setDraft] = useState(() => ({ ...EMPTY, ...slide, mobileText: (slide?.captionMobile || []).join(' ') }))
  const [error, setError] = useState('')
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const submit = () => {
    if (!draft.image) {
      setError('Please add a banner photo.')
      return
    }
    const { mobileText, ...rest } = draft
    const next = {
      ...rest,
      id: draft.id ?? Date.now(),
      caption: (draft.caption || '').trim() || null,
      captionMobile: mobileText.trim() ? [mobileText.trim()] : null,
      ariaLabel: draft.ariaLabel || draft.caption || draft.alt,
    }
    if (save(upsert('slides', next), slide?.id ? 'Slide updated.' : 'Slide added.')) onClose()
  }

  return (
    <Modal
      open
      wide
      title={slide?.id ? 'Edit slide' : 'Add slide'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            {slide?.id ? 'Update slide' : 'Add slide'}
          </Button>
        </>
      }
    >
      <ImageField label="Banner photo" value={draft.image} onChange={(image) => set({ image })} maxWidth={2400} aspect="1600 / 680" fit="cover" setLabel="Set banner photo" />
      {error && <p className="field-error">{error}</p>}
      <FormTable>
        <FormRow label="Caption" description="The white text shown over the banner. Leave empty for no caption.">
          <input type="text" className="large-text" value={draft.caption || ''} onChange={(e) => set({ caption: e.target.value })} />
        </FormRow>
        <FormRow label="Short caption" description="A shorter version used on phones.">
          <input type="text" className="large-text" value={draft.mobileText} onChange={(e) => set({ mobileText: e.target.value })} />
        </FormRow>
        <FormRow label="Link" description="Where shoppers go when they click the banner.">
          <input type="url" className="large-text" value={draft.href} onChange={(e) => set({ href: e.target.value })} />
        </FormRow>
        <FormRow label="Photo description" description="Read aloud by screen readers.">
          <input type="text" className="large-text" value={draft.alt} onChange={(e) => set({ alt: e.target.value })} />
        </FormRow>
      </FormTable>
    </Modal>
  )
}

export default function Slides() {
  const slides = useSiteState((s) => s.slides)
  const save = useSave()
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const setVisible = (id, visible) =>
    save(setState((s) => ({ ...s, slides: s.slides.map((x) => (x.id === id ? { ...x, visible } : x)) })), visible ? 'Slide is now showing.' : 'Slide hidden.')

  return (
    <>
      <PageHeader
        title="Hero Slides"
        action={
          <button type="button" className="page-title-action" onClick={() => setEditing({})}>
            Add New
          </button>
        }
        description="The big banner photos at the top of the home page. They change every 4 seconds, in this order."
      />

      <table className="wp-list-table widefat fixed striped">
        <thead>
          <tr>
            <th scope="col" className="column-banner">
              <span className="screen-reader-text">Photo</span>
            </th>
            <th scope="col" className="column-primary">
              Caption
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
          {slides.length === 0 && <EmptyRow colSpan={5}>No slides yet. The banner is hidden until you add one.</EmptyRow>}
          {slides.map((s, i) => (
            <tr key={s.id}>
              <td className="column-banner">
                <img src={s.image} alt="" loading="lazy" />
              </td>
              <td className="column-primary has-row-actions">
                <strong>
                  <button type="button" className="row-title button-link" onClick={() => setEditing(s)}>
                    {s.caption || `Slide ${i + 1}`}
                  </button>
                </strong>
                {!s.visible && <span className="post-state"> — Hidden</span>}
                <div className="row-actions">
                  <RowAction onClick={() => setEditing(s)}>Edit</RowAction> |{' '}
                  <RowAction danger onClick={() => setToDelete(s)}>
                    Delete
                  </RowAction>
                </div>
              </td>
              <td data-colname="Link" className="column-link">
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.href.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </td>
              <td data-colname="Showing">
                <Toggle checked={s.visible} onChange={(v) => setVisible(s.id, v)} label={`Show slide ${i + 1}`} />
              </td>
              <td data-colname="Order" className="column-order">
                <button type="button" className="button button-small" disabled={i === 0} aria-label="Move up" onClick={() => save(move('slides', s.id, -1))}>
                  <Icon name="up" size={14} />
                </button>
                <button type="button" className="button button-small" disabled={i === slides.length - 1} aria-label="Move down" onClick={() => save(move('slides', s.id, 1))}>
                  <Icon name="down" size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && <SlideDialog slide={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete slide"
        message="This slide will be removed from the banner."
        onConfirm={() => save(remove('slides', toDelete.id), 'Slide deleted.')}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
