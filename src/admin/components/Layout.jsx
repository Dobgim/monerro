import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSiteState } from '../../store/siteStore'
import { signOut, useSession } from '../auth'
import Icon from './Icon'

// Menu order mirrors WordPress: Dashboard first, then the content the client edits.
const MENU = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'products', count: (s) => s.products.length, sub: [{ to: '/admin/products', label: 'All Products', end: true }, { to: '/admin/products/new', label: 'Add New' }] },
  { to: '/admin/slides', label: 'Hero Slides', icon: 'slides', count: (s) => s.slides.length },
  { to: '/admin/brands', label: 'Brands', icon: 'brands', count: (s) => s.brands.length },
  { to: '/admin/announcement', label: 'Announcement', icon: 'megaphone' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: 'mail', count: (s) => s.subscribers.length },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
]

export default function Layout() {
  const state = useSiteState()
  const user = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className={`wp-admin-shell${menuOpen ? ' mobile-menu-open' : ''}`}>
      <div id="wpadminbar">
        <ul className="ab-top-menu">
          <li>
            <a className="ab-item" href="/" target="_blank" rel="noreferrer">
              <Icon name="home" size={16} />
              <span>CannaBuddyHub</span>
            </a>
          </li>
          <li className="hide-on-phone">
            <a className="ab-item" href="/" target="_blank" rel="noreferrer">
              Visit Site
            </a>
          </li>
        </ul>
        <button type="button" className="ab-menu-toggle" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
          <Icon name="menu" size={20} />
        </button>
        <ul className="ab-top-menu ab-top-secondary">
          <li className="menupop">
            <span className="ab-item">
              Howdy, <strong>{user}</strong>
              <span className="avatar" aria-hidden="true">
                {user?.[0]?.toUpperCase()}
              </span>
            </span>
          </li>
          <li>
            <button type="button" className="ab-item" onClick={signOut}>
              Log Out
            </button>
          </li>
        </ul>
      </div>

      <div id="adminmenuwrap">
        <ul id="adminmenu">
          {MENU.map((item) => {
            const current = item.end ? pathname === item.to : pathname.startsWith(item.to)
            return (
              <li key={item.to} className={`menu-top${current ? ' wp-has-current-submenu current' : ''}`}>
                <NavLink to={item.to} end={item.end} className="menu-top-link" onClick={() => setMenuOpen(false)}>
                  <span className="wp-menu-image">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <span className="wp-menu-name">{item.label}</span>
                  {item.count && <span className="awaiting-mod">{item.count(state)}</span>}
                </NavLink>
                {item.sub && current && (
                  <ul className="wp-submenu">
                    {item.sub.map((s) => (
                      <li key={s.to + s.label}>
                        <NavLink to={s.to} end={s.end} className={({ isActive }) => (isActive ? 'current' : '')} onClick={() => setMenuOpen(false)}>
                          {s.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <button type="button" className="wp-menu-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />

      <div id="wpcontent">
        <div id="wpbody">
          <div className="wrap">
            <Outlet />
          </div>
        </div>
        <div id="wpfooter">
          <p>
            Thank you for creating with <a href="/">CannaBuddyHub</a>.
          </p>
          <p className="alignright">{state.updatedAt ? `Last saved ${new Date(state.updatedAt).toLocaleString()}` : 'No changes yet'}</p>
        </div>
      </div>
    </div>
  )
}
