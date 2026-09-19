import { useLayoutEffect, useRef, useState } from 'react'

const TOP_SPACING = 40 // data-top-spacing on every panel
const BOTTOM_GAP = 24

// Full-width panels are positioned the same way the Ollie Menu Designer script does it:
// as wide as the viewport, pulled back to the viewport's left edge, capped to the visible height.
function usePanelPosition(open, panelRef) {
  const [style, setStyle] = useState({})

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const panel = panelRef.current
      if (window.innerWidth < 600 || !panel?.offsetParent) {
        setStyle({})
        return
      }
      const vw = document.documentElement.clientWidth
      const parentLeft = panel.offsetParent.getBoundingClientRect().left
      const top = panel.offsetParent.getBoundingClientRect().bottom
      setStyle({
        top: `${TOP_SPACING}px`,
        width: `${vw}px`,
        maxWidth: `${vw}px`,
        left: `${-parentLeft}px`,
        maxHeight: `${Math.max(window.innerHeight - top - TOP_SPACING - BOTTOM_GAP, 100)}px`,
        overflowY: 'auto',
      })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open, panelRef])

  return style
}

export default function MegaMenu({ menu, open, onToggle, onClose }) {
  const panelRef = useRef(null)
  const style = usePanelPosition(open, panelRef)
  const { id, label, className, Panel } = menu

  return (
    <li className="wp-block-navigation-item wp-block-ollie-mega-menu">
      <button
        id={`mega-menu-${id}-button`}
        className="wp-block-ollie-mega-menu__toggle wp-block-navigation-item__content"
        type="button"
        aria-expanded={open}
        aria-controls={`mega-menu-${id}-dropdown`}
        onClick={onToggle}
      >
        <span className="wp-block-navigation-item__label">{label}</span>
        <span className="wp-block-ollie-mega-menu__toggle-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" fill="none">
            <path d="M1.50002 4L6.00002 8L10.5 4" strokeWidth="1.5" />
          </svg>
        </span>
      </button>
      <div
        ref={panelRef}
        id={`mega-menu-${id}-dropdown`}
        className={className}
        tabIndex={-1}
        role="group"
        aria-labelledby={`mega-menu-${id}-button`}
        style={style}
      >
        {/* panels are only mounted once opened, so their images load on demand */}
        <PanelOnce open={open} Panel={Panel} />
        <button aria-label="Close menu" className="menu-container__close-button" type="button" onClick={onClose}>
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 10.3L17.6 4L16.6 3L10.5 9.2L4.4 3L3.4 4L9.5 10.3L3 17L4 18L10.5 11.4L17 18L18 17L11.5 10.3Z" />
          </svg>
        </button>
      </div>
    </li>
  )
}

function PanelOnce({ open, Panel }) {
  const [mounted, setMounted] = useState(open)
  if (open && !mounted) setMounted(true)
  return mounted ? <Panel /> : null
}
