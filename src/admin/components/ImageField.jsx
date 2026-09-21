import { useMemo, useRef, useState } from 'react'
import { addMedia, useSiteState } from '../../store/siteStore'
import { uploadPhoto } from '../../lib/media'
import Icon from './Icon'
import { Button, Modal } from './ui'

/** Resize a photo, upload it to the live site and add it to the Media Library. Resolves to its URL. */
export async function uploadAndRemember(file, maxWidth) {
  const url = await uploadPhoto(file, maxWidth)
  addMedia(url)
  return url
}

// Every photo already on the site plus everything uploaded, for the "Media Library" picker
export function useLibrary() {
  const state = useSiteState()
  return useMemo(() => {
    const set = new Set(state.media)
    state.products.forEach((p) => p.image && set.add(p.image))
    state.slides.forEach((s) => s.image && set.add(s.image))
    state.brands.forEach((b) => b.image && set.add(b.image))
    return [...set].filter((src) => !src.startsWith('data:'))
  }, [state])
}

export default function ImageField({ label, value, onChange, maxWidth = 1200, aspect = '1 / 1', fit = 'contain', setLabel = 'Set product photo' }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const library = useLibrary()

  const onFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('That file isn’t a photo. Please choose a JPG, PNG or WebP image.')
      return
    }
    setBusy(true)
    setError('')
    try {
      onChange(await uploadAndRemember(file, maxWidth))
    } catch (e) {
      setError(e.message === 'Unsupported image' ? 'That photo could not be read. Please try another one.' : `The photo could not be uploaded — ${e.message}. Please try again.`)
    } finally {
      setBusy(false)
    }
  }

  const shown = library.filter((src) => src.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="cb-imagefield">
      {label && <p className="cb-imagefield__label">{label}</p>}
      <div
        className="cb-imagefield__drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          onFile(e.dataTransfer.files[0])
        }}
      >
        {value ? (
          <div className="cb-imagefield__preview" style={{ aspectRatio: aspect }}>
            <img src={value} alt="" style={{ objectFit: fit }} />
          </div>
        ) : (
          <button type="button" className="cb-imagefield__empty" style={{ aspectRatio: aspect }} onClick={() => input.current.click()}>
            <Icon name="image" size={26} />
            <span>{setLabel}</span>
            <small>Click to choose, or drag a photo here</small>
          </button>
        )}
        {busy && <p className="description">Uploading photo…</p>}
        <p className="cb-imagefield__actions">
          <Button onClick={() => input.current.click()}>Upload photo</Button>
          <Button onClick={() => setLibraryOpen(true)}>Media Library</Button>
          {value && (
            <button type="button" className="button-link submitdelete" onClick={() => onChange('')}>
              Remove photo
            </button>
          )}
        </p>
        <p className="description">Large photos are resized to {maxWidth}px automatically, so any phone or camera photo is fine.</p>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files[0])} />
      </div>
      {error && <p className="field-error">{error}</p>}

      <Modal open={libraryOpen} title="Media Library" onClose={() => setLibraryOpen(false)} wide>
        <input type="search" className="large-text" placeholder="Search photos by file name…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <div className="cb-library">
          {shown.map((src) => (
            <button
              key={src}
              type="button"
              className={`cb-library__item${src === value ? ' is-selected' : ''}`}
              onClick={() => {
                onChange(src)
                setLibraryOpen(false)
              }}
              title={src.split('/').pop()}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
          {shown.length === 0 && <p className="description">No photos match “{filter}”.</p>}
        </div>
      </Modal>
    </div>
  )
}
