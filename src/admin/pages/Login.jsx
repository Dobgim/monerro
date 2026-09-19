import { useState } from 'react'
import { signIn } from '../auth'
import { Button, TextInput } from '../components/ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const ok = await signIn(email, password)
    setBusy(false)
    if (!ok) setError('That email and password don’t match.')
  }

  return (
    <div className="adm-login">
      <form className="adm-login__card" onSubmit={submit}>
        <img src="/assets/images/2025/10/CannaBuddy-Logomark.svg" alt="" width="54" height="49" />
        <h1>CannaBuddy admin</h1>
        <p>Sign in to manage the storefront.</p>
        <TextInput label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextInput
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          required
        />
        <Button variant="primary" type="submit" disabled={busy} className="adm-btn--block">
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
        <a className="adm-login__back" href="/">
          ← Back to the store
        </a>
      </form>
    </div>
  )
}
