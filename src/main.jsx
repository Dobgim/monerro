import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Storefront and admin are separate chunks: the storefront's theme CSS
// (original.css) is only loaded with the storefront, never on /admin.
const Storefront = lazy(() => import('./Storefront.jsx'))
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

// Impreza toggles hover-only styles with html.touch / html.no-touch
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
document.documentElement.classList.toggle('touch', isTouch)
document.documentElement.classList.toggle('no-touch', !isTouch)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Storefront />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
