import { useSyncExternalStore } from 'react'
import { rememberLogin, supabase } from '../lib/supabase'
import { startAdminData, stopAdminData } from '../store/siteStore'

// Dashboard sign-in through Supabase Auth. Only accounts listed in the `admins` table can
// change anything — the database checks that on every write (see supabase/schema.sql).
const listeners = new Set()
// undefined = still checking, null = signed out, object = signed-in admin
let session

function set(next) {
  session = next
  if (next) startAdminData()
  else stopAdminData()
  listeners.forEach((l) => l())
}

async function adminFor(authSession) {
  if (!authSession) return null
  const { data } = await supabase.from('admins').select('username').eq('user_id', authSession.user.id).maybeSingle()
  return data ? { username: data.username, email: authSession.user.email, userId: authSession.user.id } : null
}

supabase.auth.getSession().then(async ({ data }) => set(await adminFor(data.session)))
supabase.auth.onAuthStateChange((event, authSession) => {
  if (event === 'SIGNED_OUT') set(null)
  // leave the Supabase callback before querying (calling it inside can deadlock the client)
  else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') setTimeout(async () => set(await adminFor(authSession)), 0)
})

// Accepts either the username or the email address, like WordPress does.
// Resolves to '' on success, or an error message.
export async function signIn(login, password, remember = false) {
  const id = login.trim()
  if (!id) return 'Please enter your username.'
  let email = id
  if (!id.includes('@')) {
    const { data, error } = await supabase.rpc('admin_login_email', { p_username: id })
    if (error) return 'Could not reach the server. Check your internet connection and try again.'
    if (!data) return 'The username or password you entered is incorrect.'
    email = data
  }
  rememberLogin(remember)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return /fetch|network/i.test(error.message) ? 'Could not reach the server. Check your internet connection and try again.' : 'The username or password you entered is incorrect.'
  const admin = await adminFor(data.session)
  if (!admin) {
    await supabase.auth.signOut()
    return 'This account is not allowed to manage the site.'
  }
  set(admin)
  return ''
}

export function signOut() {
  supabase.auth.signOut()
  set(null)
}

/** Checks the current password, then changes username and/or password. Resolves to '' or an error. */
export async function updateAccount({ current, username, password }) {
  if (!session) return 'Please log in again.'
  const check = await supabase.auth.signInWithPassword({ email: session.email, password: current })
  if (check.error) return 'That is not your current password.'
  if (username && username !== session.username) {
    const { error } = await supabase.from('admins').update({ username }).eq('user_id', session.userId)
    if (error) return /duplicate|unique/i.test(error.message) ? 'That username is already taken.' : error.message
  }
  if (password) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return error.message
  }
  set({ ...session, username: username || session.username })
  return ''
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
