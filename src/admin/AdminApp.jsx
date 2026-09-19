import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './admin.css'
import { useSession } from './auth'
import Layout from './components/Layout'
import { ToastProvider } from './components/ui'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Products from './pages/Products'
import ProductEditor from './pages/ProductEditor'
import Slides from './pages/Slides'
import Brands from './pages/Brands'
import Announcement from './pages/Announcement'
import Subscribers from './pages/Subscribers'
import Settings from './pages/Settings'

export default function AdminApp() {
  const session = useSession()

  useEffect(() => {
    document.body.classList.add('adm-body')
    const prevTitle = document.title
    document.title = 'Admin · CannaBuddy'
    return () => {
      document.body.classList.remove('adm-body')
      document.title = prevTitle
    }
  }, [])

  return (
    <ToastProvider>
      {session ? (
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductEditor />} />
            <Route path="products/:id" element={<ProductEditor />} />
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
    </ToastProvider>
  )
}
