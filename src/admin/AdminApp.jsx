import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './admin.css'
import { useSession } from './auth'
import Layout from './components/Layout'
import { NoticeProvider } from './components/ui'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Products from './pages/Products'
import ProductEditor from './pages/ProductEditor'
import Slides from './pages/Slides'
import Brands from './pages/Brands'
import Announcement from './pages/Announcement'
import Subscribers from './pages/Subscribers'
import Orders from './pages/Orders'
import Settings from './pages/Settings'

export default function AdminApp() {
  const session = useSession()

  useEffect(() => {
    document.body.classList.add('adm-body')
    const prevTitle = document.title
    document.title = 'Dashboard ‹ CannaBuddyHub — Admin'
    return () => {
      document.body.classList.remove('adm-body')
      document.title = prevTitle
    }
  }, [])

  return (
    <NoticeProvider>
      {session === undefined ? (
        <div className="wp-login">
          <p className="wp-login__loading">Loading…</p>
        </div>
      ) : session ? (
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductEditor />} />
            <Route path="products/:id" element={<ProductEditor />} />
            <Route path="orders" element={<Orders />} />
            <Route path="slides" element={<Slides />} />
            <Route path="brands" element={<Brands />} />
            <Route path="announcement" element={<Announcement />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      ) : (
        <Login />
      )}
    </NoticeProvider>
  )
}
