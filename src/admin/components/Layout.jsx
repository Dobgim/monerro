import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { discardLegacyLocalChanges, importState, legacyLocalChanges, useLoadStatus, useSiteState, useSyncStatus } from '../../store/siteStore'
import { signOut, useSession } from '../auth'
import Icon from './Icon'
import { Button, useSave } from './ui'

// Menu order mirrors WordPress: Dashboard first, then the content the client edits.
const MENU = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'products', count: (s) => s.products.length, sub: [{ to: '/admin/products', label: 'All Products', end: true }, { to: '/admin/products/new', label: 'Add New' }] },
  { to: '/admin/orders', label: 'Orders', icon: 'cart', count: (s) => s.orders.filter((o) => o.status === 'new').length },
  { to: '/admin/slides', label: 'Hero Slides', icon: 'slides', count: (s) => s.slides.length },
  { to: '/admin/brands', label: 'Brands', icon: 'brands', count: (s) => s.brands.length },
  { to: '/admin/announcement', label: 'Announcement', icon: 'megaphone' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: 'mail', count: (s) => s.subscribers.length },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
]

// "Saving…" / "All changes saved" in the admin bar, so it's clear when an edit is live
function SyncIndicator() {
  const { pending, error } = useSyncStatus()
  const { error: loadError } = useLoadStatus()
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  const [text, tone] = !online
    ? ['Offline — changes won’t save', 'is-error']
    : pending
      ? ['Saving…', 'is-busy']
      : error || loadError
        ? ['Not saved — try again', 'is-error']
        : ['All changes saved', 'is-ok']
  return (
    <span className={`ab-item cb-sync ${tone}`} role="status">
      <span className="cb-sync__dot" aria-hidden="true" />
      {text}
    </span>
  )
}

// Edits made on this device before the site was connected to the live database
function LegacyChangesNotice() {
  const [legacy, setLegacy] = useState(legacyLocalChanges)
  const [busy, setBusy] = useState(false)
  const save = useSave()
  if (!legacy) return null
  const publish = async () => {
    setBusy(true)
    try {
      if (save(await importState(legacy), 'Your earlier changes are now on the live site.')) {
        discardLegacyLocalChanges()
        setLegacy(null)
      }
    } catch (e) {
      save(false, e.message)
    }
    setBusy(false)
  }
  return (
    <div className="notice notice-warning">
      <p>
        <strong>This device has changes you made before the site went live</strong> (last edited {new Date(legacy.updatedAt).toLocaleString()}). Publish them to the live site, or discard them to keep what is live now.
      </p>
      <p>
        <Button variant="primary" onClick={publish} disabled={busy}>
          {busy ? 'Publishing…' : 'Publish these changes'}
        </Button>{' '}
        <Button
          disabled={busy}
          onClick={() => {
            discardLegacyLocalChanges()
            setLegacy(null)
          }}
        >
          Discard
        </Button>
      </p>
    </div>
  )
}

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
          <li>
            <SyncIndicator />
          </li>
          <li className="menupop hide-on-phone">
            <span className="ab-item">
              Howdy, <strong>{user.username}</strong>
              <span className="avatar" aria-hidden="true">
                {user.username?.[0]?.toUpperCase()}
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
            <LegacyChangesNotice />
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
