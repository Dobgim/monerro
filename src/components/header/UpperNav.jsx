import { useState } from 'react'

const items = [
  { id: 724650, label: 'Wholesale', href: 'https://cannabuddyhub.com/wholesale/', type: 'post_type menu-item-object-page' },
  {
    id: 724651,
    label: 'Locations',
    href: 'https://cannabuddyhub.com/locations/',
    type: 'custom menu-item-object-custom',
    children: [
      { id: 724653, label: 'Charlotte', href: 'https://cannabuddyhub.com/locations/charlotte/' },
      { id: 724652, label: 'Matthews', href: 'https://cannabuddyhub.com/locations/matthews/' },
    ],
  },
  { id: 724654, label: 'Contact Us', href: 'https://cannabuddyhub.com/contact-us/', type: 'post_type menu-item-object-page' },
  { id: 724655, label: 'My Account', href: 'https://cannabuddyhub.com/my-account/', type: 'post_type menu-item-object-page' },
]

function NavItem({ item }) {
  const [opened, setOpened] = useState(false)
  const hasChildren = Boolean(item.children)
  const cls = [
    'menu-item',
    `menu-item-type-${item.type}`,
    hasChildren && 'menu-item-has-children',
    'w-nav-item level_1',
    `menu-item-${item.id}`,
    opened && 'opened',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li id={`menu-item-${item.id}`} className={cls} onMouseLeave={() => setOpened(false)}>
      <a className="w-nav-anchor level_1" href={item.href}>
        <span className="w-nav-title">{item.label}</span>
        {hasChildren && <span className="w-nav-arrow" aria-hidden="true" />}
      </a>
      {hasChildren && (
        <>
          <button
            type="button"
            className="w-nav-item-toggle"
            aria-expanded={opened}
            aria-controls={`w-nav-sublist-${item.id}`}
            aria-label={`${item.label} Menu`}
            onClick={() => setOpened((o) => !o)}
          />
          <ul id={`w-nav-sublist-${item.id}`} className="w-nav-list level_2">
            {item.children.map((child) => (
              <li
                key={child.id}
                id={`menu-item-${child.id}`}
                className={`menu-item menu-item-type-post_type menu-item-object-wpseo_locations w-nav-item level_2 menu-item-${child.id}`}
              >
                <a className="w-nav-anchor level_2" href={child.href}>
                  <span className="w-nav-title">{child.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </li>
  )
}

// "Wholesale / Locations / Contact Us / My Account" row in the middle header (desktop only)
export default function UpperNav() {
  return (
    <nav
      className="w-nav type_desktop hidden_for_mobiles ush_menu_1 cb-upper-nav height_full show_main_arrows open_on_hover dropdown_opacity m_align_none m_layout_dropdown dropdown_shadow_wide m_shadow_thin"
      style={{
        '--sub-item-hor-indent': '20px',
        '--sub-item-ver-indent': '0.6em',
        '--dropdown-font-size': '1rem',
        '--mobile-font-size': '1.1rem',
        '--mobile-dropdown-font-size': '0.9rem',
      }}
    >
      <ul className="w-nav-list level_1 hide_for_mobiles hover_simple">
        {items.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  )
}
