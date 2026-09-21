import { useState } from 'react'
import { signIn } from '../auth'

// Modelled on the WordPress login screen (wp-login.php)
export default function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const problem = await signIn(login, password, remember)
    setBusy(false)
    if (problem) setError(problem)
  }

  return (
    <div className="wp-login">
      <h1 className="wp-login__logo">
        <a href="/">
          <img src="/assets/brand/logo.svg" alt="CannaBuddyHub" width="64" height="58" />
          <span>CannaBuddyHub</span>
        </a>
      </h1>

      {error && (
        <div className="notice notice-error login-message">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      <form className="wp-login__form" onSubmit={submit}>
        <p>
          <label htmlFor="user_login">Username or Email Address</label>
          <input id="user_login" className="input" type="text" autoComplete="username" autoCapitalize="off" value={login} onChange={(e) => setLogin(e.target.value)} />
        </p>
        <p>
          <label htmlFor="user_pass">Password</label>
          <input id="user_pass" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </p>
        <p className="forgetmenot">
          <input id="rememberme" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <label htmlFor="rememberme">Remember Me</label>
        </p>
        <p className="submit">
          <button type="submit" className="button button-primary button-large" disabled={busy}>
            {busy ? 'Logging in…' : 'Log In'}
          </button>
        </p>
      </form>

      <p className="wp-login__nav">
        <a href="/">← Go to CannaBuddyHub</a>
      </p>
    </div>
  )
}
