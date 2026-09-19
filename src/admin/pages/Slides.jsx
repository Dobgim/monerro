import { useState } from 'react'
import { move, remove, setState, upsert, useSiteState } from '../../store/siteStore'
import ImageField from '../components/ImageField'
import { Badge, Button, ConfirmDialog, EmptyState, IconButton, Modal, PageHeader, TextInput, Toggle, useSave } from '../components/ui'

const EMPTY = { image: '', alt: '', title: '', caption: '', captionMobile: [], href: 'https://cannabuddy.com/shop/', ariaLabel: '', visible: true, width: 1600, height: 680 }

function SlideDialog({ slide, onClose }) {
  const save = useSave()
  const [draft, setDraft] = useState(() => ({ ...EMPTY, ...slide, mobileText: (slide?.captionMobile || []).join(' ') }))
  const [error, setError] = useState('')
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const submit = () => {
    if (!draft.image) {
      setError('Add a banner image.')
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
    if (save(upsert('slides', next), slide?.id ? 'Slide saved' : 'Slide added')) onClose()
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
          <Button variant="primary" icon="check" onClick={submit}>
            {slide?.id ? 'Save slide' : 'Add slide'}
          </Button>
        </>
      }
    >
      <ImageField label="Banner image" value={draft.image} onChange={(image) => set({ image })} maxWidth={2400} aspect="1600 / 680" fit="cover" />
      {error && <p className="adm-field__error">{error}</p>}
      <div className="adm-row">
        <TextInput label="Caption (desktop)" value={draft.caption || ''} onChange={(e) => set({ caption: e.target.value })} hint="Leave empty for no caption." />
        <TextInput label="Caption (phones)" value={draft.mobileText} onChange={(e) => set({ mobileText: e.target.value })} hint="A shorter version for small screens." />
      </div>
      <TextInput label="Link" type="url" value={draft.href} onChange={(e) => set({ href: e.target.value })} />
      <TextInput label="Image description (alt text)" value={draft.alt} onChange={(e) => set({ alt: e.target.value })} />
    </Modal>
  )
}

export default function Slides() {
  const slides = useSiteState((s) => s.slides)
  const save = useSave()
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const setVisible = (id, visible) => save(setState((s) => ({ ...s, slides: s.slides.map((x) => (x.id === id ? { ...x, visible } : x)) })))

  return (
    <>
      <PageHeader
        title="Hero slides"
        description="The banner carousel at the top of the home page. Slides rotate every 4 seconds, in this order."
        actions={
          <Button variant="primary" icon="plus" onClick={() => setEditing({})}>
            Add slide
          </Button>
        }
      />
      {slides.length ? (
        <ol className="adm-slides">
          {slides.map((s, i) => (
            <li key={s.id} className={`adm-card adm-slide${s.visible ? '' : ' is-muted'}`}>
              <div className="adm-slide__img">
                <img src={s.image} alt="" loading="lazy" />
                <span className="adm-slide__num">{i + 1}</span>
              </div>
              <div className="adm-slide__body">
                <div>
                  <strong>{s.caption || <em>No caption</em>}</strong>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.href.replace(/^https?:\/\//, '')}
                  </a>
                </div>
                <div className="adm-slide__actions">
                  {s.visible ? <Badge tone="success">Showing</Badge> : <Badge>Hidden</Badge>}
                  <Toggle checked={s.visible} onChange={(v) => setVisible(s.id, v)} label={<span className="sr-only">Show slide {i + 1}</span>} />
                  <IconButton icon="up" label="Move earlier" disabled={i === 0} onClick={() => save(move('slides', s.id, -1))} />
                  <IconButton icon="down" label="Move later" disabled={i === slides.length - 1} onClick={() => save(move('slides', s.id, 1))} />
                  <IconButton icon="edit" label="Edit slide" onClick={() => setEditing(s)} />
                  <IconButton icon="trash" label="Delete slide" variant="danger" onClick={() => setToDelete(s)} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState icon="slides" title="No slides">
          The hero banner is hidden until you add a slide.
        </EmptyState>
      )}

      {editing && <SlideDialog slide={editing} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete slide?"
        message="This slide will be removed from the hero banner."
        onConfirm={() => save(remove('slides', toDelete.id), 'Slide deleted')}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
