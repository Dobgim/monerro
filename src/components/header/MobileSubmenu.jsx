import { useState } from 'react'

// Collapsible item in the mobile overlay menu (WordPress "open on click" submenu)
export default function MobileSubmenu({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="wp-block-navigation-item has-child open-on-click wp-block-navigation-submenu">
      <button
        aria-expanded={open}
        aria-label={`${label} submenu`}
        className="wp-block-navigation-item__content wp-block-navigation-submenu__toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="wp-block-navigation-item__label">{label}</span>
      </button>
      <span className="wp-block-navigation__submenu-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
          <path d="M1.50002 4L6.00002 8L10.5 4" strokeWidth="1.5" />
        </svg>
      </span>
      <ul className="wp-block-navigation__submenu-container wp-block-navigation-submenu">{children}</ul>
    </li>
  )
}
