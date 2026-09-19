import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSiteState } from '../../store/siteStore'
import { signOut, useSession } from '../auth'
import Icon from './Icon'

const NAV = [
  { to: '/admin', label: 'Overview', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'products', count: (s) => s.products.length },
  { to: '/admin/slides', label: 'Hero slides', icon: 'slides', count: (s) => s.slides.length },
  { to: '/admin/brands', label: 'Brands', icon: 'brands', count: (s) => s.brands.length },
  { to: '/admin/announcement', label: 'Announcement', icon: 'megaphone' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: 'mail', count: (s) => s.subscribers.length },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
]

export default function Layout() {
  const state = useSiteState()
  const email = useSession()
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className={`adm-shell${navOpen ? ' nav-open' : ''}`}>
      <aside className="adm-sidebar" aria-label="Admin navigation">
        <div className="adm-brand">
          <img src="/assets/images/2025/10/CannaBuddy-Logomark.svg" alt="" width="34" height="31" />
          <div>
            <strong>CannaBuddy</strong>
            <span>Store admin</span>
          </div>
        </div>
        <nav>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `adm-navlink${isActive ? ' is-active' : ''}`} onClick={() => setNavOpen(false)}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.count && <em>{item.count(state)}</em>}
            </NavLink>
          ))}
        </nav>
        <div className="adm-sidebar__foot">
          <a className="adm-navlink" href="/" target="_blank" rel="noreferrer">
            <Icon name="external" />
            <span>View storefront</span>
          </a>
          <button type="button" className="adm-navlink" onClick={signOut}>
            <Icon name="logout" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <button type="button" className="adm-scrim" aria-label="Close menu" onClick={() => setNavOpen(false)} />

      <div className="adm-main">
        <header className="adm-topbar">
          <button type="button" className="adm-iconbtn adm-iconbtn--ghost adm-topbar__menu" aria-label="Open menu" onClick={() => setNavOpen(true)}>
            <Icon name="menu" />
          </button>
          <p className="adm-topbar__saved">
            {state.updatedAt ? `Last change saved ${new Date(state.updatedAt).toLocaleString()}` : 'Showing the original site content'}
          </p>
          <div className="adm-topbar__user">
            <span className="adm-avatar" aria-hidden="true">
              {email?.[0]?.toUpperCase()}
            </span>
            <span className="adm-topbar__email">{email}</span>
          </div>
        </header>
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
