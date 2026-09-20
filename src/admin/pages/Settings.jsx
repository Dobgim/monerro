import { useRef, useState } from 'react'
import { getState, importState, resetState, setState, useSiteState } from '../../store/siteStore'
import { sha256 } from '../auth'
import { Button, ConfirmDialog, FormRow, FormTable, PageHeader, Postbox, useNotice, useSave } from '../components/ui'
import { downloadFile } from '../format'

function AccountSection() {
  const admin = useSiteState((s) => s.admin)
  const save = useSave()
  const [username, setUsername] = useState(admin.username)
  const [email, setEmail] = useState(admin.email)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if ((await sha256(current)) !== admin.passwordHash) errs.current = 'That is not your current password.'
    if (!username.trim()) errs.username = 'Please enter a username.'
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Please enter a valid email address.'
    if (next && next.length < 8) errs.next = 'Use at least 8 characters.'
    if (next !== confirm) errs.confirm = 'The two passwords don’t match.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const passwordHash = next ? await sha256(next) : admin.passwordHash
    if (save(setState((s) => ({ ...s, admin: { username: username.trim(), email: email.trim(), passwordHash } })), 'Profile updated.')) {
      setCurrent('')
      setNext('')
      setConfirm('')
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <h2>Your login</h2>
      <FormTable>
        <FormRow label="Username">
          <input type="text" className="regular-text" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          {errors.username && <p className="field-error">{errors.username}</p>}
        </FormRow>
        <FormRow label="Email">
          <input type="email" className="regular-text" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </FormRow>
        <FormRow label="New password" description="Leave empty to keep your current password.">
          <input type="password" className="regular-text" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
          {errors.next && <p className="field-error">{errors.next}</p>}
        </FormRow>
        <FormRow label="Repeat new password">
          <input type="password" className="regular-text" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          {errors.confirm && <p className="field-error">{errors.confirm}</p>}
        </FormRow>
        <FormRow label="Current password" description="Needed to confirm any change here.">
          <input type="password" className="regular-text" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
          {errors.current && <p className="field-error">{errors.current}</p>}
        </FormRow>
      </FormTable>
      <p className="submit">
        <Button variant="primary" type="submit">
          Update Profile
        </Button>
      </p>
    </form>
  )
}

function ContactSection() {
  const contact = useSiteState((s) => s.contact)
  const save = useSave()
  const [phone, setPhone] = useState(contact.phone)
  const dirty = phone.trim() !== contact.phone

  const submit = (e) => {
    e.preventDefault()
    const digits = phone.replace(/[^\d+]/g, '')
    save(
      setState((s) => ({ ...s, contact: { phone: phone.trim(), phoneHref: `tel:${digits.startsWith('+') ? digits : `+1${digits}`}` } })),
      'Phone number saved. It now shows in the footer of your site.',
    )
  }

  return (
    <form onSubmit={submit}>
      <h2>Contact details</h2>
      <FormTable>
        <FormRow label="Customer support phone" description="Shown in the footer of every page. Shoppers on a phone can tap it to call.">
          <input type="tel" className="regular-text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(510) 394-2813" />
        </FormRow>
      </FormTable>
      <p className="submit">
        <Button variant="primary" type="submit" disabled={!dirty}>
          Save phone number
        </Button>
      </p>
    </form>
  )
}

export default function Settings() {
  const notice = useNotice()
  const save = useSave()
  const file = useRef(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const exportJson = () => {
    const { admin: _admin, ...data } = getState()
    downloadFile(`cannabuddy-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), 'application/json')
  }

  const importJson = async (f) => {
    if (!f) return
    try {
      const data = JSON.parse(await f.text())
      if (!Array.isArray(data.products) || !Array.isArray(data.slides) || !Array.isArray(data.brands)) throw new Error('shape')
      const { admin: _ignored, ...rest } = data
      save(importState({ ...rest, admin: getState().admin }), 'Backup restored.')
    } catch {
      notice('That file is not a CannaBuddy backup.', 'error')
    } finally {
      file.current.value = ''
    }
  }

  return (
    <>
      <PageHeader title="Settings" />
      <ContactSection />
      <AccountSection />

      <Postbox title="Backup">
        <p className="description">
          Your changes are saved in this browser on this computer. Download a backup to keep a copy, or to move your changes to another computer.
        </p>
        <p>
          <Button onClick={exportJson}>Download backup</Button> <Button onClick={() => file.current.click()}>Restore from backup</Button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => importJson(e.target.files[0])} />
        </p>
      </Postbox>

      <Postbox title="Start over">
        <p className="description">Put every product, slide, brand and the announcement back the way the site was delivered. Sign-ups and cart activity are cleared too.</p>
        <p>
          <button type="button" className="button button-delete" onClick={() => setConfirmReset(true)}>
            Reset everything
          </button>
        </p>
      </Postbox>

      <ConfirmDialog
        open={confirmReset}
        title="Reset everything"
        message="This cannot be undone unless you downloaded a backup first. Your login goes back to the original username and password too."
        confirmLabel="Reset everything"
        onConfirm={() => {
          resetState()
          notice('Everything has been reset to the original site content.')
        }}
        onClose={() => setConfirmReset(false)}
      />
    </>
  )
}
