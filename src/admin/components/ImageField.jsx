import { useMemo, useRef, useState } from 'react'
import { useSiteState } from '../../store/siteStore'
import Icon from './Icon'
import { Button, Modal } from './ui'

// Resize + re-encode an uploaded file so it fits comfortably in browser storage.
function compressImage(file, maxWidth, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.naturalWidth)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/webp', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Unsupported image'))
    }
    img.src = url
  })
}

// Every image the site already ships with, for the "Choose from library" picker
function useLibrary() {
  const state = useSiteState()
  return useMemo(() => {
    const set = new Set()
    state.products.forEach((p) => p.image && set.add(p.image))
    state.slides.forEach((s) => s.image && set.add(s.image))
    state.brands.forEach((b) => b.image && set.add(b.image))
    return [...set].filter((src) => !src.startsWith('data:'))
  }, [state])
}

export default function ImageField({ label, value, onChange, maxWidth = 1200, aspect = '1 / 1', fit = 'contain' }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const library = useLibrary()

  const onFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setBusy(true)
    setError('')
    try {
      onChange(await compressImage(file, maxWidth))
    } catch {
      setError('That image could not be read.')
    } finally {
      setBusy(false)
    }
  }

  const shown = library.filter((src) => src.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="adm-field">
      {label && <span className="adm-field__label">{label}</span>}
      <div
        className="adm-imagefield"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          onFile(e.dataTransfer.files[0])
        }}
      >
        <div className="adm-imagefield__preview" style={{ aspectRatio: aspect }}>
          {value ? <img src={value} alt="" style={{ objectFit: fit }} /> : <Icon name="image" size={30} />}
          {busy && <div className="adm-imagefield__busy">Optimising…</div>}
        </div>
        <div className="adm-imagefield__actions">
          <Button size="sm" icon="upload" onClick={() => input.current.click()}>
            Upload
          </Button>
          <Button size="sm" icon="image" onClick={() => setLibraryOpen(true)}>
            Library
          </Button>
          {value && (
            <Button size="sm" variant="ghost" icon="trash" onClick={() => onChange('')}>
              Remove
            </Button>
          )}
          <p className="adm-field__hint">Drop an image here, or upload. Large images are resized to {maxWidth}px automatically.</p>
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files[0])} />
      </div>
      {error && <p className="adm-field__error">{error}</p>}

      <Modal open={libraryOpen} title="Image library" onClose={() => setLibraryOpen(false)} wide>
        <input className="adm-input" placeholder="Filter by file name…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <div className="adm-library">
          {shown.map((src) => (
            <button
              key={src}
              type="button"
              className={`adm-library__item${src === value ? ' is-selected' : ''}`}
              onClick={() => {
                onChange(src)
                setLibraryOpen(false)
              }}
              title={src.split('/').pop()}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
