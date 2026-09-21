import { useRef, useState } from 'react'
import { uploadAndRemember, useLibrary } from './ImageField'
import Icon from './Icon'
import { Button, Modal } from './ui'

// WordPress-style "Product gallery" box: add several photos at once, reorder, remove.
export default function GalleryField({ images, onChange, maxWidth = 1200 }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(0)
  const [error, setError] = useState('')
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [picked, setPicked] = useState([])
  const library = useLibrary()

  const addFiles = async (files) => {
    const list = [...files].filter((f) => f.type.startsWith('image/'))
    if (!list.length) {
      setError('Please choose photo files (JPG, PNG or WebP).')
      return
    }
    setError('')
    setBusy(list.length)
    const added = []
    for (const f of list) {
      try {
        added.push(await uploadAndRemember(f, maxWidth))
      } catch (e) {
        setError(e.message === 'Unsupported image' ? 'One of the photos could not be read and was skipped.' : `A photo could not be uploaded — ${e.message}.`)
      }
      setBusy((n) => n - 1)
    }
    onChange([...images, ...added])
  }

  const move = (i, delta) => {
    const j = i + delta
    if (j < 0 || j >= images.length) return
    const next = [...images]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="cb-galleryfield">
      {images.length > 0 ? (
        <ul className="cb-galleryfield__grid">
          {images.map((src, i) => (
            <li key={src + i}>
              <img src={src} alt="" />
              <div className="cb-galleryfield__tools">
                <button type="button" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)}>
                  <Icon name="up" size={12} />
                </button>
                <button type="button" aria-label="Move later" disabled={i === images.length - 1} onClick={() => move(i, 1)}>
                  <Icon name="down" size={12} />
                </button>
                <button type="button" aria-label="Remove photo" className="is-remove" onClick={() => onChange(images.filter((_, j) => j !== i))}>
                  <Icon name="close" size={12} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="description">No extra photos yet. Add a few angles — the back of the pack, the product out of the box, a close-up.</p>
      )}

      <div
        className="cb-galleryfield__drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          addFiles(e.dataTransfer.files)
        }}
      >
        <p className="cb-imagefield__actions">
          <Button onClick={() => input.current.click()}>Add photos</Button>
          <Button onClick={() => { setPicked([]); setLibraryOpen(true) }}>Media Library</Button>
        </p>
        <p className="description">{busy ? `Uploading ${busy} photo${busy === 1 ? '' : 's'}…` : 'You can select several photos at once, or drag them here.'}</p>
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
      {error && <p className="field-error">{error}</p>}

      <Modal
        open={libraryOpen}
        title="Add photos from the Media Library"
        onClose={() => setLibraryOpen(false)}
        wide
        footer={
          <>
            <Button onClick={() => setLibraryOpen(false)}>Cancel</Button>
            <Button variant="primary" disabled={!picked.length} onClick={() => { onChange([...images, ...picked.filter((p) => !images.includes(p))]); setLibraryOpen(false) }}>
              Add {picked.length || ''} photo{picked.length === 1 ? '' : 's'}
            </Button>
          </>
        }
      >
        <p className="description">Click photos to select them, then press Add.</p>
        <div className="cb-library">
          {library.map((src) => (
            <button key={src} type="button" className={`cb-library__item${picked.includes(src) ? ' is-selected' : ''}`} onClick={() => setPicked((p) => (p.includes(src) ? p.filter((x) => x !== src) : [...p, src]))}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
