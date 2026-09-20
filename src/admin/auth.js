import { useSyncExternalStore } from 'react'
import { getState } from '../store/siteStore'

// Sign-in for the dashboard. There is no server, so this keeps casual visitors out of
// /admin but is NOT real security — anyone can read or clear browser storage.
const SESSION_KEY = 'cannabuddy-admin-session'
const listeners = new Set()

export async function sha256(text) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function readSession() {
  try {
    return localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

let session = readSession()

function announce() {
  listeners.forEach((l) => l())
}

// Accepts either the username or the email address, like WordPress does.
export async function signIn(login, password, remember = false) {
  const { admin } = getState()
  const id = login.trim().toLowerCase()
  const known = id === admin.username.toLowerCase() || id === admin.email.toLowerCase()
  if (!known || (await sha256(password)) !== admin.passwordHash) return false
  try {
    ;(remember ? localStorage : sessionStorage).setItem(SESSION_KEY, admin.username)
  } catch {
    // storage blocked — stays signed in until reload
  }
  session = admin.username
  announce()
  return true
}

export function signOut() {
  try {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
  session = null
  announce()
}

export function useSession() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => session,
  )
}
