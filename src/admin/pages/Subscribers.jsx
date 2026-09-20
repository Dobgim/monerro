import { useState } from 'react'
import { setState, useSiteState } from '../../store/siteStore'
import { ConfirmDialog, EmptyRow, PageHeader, RowAction, SearchBox, useSave } from '../components/ui'
import { downloadFile, formatDate } from '../format'

export default function Subscribers() {
  const subscribers = useSiteState((s) => s.subscribers)
  const save = useSave()
  const [query, setQuery] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const shown = subscribers.filter((s) => s.email.toLowerCase().includes(query.trim().toLowerCase()))

  const exportCsv = () => {
    const rows = [['email', 'subscribed_at'], ...subscribers.map((s) => [s.email, s.at])]
    downloadFile('cannabuddyhub-subscribers.csv', rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv')
  }

  return (
    <>
      <PageHeader
        title="Subscribers"
        action={
          <button type="button" className="page-title-action" onClick={exportCsv} disabled={!subscribers.length}>
            Export CSV
          </button>
        }
        description="People who signed up with the newsletter form at the bottom of your site."
      />
      {subscribers.length > 0 && <SearchBox label="Search subscribers" value={query} onChange={setQuery} />}

      <table className="wp-list-table widefat fixed striped">
        <thead>
          <tr>
            <th scope="col" className="column-primary">
              Email
            </th>
            <th scope="col">Signed up</th>
          </tr>
        </thead>
        <tbody>
          {shown.length === 0 && <EmptyRow colSpan={2}>No sign-ups yet.</EmptyRow>}
          {shown.map((s) => (
            <tr key={s.email}>
              <td className="column-primary has-row-actions">
                <strong>
                  <a href={`mailto:${s.email}`} className="row-title">
                    {s.email}
                  </a>
                </strong>
                <div className="row-actions">
                  <RowAction danger onClick={() => setToDelete(s)}>
                    Remove
                  </RowAction>
                </div>
              </td>
              <td data-colname="Signed up">{formatDate(s.at)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Remove subscriber"
        message={toDelete && `${toDelete.email} will be removed from the list.`}
        confirmLabel="Remove"
        onConfirm={() => save(setState((st) => ({ ...st, subscribers: st.subscribers.filter((x) => x.email !== toDelete.email) })), 'Subscriber removed.')}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}
