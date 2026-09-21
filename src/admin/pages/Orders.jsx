import { useState } from 'react'
import { fetchAdminData, useSiteState } from '../../store/siteStore'
import { errorText, supabase } from '../../lib/supabase'
import { money, whatsappUrl } from '../../lib/whatsapp'
import { ConfirmDialog, EmptyRow, PageHeader, RowAction, SearchBox, useNotice } from '../components/ui'
import { downloadFile, formatDate } from '../format'

const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'paid', label: 'Paid' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]
const statusLabel = (v) => STATUSES.find((s) => s.value === v)?.label || v
const time = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

// Orders placed on the checkout page. Payment itself is arranged on WhatsApp;
// this list lets the shop keep track of them and mark them paid / completed.
export default function Orders() {
  const orders = useSiteState((s) => s.orders)
  const notice = useNotice()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const q = query.trim().toLowerCase()
  const shown = orders.filter(
    (o) =>
      (filter === 'all' || o.status === filter) &&
      (!q || [o.id, o.customer?.name, o.customer?.phone, o.payment, ...(o.items || []).map((i) => i.name)].join(' ').toLowerCase().includes(q)),
  )

  const setStatus = async (order, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', order.id)
    fetchAdminData()
    notice(error ? `Not saved — ${errorText(error)}.` : `Order #${order.id} marked ${statusLabel(status).toLowerCase()}.`, error ? 'error' : 'success')
  }
  const del = async (order) => {
    const { error } = await supabase.from('orders').delete().eq('id', order.id)
    fetchAdminData()
    notice(error ? `Not deleted — ${errorText(error)}.` : `Order #${order.id} deleted.`, error ? 'error' : 'success')
  }

  const exportCsv = () => {
    const rows = [
      ['order', 'date', 'status', 'name', 'phone', 'fulfilment', 'address', 'payment', 'items', 'total'],
      ...orders.map((o) => [
        o.id,
        o.created_at,
        o.status,
        o.customer?.name,
        o.customer?.phone,
        o.customer?.fulfilment,
        o.customer?.address,
        o.payment,
        (o.items || []).map((i) => `${i.qty} x ${i.name}${i.plan && !/one-time/i.test(i.plan) ? ` (${i.plan})` : ''}`).join('; '),
        o.total,
      ]),
    ]
    downloadFile('cannabuddyhub-orders.csv', rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv')
  }

  const counts = Object.fromEntries(STATUSES.map((s) => [s.value, orders.filter((o) => o.status === s.value).length]))

  return (
    <>
      <PageHeader
        title="Orders"
        action={
          <button type="button" className="page-title-action" onClick={exportCsv} disabled={!orders.length}>
            Export CSV
          </button>
        }
        description="Orders sent from the checkout page. The customer also messages you on WhatsApp to pay — mark each order Paid and then Completed here."
      />
      <ul className="subsubsub">
        {[{ value: 'all', label: 'All' }, ...STATUSES].map((s, i) => (
          <li key={s.value}>
            {i > 0 && ' | '}
            <button type="button" className={`button-link${filter === s.value ? ' current' : ''}`} onClick={() => setFilter(s.value)}>
              {s.label} <span className="count">({s.value === 'all' ? orders.length : counts[s.value]})</span>
            </button>
          </li>
        ))}
      </ul>
      {orders.length > 0 && <SearchBox label="Search orders" value={query} onChange={setQuery} />}

      <table className="wp-list-table widefat fixed striped cb-orders">
        <thead>
          <tr>
            <th scope="col" className="column-primary">
              Order
            </th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {shown.length === 0 && <EmptyRow colSpan={4}>{orders.length ? 'No orders match.' : 'No orders yet. They appear here as soon as a customer checks out.'}</EmptyRow>}
          {shown.map((o) => (
            <FragmentRow key={o.id} order={o} expanded={open === o.id} onToggle={() => setOpen(open === o.id ? null : o.id)} onStatus={(s) => setStatus(o, s)} onDelete={() => setToDelete(o)} />
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete order"
        message={toDelete && `Order #${toDelete.id} from ${toDelete.customer?.name || 'a customer'} will be deleted.`}
        confirmLabel="Delete"
        onConfirm={() => del(toDelete)}
        onClose={() => setToDelete(null)}
      />
    </>
  )
}

function FragmentRow({ order: o, expanded, onToggle, onStatus, onDelete }) {
  const c = o.customer || {}
  const phoneDigits = String(c.phone || '').replace(/\D/g, '')
  return (
    <>
      <tr className={o.status === 'new' ? 'cb-order--new' : ''}>
        <td className="column-primary has-row-actions">
          <strong>
            <button type="button" className="button-link row-title" onClick={onToggle} aria-expanded={expanded}>
              #{o.id} {c.name}
            </button>
          </strong>
          <div className="cb-order__sub">
            {(o.items || []).reduce((n, i) => n + (i.qty || 0), 0)} item(s) · {o.payment} · {c.fulfilment === 'delivery' ? 'Delivery' : 'Pickup'}
          </div>
          <div className="row-actions">
            <RowAction onClick={onToggle}>{expanded ? 'Hide details' : 'View details'}</RowAction>
            <RowAction danger onClick={onDelete}>
              Delete
            </RowAction>
          </div>
        </td>
        <td data-colname="Date">
          {formatDate(o.created_at)} <span className="cb-order__time">{time(o.created_at)}</span>
        </td>
        <td data-colname="Status">
          <select value={o.status} onChange={(e) => onStatus(e.target.value)} aria-label={`Status of order ${o.id}`} className={`cb-order-status is-${o.status}`}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </td>
        <td data-colname="Total">{o.total != null ? money(Number(o.total)) : '—'}</td>
      </tr>
      {expanded && (
        <tr className="cb-order__details">
          <td colSpan={4}>
            <ul className="cb-order__items">
              {(o.items || []).map((i, n) => (
                <li key={n}>
                  {i.image && <img src={i.image} alt="" width="40" height="40" />}
                  <span>
                    <strong>
                      {i.qty} × {i.name}
                    </strong>
                    {i.plan && !/one-time/i.test(i.plan) && <small> — {i.plan}</small>}
                  </span>
                  {i.each != null && <span className="cb-order__price">{money(i.each * i.qty)}</span>}
                </li>
              ))}
            </ul>
            <p>
              <strong>Customer:</strong> {c.name}
              {c.phone && (
                <>
                  {' '}
                  · <a href={`tel:${c.phone}`}>{c.phone}</a>
                  {phoneDigits.length >= 10 && (
                    <>
                      {' '}
                      ·{' '}
                      <a href={whatsappUrl(phoneDigits.length === 10 ? `1${phoneDigits}` : phoneDigits, `Hi ${c.name}, about your CannaBuddyHub order #${o.id}:`)} target="_blank" rel="noreferrer">
                        Message on WhatsApp
                      </a>
                    </>
                  )}
                </>
              )}
            </p>
            <p>
              <strong>{c.fulfilment === 'delivery' ? 'Deliver to:' : 'Pickup'}</strong> {c.fulfilment === 'delivery' && c.address}
            </p>
            {c.note && (
              <p>
                <strong>Note:</strong> {c.note}
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  )
}
