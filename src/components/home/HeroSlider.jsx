import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSiteState } from '../../store/siteStore'

// Settings taken from the original MetaSlider config
const INTERVAL = 4000
const SPEED = 1000

const ARROW_PREV =
  'M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z'
const ARROW_NEXT =
  'M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z'

function Slide({ slide, clone, active, eager, trackLength }) {
  return (
    <li
      className={`${slide.className || `slide-${slide.id} ms-image`}${clone ? ' clone' : ''}${active ? ' flex-active-slide' : ''}`}
      aria-hidden={clone || !active || undefined}
      aria-roledescription="slide"
      style={{ width: `${100 / trackLength}%`, float: 'left', display: 'block', marginRight: 0 }}
    >
      <a className="metaslider_image_link" href={slide.href} aria-label={slide.ariaLabel} target="_self" tabIndex={active ? 0 : -1}>
        <img
          src={slide.image}
          alt={slide.alt}
          title={slide.title}
          width={slide.width}
          height={slide.height}
          className={`slider-699484 slide-${slide.id} msDefaultImage`}
          style={{ margin: '0 auto', width: '100%' }}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          draggable="false"
        />
      </a>
      {slide.caption && (
        <div className="caption-wrap">
          <div className="caption">
            <div>
              <div className="metaslider-hidden-content hide-smartphone">{slide.caption}</div>
              <div className="metaslider-hidden-content hide-desktop hide-laptop hide-tablet">
                {(slide.captionMobile?.length ? slide.captionMobile : [slide.caption]).map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export default function HeroSlider() {
  const allSlides = useSiteState((s) => s.slides)
  const slides = useMemo(() => allSlides.filter((s) => s.visible), [allSlides])
  const count = slides.length
  // position counts the leading clone, so slide 0 sits at position 1
  const [position, setPosition] = useState(1)
  const [animate, setAnimate] = useState(true)
  const [hovered, setHovered] = useState(false)
  const busy = useRef(false)
  const touch = useRef(null)

  // restart from the first slide when the admin adds/removes slides
  const [prevCount, setPrevCount] = useState(count)
  if (prevCount !== count) {
    setPrevCount(count)
    setPosition(1)
    setAnimate(false)
  }

  const go = useCallback((delta) => {
    if (busy.current || count < 2) return
    busy.current = true
    setAnimate(true)
    setPosition((p) => p + delta)
  }, [count])

  // after sliding onto a clone, jump (without animation) to the real slide it mirrors
  const onTransitionEnd = () => {
    busy.current = false
    if (position === 0 || position === count + 1) {
      setAnimate(false)
      setPosition(position === 0 ? count : 1)
    }
  }

  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)))
      return () => cancelAnimationFrame(id)
    }
  }, [animate])

  useEffect(() => {
    if (hovered) return
    const id = setInterval(() => go(1), INTERVAL)
    return () => clearInterval(id)
  }, [hovered, go])

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  if (!count) return null
  const active = ((position - 1 + count) % count + count) % count
  const track = [slides[count - 1], ...slides, slides[0]]

  return (
    <section id="home-hero" className="l-section wpb_row us_custom_8d45c27c height_auto width_full">
      <div className="l-section-h i-cf">
        <div className="g-cols vc_row via_flex valign_top type_default stacking_default">
          <div className="vc_col-sm-12 wpb_column vc_column_container">
            <div className="vc_column-inner">
              <div className="wpb_wrapper">
                <div className="wpb_text_column">
                  <div className="wpb_wrapper">
                    <div
                      id="metaslider-id-699484"
                      role="region"
                      aria-label="Hero banner"
                      className="ml-slider-3-112-0 ml-slider-pro-2-60-0 metaslider metaslider-flex metaslider-699484 ml-slider hide-arrows-smartphone hide-arrows-tablet has-onhover-arrows ms-theme-simply-dark nav-hidden"
                      style={{ width: '100%' }}
                    >
                      <div id="metaslider_container_699484">
                        <div
                          className={`flexslider${hovered ? ' ms-hover' : ''}`}
                          id="metaslider_699484"
                          onMouseEnter={() => setHovered(true)}
                          onMouseLeave={() => setHovered(false)}
                          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
                          onTouchEnd={(e) => {
                            if (touch.current === null) return
                            const dx = e.changedTouches[0].clientX - touch.current
                            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
                            touch.current = null
                          }}
                        >
                          <div className="flex-viewport" style={{ overflow: 'hidden', position: 'relative' }}>
                            <ul
                              className="slides"
                              aria-live="polite"
                              onTransitionEnd={onTransitionEnd}
                              style={{
                                width: `${(count + 2) * 100}%`,
                                transform: `translate3d(${(-position * 100) / (count + 2)}%, 0, 0)`,
                                transition: animate ? `transform ${SPEED}ms linear` : 'none',
                              }}
                            >
                              {track.map((slide, i) => (
                                <Slide
                                  key={`${slide.id}-${i}`}
                                  slide={slide}
                                  clone={i === 0 || i === count + 1}
                                  active={i === position}
                                  eager={i === 1}
                                  trackLength={count + 2}
                                />
                              ))}
                            </ul>
                          </div>
                          <ul className="flex-direction-nav">
                            <li className="flex-nav-prev">
                              <a className="flex-prev" href="#" aria-label="Previous Slide" onClick={(e) => { e.preventDefault(); go(-1) }}>
                                <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                                  <title>Previous Slide</title>
                                  <path fill="currentColor" d={ARROW_PREV} />
                                </svg>
                              </a>
                            </li>
                            <li className="flex-nav-next">
                              <a className="flex-next" href="#" aria-label="Next Slide" onClick={(e) => { e.preventDefault(); go(1) }}>
                                <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                                  <title>Next Slide</title>
                                  <path fill="currentColor" d={ARROW_NEXT} />
                                </svg>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <span className="screen-reader-text" aria-live="polite">
                      Slide {active + 1} of {count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
