import { useRef, useState } from 'react'
import { getState, importState, resetState, setState, useSiteState } from '../../store/siteStore'
import { updateAccount, useSession } from '../auth'
import { Button, ConfirmDialog, FormRow, FormTable, PageHeader, Postbox, useNotice, useSave } from '../components/ui'
import { downloadFile } from '../format'
import { PAYMENT_METHODS } from '../../lib/payments'

function AccountSection() {
  const user = useSession()
  const notice = useNotice()
  const [username, setUsername] = useState(user.username)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!current) errs.current = 'Enter your current password to confirm the change.'
    if (!/^[A-Za-z0-9._-]{3,40}$/.test(username.trim())) errs.username = 'Use 3–40 letters, numbers, dots, dashes or underscores.'
    if (next && next.length < 8) errs.next = 'Use at least 8 characters.'
    if (next !== confirm) errs.confirm = 'The two passwords don’t match.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    const problem = await updateAccount({ current, username: username.trim(), password: next })
    setBusy(false)
    if (problem) {
      setErrors(problem.includes('current password') ? { current: problem } : problem.includes('username') ? { username: problem } : { next: problem })
      return
    }
    notice(next ? 'Profile updated. Use your new password next time you log in.' : 'Profile updated.')
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <form onSubmit={submit} noValidate>
      <h2>Your login</h2>
      <FormTable>
        <FormRow label="Username" description="You can log in with this or your email address.">
          <input type="text" className="regular-text" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="off" />
          {errors.username && <p className="field-error">{errors.username}</p>}
        </FormRow>
        <FormRow label="Email">
          <input type="email" className="regular-text" value={user.email} readOnly disabled />
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
        <Button variant="primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Update Profile'}
        </Button>
      </p>
    </form>
  )
}

function ContactSection() {
  const contact = useSiteState((s) => s.contact)
  const save = useSave()
  const [phone, setPhone] = useState(contact.phone)
  const [whatsapp, setWhatsapp] = useState(contact.whatsapp || '')
  const [error, setError] = useState('')
  const waDigits = whatsapp.replace(/\D/g, '')
  const dirty = phone.trim() !== contact.phone || waDigits !== (contact.whatsapp || '')

  const submit = (e) => {
    e.preventDefault()
    if (waDigits.length < 8) {
      setError('Enter the full WhatsApp number with the country code, for example 1 510 394 2813.')
      return
    }
    setError('')
    const digits = phone.replace(/[^\d+]/g, '')
    save(
      setState((s) => ({
        ...s,
        contact: { ...s.contact, phone: phone.trim(), phoneHref: `tel:${digits.startsWith('+') ? digits : `+1${digits}`}`, whatsapp: waDigits },
      })),
      'Contact details saved.',
    )
  }

  return (
    <form onSubmit={submit}>
      <h2>Contact details</h2>
      <FormTable>
        <FormRow label="Customer support phone" description="Shown in the footer of every page. Shoppers on a phone can tap it to call.">
          <input type="tel" className="regular-text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(510) 394-2813" />
        </FormRow>
        <FormRow
          label="WhatsApp number for orders"
          description="When a shopper clicks “Proceed to checkout”, WhatsApp opens a chat to this number with their order already typed. Include the country code (1 for the USA)."
        >
          <input type="tel" className="regular-text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="1 510 394 2813" />
          {error && <p className="field-error">{error}</p>}
          {waDigits.length >= 8 && (
            <p className="description">
              <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer">
                Test this number in WhatsApp
              </a>
            </p>
          )}
        </FormRow>
      </FormTable>
      <p className="submit">
        <Button variant="primary" type="submit" disabled={!dirty}>
          Save contact details
        </Button>
      </p>
    </form>
  )
}

function PaymentsSection() {
  const saved = useSiteState((s) => s.payments)
  const save = useSave()
  const [draft, setDraft] = useState(saved)
  const [error, setError] = useState('')
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const update = (id, patch) => setDraft((d) => ({ ...d, [id]: { ...d[id], ...patch } }))

  const submit = (e) => {
    e.preventDefault()
    if (!PAYMENT_METHODS.some((m) => draft[m.id]?.enabled)) {
      setError('Turn on at least one payment method, or customers can’t check out.')
      return
    }
    setError('')
    const cleaned = Object.fromEntries(Object.entries(draft).map(([id, v]) => [id, { ...v, account: (v.account || '').trim() }]))
    save(setState((s) => ({ ...s, payments: cleaned })), 'Payment methods saved.')
  }

  return (
    <form onSubmit={submit}>
      <h2>Payment methods</h2>
      <p className="description">
        Customers pick one of these at checkout, then send their order to your WhatsApp. Enter where each payment should go — it is shown on the
        checkout page and in the WhatsApp message. If you leave one empty, the customer is asked to wait for you to send your details.
      </p>
      <FormTable>
        {PAYMENT_METHODS.map((m) => (
          <FormRow key={m.id} label={m.label}>
            <label className="checkbox-label">
              <input type="checkbox" checked={draft[m.id]?.enabled !== false} onChange={(e) => update(m.id, { enabled: e.target.checked })} />
              Accept {m.label}
            </label>
            {draft[m.id]?.enabled !== false && (
              <p>
                <input
                  type="text"
                  className="regular-text"
                  aria-label={m.accountLabel}
                  placeholder={m.placeholder}
                  value={draft[m.id]?.account || ''}
                  onChange={(e) => update(m.id, { account: e.target.value })}
                />
                <span className="description" style={{ display: 'block', marginTop: 4 }}>
                  {m.accountLabel}
                </span>
              </p>
            )}
          </FormRow>
        ))}
      </FormTable>
      {error && <p className="field-error">{error}</p>}
      <p className="submit">
        <Button variant="primary" type="submit" disabled={!dirty}>
          Save payment methods
        </Button>
      </p>
    </form>
  )
}

