import { useEffect, useRef, useState } from 'react'
import megaMenus from './megaMenus'
import MegaMenu from './MegaMenu'
import MobileMenuContent from './MobileMenuContent'

// Bottom header row: "Shop / Delta 9 THC / THCa / CBD / Shop by Type / Shop by Effect / Resources".
// Below 1024px the same <nav> collapses into the WordPress overlay menu.
export default function MegaNav() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)

  // close any open panel on outside click or Escape, like the Ollie mega-menu script
  useEffect(() => {
    if (openMenu === null && !mobileOpen) return
    const onDown = (e) => {
      if (openMenu !== null && navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null)
    }
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpenMenu(null)
      setMobileOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openMenu, mobileOpen])

  useEffect(() => {
    document.documentElement.classList.toggle('has-modal-open', mobileOpen)
  }, [mobileOpen])

  return (
    <div
      id="cb-mega-nav"
      className="wp-block-group has-campton-font-family is-layout-flow wp-block-group-is-layout-flow"
      style={{ borderRadius: '8px' }}
    >
      <nav
        id="nav-18"
        ref={navRef}
        style={{ fontStyle: 'normal', fontWeight: 500, lineHeight: 2.5 }}
        className="is-responsive items-justified-center wp-block-navigation has-campton-font-family is-content-justification-center is-layout-flex wp-container-core-navigation-is-layout-c5c5bbf8 wp-block-navigation-is-layout-flex has-mobile-menu"
        aria-label="Menu"
      >
        <button
          aria-haspopup="dialog"
          aria-label="Open menu"
          className="wp-block-navigation__responsive-container-open"
          onClick={() => setMobileOpen(true)}
        >
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5 5v1.5h14V5H5z" />
            <path d="M5 12.8h14v-1.5H5v1.5z" />
            <path d="M5 19h14v-1.5H5V19z" />
          </svg>
        </button>
        <div
          className={`wp-block-navigation__responsive-container${mobileOpen ? ' has-modal-open is-menu-open' : ''}`}
          id="modal-15"
          tabIndex={-1}
        >
          <div className="wp-block-navigation__responsive-close" tabIndex={-1}>
            <div
              className="wp-block-navigation__responsive-dialog"
              aria-modal={mobileOpen || undefined}
              aria-label={mobileOpen ? 'Menu' : undefined}
              role={mobileOpen ? 'dialog' : undefined}
            >
              <button
                aria-label="Close menu"
                className="wp-block-navigation__responsive-container-close"
                onClick={() => setMobileOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                  <path d="m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06L12 13.06l6.47 6.47 1.06-1.06L13.06 12Z" />
                </svg>
              </button>
              <div className="wp-block-navigation__responsive-container-content" id="modal-15-content">
                <div className="wp-block-navigation__mobile-menu-content">
                  <MobileMenuContent />
                </div>
                <ul className="wp-block-navigation__container is-responsive items-justified-center wp-block-navigation has-campton-font-family">
                  {megaMenus.map((menu) => (
                    <MegaMenu
                      key={menu.id}
                      menu={menu}
                      open={openMenu === menu.id}
                      onToggle={() => setOpenMenu((cur) => (cur === menu.id ? null : menu.id))}
                      onClose={() => setOpenMenu(null)}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
