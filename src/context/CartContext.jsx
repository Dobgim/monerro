import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { logCartEvent } from '../store/siteStore'

const CartContext = createContext(null)
const STORAGE_KEY = 'cannabuddy-cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

// Client-side stand-in for WooCommerce's AJAX add-to-cart: keeps line items,
// persists them per browser, and drives the header cart badge + notification.
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [lastAdded, setLastAdded] = useState(null)
  const timer = useRef()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable (private mode) — cart still works for this visit
    }
  }, [items])

  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { id: product.id, name: product.name, qty: 1 }]
    })
    logCartEvent(product)
    setLastAdded(product.name)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setLastAdded(null), 3000)
  }, [])

  const count = items.reduce((n, i) => n + i.qty, 0)

  return <CartContext.Provider value={{ items, count, addToCart, lastAdded }}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
