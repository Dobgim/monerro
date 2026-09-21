import { useCallback, useEffect, useRef, useState } from 'react'

// Product photo gallery: main photo, thumbnails, arrows, swipe, and a full-screen view.
export default function ProductGallery({ images, alt, badge }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const touchX = useRef(null)
  const count = images.length
  const go = useCallback((delta) => setIndex((i) => (i + delta + count) % count), [count])

  // reset when switching to another product
  const [prevImages, setPrevImages] = useState(images)
  if (prevImages !== images && prevImages.join() !== images.join()) {
    setPrevImages(images)
    setIndex(0)
  }

  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => {
      if (e.key === 'Escape') setZoom(false)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [zoom, go])

  const swipe = {
    onTouchStart: (e) => (touchX.current = e.touches[0].clientX),
    onTouchEnd: (e) => {
      if (touchX.current === null) return
      const dx = e.changedTouches[0].clientX - touchX.current
      if (Math.abs(dx) > 40 && count > 1) go(dx < 0 ? 1 : -1)
      touchX.current = null
    },
  }

  return (
    <div className="cb-gallery">
      <div className="cb-gallery__main" {...swipe}>
        {badge}
        <button type="button" className="cb-gallery__zoom" onClick={() => setZoom(true)} aria-label="View photo full screen">
          <img src={images[index]} alt={alt} width="680" height="680" />
        </button>
        {count > 1 && (
          <>
            <button type="button" className="cb-gallery__arrow is-prev" onClick={() => go(-1)} aria-label="Previous photo">
              ‹
            </button>
            <button type="button" className="cb-gallery__arrow is-next" onClick={() => go(1)} aria-label="Next photo">
              ›
            </button>
            <span className="cb-gallery__count" aria-live="polite">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="cb-gallery__thumbs" role="tablist" aria-label="Product photos">
          {images.map((src, i) => (
            <button key={src} type="button" role="tab" aria-selected={i === index} aria-label={`Photo ${i + 1}`} className={i === index ? 'is-active' : ''} onClick={() => setIndex(i)}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div className="cb-lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={(e) => e.target === e.currentTarget && setZoom(false)} {...swipe}>
          <button type="button" className="cb-lightbox__close" onClick={() => setZoom(false)} aria-label="Close">
            ×
          </button>
          <img src={images[index]} alt={alt} />
          {count > 1 && (
            <>
              <button type="button" className="cb-lightbox__arrow is-prev" onClick={() => go(-1)} aria-label="Previous photo">
                ‹
              </button>
              <button type="button" className="cb-lightbox__arrow is-next" onClick={() => go(1)} aria-label="Next photo">
                ›
              </button>
              <span className="cb-lightbox__count">
                {index + 1} / {count}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
