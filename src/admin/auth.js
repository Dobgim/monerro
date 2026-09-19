import { useSyncExternalStore } from 'react'
import { getState } from '../store/siteStore'

// Client-side sign-in for the demo dashboard. There is no server, so this keeps casual
// visitors out of /admin but is NOT real security — anyone can read or clear localStorage.
const SESSION_KEY = 'cannabuddy-admin-session'
const listeners = new Set()

export async function sha256(text) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function readSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export async function signIn(email, password) {
  const { admin } = getState()
  const ok = email.trim().toLowerCase() === admin.email.toLowerCase() && (await sha256(password)) === admin.passwordHash
  if (ok) {
    try {
      sessionStorage.setItem(SESSION_KEY, admin.email)
    } catch {
      // session storage blocked — stays signed in until reload
    }
    session = admin.email
    listeners.forEach((l) => l())
  }
  return ok
}

export function signOut() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
  session = null
  listeners.forEach((l) => l())
}

let session = readSession()

export function useSession() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => session,
  )
}
