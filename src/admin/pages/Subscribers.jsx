import { useState } from 'react'
import { setState, useSiteState } from '../../store/siteStore'
import { Button, ConfirmDialog, EmptyState, IconButton, PageHeader, useSave } from '../components/ui'
import Icon from '../components/Icon'
import { downloadFile, formatDate } from '../format'

export default function Subscribers() {
  const subscribers = useSiteState((s) => s.subscribers)
  const save = useSave()
  const [query, setQuery] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const shown = subscribers.filter((s) => s.email.toLowerCase().includes(query.trim().toLowerCase()))

  const exportCsv = () => {
    const rows = [['email', 'subscribed_at'], ...subscribers.map((s) => [s.email, s.at])]
    downloadFile('cannabuddy-subscribers.csv', rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv')
  }

  return (
    <>
      <PageHeader
        title="Subscribers"
        description="People who signed up with the newsletter form in the footer."
        actions={
          <Button icon="download" onClick={exportCsv} disabled={!subscribers.length}>
            Export CSV
          </Button>
        }
      />
      {subscribers.length ? (
        <>
          <div className="adm-toolbar">
            <label className="adm-search">
              <Icon name="search" size={16} />
              <input type="search" placeholder="Search emails…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search subscribers" />
            </label>
          </div>
          <div className="adm-card">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed</th>
                  <th className="actions">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((s) => (
                  <tr key={s.email}>
                    <td>
                      <a href={`mailto:${s.email}`}>{s.email}</a>
                    </td>
                    <td data-label="Subscribed">{formatDate(s.at)}</td>
                    <td className="actions">
<div className="adm-rowactions">
                      <IconButton icon="trash" variant="danger" label={`Remove ${s.email}`} onClick={() => setToDelete(s)} />
</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="adm-card">
          <EmptyState icon="mail" title="No subscribers yet">
            Sign-ups from the storefront’s footer form will appear here.
          </EmptyState>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Remove subscriber?"
        message={toDelete && `${toDelete.email} will be removed from the list.`}
        confirmLabel="Remove"
        onConfirm={() => save(setState((st) => ({ ...st, subscribers: st.subscribers.filter((x) => x.email !== toDelete.email) })), 'Subscriber removed')}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
