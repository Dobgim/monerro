import { createClient } from '@supabase/supabase-js'

// The live database. URL and public (anon) key come from .env; what the key may do is
// decided by row-level security in supabase/schema.sql.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// "Remember Me" on the admin login: remembered sessions live in localStorage,
// the rest in sessionStorage so they end when the browser closes.
const REMEMBER = 'cannabuddy-admin-remember'
const safe = (fn, fallback = null) => {
  try {
    return fn()
  } catch {
    return fallback
  }
}
export const rememberLogin = (on) => safe(() => (on ? localStorage.setItem(REMEMBER, '1') : localStorage.removeItem(REMEMBER)))
const sessionStore = {
  getItem: (k) => safe(() => localStorage.getItem(k) ?? sessionStorage.getItem(k)),
  setItem: (k, v) =>
    safe(() => {
      const remember = localStorage.getItem(REMEMBER) === '1'
      ;(remember ? localStorage : sessionStorage).setItem(k, v)
      ;(remember ? sessionStorage : localStorage).removeItem(k)
    }),
  removeItem: (k) =>
    safe(() => {
      localStorage.removeItem(k)
      sessionStorage.removeItem(k)
    }),
}

export const supabase = createClient(url, anonKey, {
  auth: { storage: sessionStore, persistSession: true, autoRefreshToken: true, storageKey: 'cannabuddy-admin-auth' },
})

export const MEDIA_BUCKET = 'media'

/** Short, human-readable message for a Supabase error. */
export function errorText(error) {
  if (!error) return ''
  const msg = error.message || String(error)
  if (/fetch|network|Failed to fetch|timeout/i.test(msg)) return 'no internet connection'
  if (/row-level security|permission denied|JWT/i.test(msg)) return 'you are signed out — please log in again'
  return msg
}
