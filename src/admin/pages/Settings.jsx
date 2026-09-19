import { useRef, useState } from 'react'
import { getState, importState, resetState, setState, useSiteState } from '../../store/siteStore'
import { sha256 } from '../auth'
import { Button, Card, ConfirmDialog, PageHeader, TextInput, useSave, useToast } from '../components/ui'
import { downloadFile } from '../format'

function AccountCard() {
  const admin = useSiteState((s) => s.admin)
  const save = useSave()
  const [email, setEmail] = useState(admin.email)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if ((await sha256(current)) !== admin.passwordHash) errs.current = 'Current password is incorrect.'
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email.'
    if (next && next.length < 8) errs.next = 'Use at least 8 characters.'
    if (next !== confirm) errs.confirm = 'Passwords don’t match.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const passwordHash = next ? await sha256(next) : admin.passwordHash
    if (save(setState((s) => ({ ...s, admin: { email: email.trim(), passwordHash } })), 'Sign-in details updated')) {
      setCurrent('')
      setNext('')
      setConfirm('')
    }
  }

  return (
    <Card title="Sign-in details">
      <form onSubmit={submit} noValidate>
        <TextInput label="Admin email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="username" />
        <div className="adm-row">
          <TextInput label="New password" type="password" value={next} onChange={(e) => setNext(e.target.value)} error={errors.next} hint="Leave empty to keep the current one." autoComplete="new-password" />
          <TextInput label="Confirm new password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} autoComplete="new-password" />
        </div>
        <TextInput label="Current password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} error={errors.current} autoComplete="current-password" required />
        <div className="adm-formactions">
          <Button variant="primary" type="submit" icon="check">
            Update sign-in
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default function Settings() {
  const toast = useToast()
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
      save(importState({ ...rest, admin: getState().admin }), 'Backup restored')
    } catch {
      toast('That file isn’t a CannaBuddy backup.', 'error')
    } finally {
      file.current.value = ''
    }
  }

  return (
    <>
      <PageHeader title="Settings" />
      <div className="adm-settings">
        <AccountCard />
        <Card title="Backup & restore">
          <p className="adm-muted">
            Changes are saved in this browser. Download a backup to move them to another computer, or to keep a copy.
          </p>
          <div className="adm-formactions adm-formactions--start">
            <Button icon="download" onClick={exportJson}>
              Download backup
            </Button>
            <Button icon="upload" onClick={() => file.current.click()}>
              Restore from backup
            </Button>
            <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => importJson(e.target.files[0])} />
          </div>
        </Card>
        <Card title="Reset content">
          <div className="adm-danger">
            <p>Put every product, slide, brand and the announcement back to the original site content. Subscribers and cart activity are cleared too.</p>
            <Button variant="danger" onClick={() => setConfirmReset(true)}>
              Reset to original
            </Button>
          </div>
        </Card>
      </div>
      <ConfirmDialog
        open={confirmReset}
        title="Reset all content?"
        message="This can’t be undone unless you downloaded a backup. Your sign-in details are reset to the defaults as well."
        confirmLabel="Reset everything"
        onConfirm={() => {
          resetState()
          toast('Content reset to the original site')
        }}
        onClose={() => setConfirmReset(false)}
      />
    </>
  )
}
