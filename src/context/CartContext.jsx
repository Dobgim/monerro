import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { logCartEvent } from '../store/siteStore'

const CartContext = createContext(null)
const STORAGE_KEY = 'cannabuddy-cart'

// Each cart line is one product + one purchase option (one-time or a subscription plan),
// so the same product can be in the cart both ways.
const lineKey = (id, plan) => `${id}|${plan ? plan.interval : 'once'}`

function loadCart() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    return items.map((i) => ({ plan: null, ...i, key: i.key || lineKey(i.id, i.plan) }))
  } catch {
    return []
  }
}

// Client-side cart: keeps line items, persists them per browser, and drives the
// header cart badge + "added to your cart" notification.
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

  const addToCart = useCallback((product, qty = 1, plan = null) => {
    const key = lineKey(product.id, plan)
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { key, id: product.id, name: product.name, qty, plan }]
    })
    logCartEvent(product)
    setLastAdded(product.name)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setLastAdded(null), 3000)
  }, [])

  const setQty = useCallback((key, qty) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))))
  }, [])
  const removeItem = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), [])

  const count = items.reduce((n, i) => n + i.qty, 0)

  return <CartContext.Provider value={{ items, count, addToCart, setQty, removeItem, lastAdded }}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