function LocationsSection() {
  const saved = useSiteState((s) => s.locations)
  const save = useSave()
  const [draft, setDraft] = useState(saved)
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const update = (i, patch) => setDraft((d) => d.map((l, j) => (j === i ? { ...l, ...patch } : l)))

  const submit = (e) => {
    e.preventDefault()
    const cleaned = draft
      .filter((l) => l.name.trim() && l.address.trim())
      .map((l) => ({ ...l, name: l.name.trim(), address: l.address.trim(), hours: l.hours.trim(), id: l.id || l.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') }))
    if (save(setState((s) => ({ ...s, locations: cleaned })), 'Store locations saved.')) setDraft(cleaned)
  }

  return (
    <form onSubmit={submit}>
      <h2>Store locations</h2>
      <p className="description">Shown on the Locations page and in the footer. Remove them all if you only sell online.</p>
      {draft.map((loc, i) => (
        <div className="postbox" key={loc.id || i}>
          <div className="postbox-header">
            <h2>{loc.name || 'New location'}</h2>
            <button type="button" className="button-link submitdelete" style={{ marginRight: 12 }} onClick={() => setDraft((d) => d.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
          <div className="inside">
            <FormTable>
              <FormRow label="Name" description="For example the city or neighbourhood.">
                <input type="text" className="regular-text" value={loc.name} onChange={(e) => update(i, { name: e.target.value })} />
              </FormRow>
              <FormRow label="Address" description="One line per row, as it should appear.">
                <textarea rows={3} className="regular-text" value={loc.address} onChange={(e) => update(i, { address: e.target.value })} />
              </FormRow>
              <FormRow label="Opening hours">
                <input type="text" className="large-text" value={loc.hours} onChange={(e) => update(i, { hours: e.target.value })} />
              </FormRow>
            </FormTable>
          </div>
        </div>
      ))}
      <p className="submit">
        <Button onClick={() => setDraft((d) => [...d, { id: '', name: '', address: '', hours: '' }])}>Add a location</Button>
        <Button variant="primary" type="submit" disabled={!dirty}>
          Save locations
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
  const [restoring, setRestoring] = useState(false)

  const exportJson = () => {
    const { subscribers: _s, cartEvents: _c, orders: _o, media: _m, ...data } = getState()
    downloadFile(`cannabuddyhub-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), 'application/json')
  }

  const importJson = async (f) => {
    if (!f) return
    try {
      const data = JSON.parse(await f.text())
      if (!Array.isArray(data.products) || !Array.isArray(data.slides) || !Array.isArray(data.brands)) throw new Error('shape')
      const { admin: _ignored, ...rest } = data
      setRestoring(true)
      save(await importState(rest), 'Backup restored to the live site.')
    } catch (e) {
      notice(e.message === 'shape' || e instanceof SyntaxError ? 'That file is not a CannaBuddyHub backup.' : `The backup could not be restored — ${e.message}.`, 'error')
    } finally {
      setRestoring(false)
      file.current.value = ''
    }
  }

  return (
    <>
      <PageHeader title="Settings" />
      <ContactSection />
      <PaymentsSection />
      <LocationsSection />
      <AccountSection />

      <Postbox title="Backup">
        <p className="description">
          Everything you change is saved to the live site straight away, from any computer or phone. Download a backup now and then to keep your own copy.
        </p>
        <p>
          <Button onClick={exportJson}>Download backup</Button> <Button onClick={() => file.current.click()} disabled={restoring}>
            {restoring ? 'Restoring…' : 'Restore from backup'}
          </Button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => importJson(e.target.files[0])} />
        </p>
      </Postbox>

      <Postbox title="Start over">
        <p className="description">Put every product, slide, brand and the announcement back the way the site was delivered. Sign-ups and cart activity are cleared too. Orders and uploaded photos are kept.</p>
        <p>
          <button type="button" className="button button-delete" onClick={() => setConfirmReset(true)}>
            Reset everything
          </button>
        </p>
      </Postbox>

      <ConfirmDialog
        open={confirmReset}
        title="Reset everything"
        message="This changes the live site for every visitor and cannot be undone unless you downloaded a backup first. Your login stays the same."
        confirmLabel="Reset everything"
        onConfirm={async () => {
          const problem = await resetState()
          notice(problem ? `Reset did not finish — ${problem}. Please try again.` : 'Everything has been reset to the original site content.', problem ? 'error' : 'success')
        }}
        onClose={() => setConfirmReset(false)}
      />
    </>
  )
}
