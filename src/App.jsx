import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import TopLink from './components/common/TopLink'
import { internalPath } from './lib/links'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import ComingSoonPage from './pages/ComingSoonPage'

// Every link on the site (menus, product cards, footer, banners) is plain markup copied from
// the original theme. This turns clicks on links to our own pages into instant in-app
// navigation instead of full page reloads.
function useInAppLinks() {
  const navigate = useNavigate()
  return (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const link = e.target.closest?.('a[href]')
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return
    const path = internalPath(link.getAttribute('href'))
    if (path === null) return
    e.preventDefault()
    navigate(path)
  }
}

// The header and menu search boxes are plain GET forms; send them to the shop's results instead.
function useInAppSearch() {
  const navigate = useNavigate()
  return (e) => {
    const form = e.target
    const input = form.querySelector?.('input[name="s"]')
    if (!input) return
    e.preventDefault()
    navigate(`/shop/?s=${encodeURIComponent(input.value.trim())}`)
  }
}

export default function App() {
  const { pathname } = useLocation()
  const onClick = useInAppLinks()
  const onSubmit = useInAppSearch()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div onClick={onClick} onSubmit={onSubmit}>
      <div className="l-canvas type_wide">
        {/* keyed on the path so open menus close after navigating */}
        <Header key={pathname} />
        <main id="page-content" className="l-main">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="*" element={<ComingSoonPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <TopLink />
    </div>
  )
}
