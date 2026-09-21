import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'
import Icon from './Icon'
import { whenSaved } from '../../store/siteStore'

// WordPress-style building blocks: buttons, postboxes, form tables, notices, modals.

export function Button({ variant = 'secondary', size, icon, children, className = '', ...props }) {
  const classes = ['button', variant === 'primary' && 'button-primary', variant === 'link-delete' && 'button-link-delete', size === 'large' && 'button-large', className]
  return (
    <button type="button" className={classes.filter(Boolean).join(' ')} {...props}>
      {icon && <Icon name={icon} size={16} />}
      {children && <span>{children}</span>}
    </button>
  )
}

export function RowAction({ children, danger, ...props }) {
  return (
    <span className={danger ? 'trash' : undefined}>
      <button type="button" className="button-link" {...props}>
        {children}
      </button>
    </span>
  )
}

/** Page title + "Add New" action, like every WordPress list screen. */
export function PageHeader({ title, action, description, children }) {
  return (
    <>
      <h1 className="wp-heading-inline">{title}</h1>
      {action}
      <hr className="wp-header-end" />
      {description && <p className="wp-description">{description}</p>}
      {children}
    </>
  )
}

/** A WordPress metabox. `collapsible` gives it the little toggle arrow. */
export function Postbox({ title, children, id, collapsible = false, defaultOpen = true, className = '' }) {
  const [open, setOpen] = useState(defaultOpen)
  const closed = collapsible && !open
  return (
    <div className={`postbox${closed ? ' closed' : ''} ${className}`} id={id}>
      {/* like WordPress, the whole header opens and closes a collapsible box */}
      <div className={`postbox-header${collapsible ? ' is-toggle' : ''}`} onClick={collapsible ? () => setOpen((o) => !o) : undefined}>
        <h2>{title}</h2>
        {collapsible && (
          <button type="button" className="handlediv" aria-expanded={open}>
            <span className="screen-reader-text">Toggle panel: {title}</span>
            <Icon name={open ? 'up' : 'down'} size={16} />
          </button>
        )}
      </div>
      {!closed && <div className="inside">{children}</div>}
    </div>
  )
}

/** Label + field row used inside settings screens (WordPress .form-table). */
export function FormRow({ label, htmlFor, description, children }) {
  return (
    <tr>
      <th scope="row">{htmlFor ? <label htmlFor={htmlFor}>{label}</label> : label}</th>
      <td>
        {children}
        {description && <p className="description">{description}</p>}
      </td>
    </tr>
  )
}

export function FormTable({ children }) {
  return (
    <table className="form-table" role="presentation">
      <tbody>{children}</tbody>
    </table>
  )
}

export function TextInput({ label, description, error, className = 'regular-text', wide, ...props }) {
  const id = useId()
  return (
    <FormRow label={label} htmlFor={id} description={description}>
      <input id={id} type="text" className={wide ? 'large-text' : className} {...props} />
      {error && <p className="field-error">{error}</p>}
    </FormRow>
  )
}

export function TextAreaRow({ label, description, rows = 3, ...props }) {
  const id = useId()
  return (
    <FormRow label={label} htmlFor={id} description={description}>
      <textarea id={id} rows={rows} className="large-text" {...props} />
    </FormRow>
  )
}

export function SelectRow({ label, description, options, ...props }) {
  const id = useId()
  return (
    <FormRow label={label} htmlFor={id} description={description}>
      <select id={id} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FormRow>
  )
}

export function CheckboxRow({ label, checked, onChange, description }) {
  const id = useId()
  return (
    <FormRow label={label}>
      <label className="checkbox-label" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        {description}
      </label>
    </FormRow>
  )
}

/** Yes/No switch used in list tables. */
export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`cb-switch${checked ? ' is-on' : ''}`} onClick={() => onChange(!checked)}>
      <span />
    </button>
  )
}

export function StatusBadge({ tone = 'neutral', children }) {
  return <span className={`cb-badge cb-badge--${tone}`}>{children}</span>
}

export function EmptyRow({ colSpan, children }) {
  return (
    <tr className="no-items">
      <td className="colspanchange" colSpan={colSpan}>
        {children}
      </td>
    </tr>
  )
}

export function SearchBox({ label, value, onChange }) {
  const id = useId()
  return (
    <p className="search-box">
      <label className="screen-reader-text" htmlFor={id}>
        {label}
      </label>
      <input id={id} type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={label} />
    </p>
  )
}

export function Modal({ open, title, onClose, children, footer, wide }) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    ref.current?.querySelector('.cb-modal__body input, .cb-modal__body textarea, .cb-modal__body select, button')?.focus()
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="cb-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`cb-modal__dialog${wide ? ' is-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="cb-modal__head">
          <h2>{title}</h2>
          <button type="button" className="cb-modal__close" aria-label="Close dialog" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="cb-modal__body">{children}</div>
        {footer && <div className="cb-modal__foot">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="button-delete" onClick={() => { onConfirm(); onClose() }}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}

// ---- admin notices ---------------------------------------------------------

const NoticeContext = createContext(() => {})

export function NoticeProvider({ children }) {
  const [notices, setNotices] = useState([])
  const push = useCallback((message, tone = 'success') => {
    const id = Math.random()
    setNotices((n) => [...n.filter((x) => x.message !== message), { id, message, tone }])
    if (tone === 'success') setTimeout(() => setNotices((n) => n.filter((x) => x.id !== id)), 6000)
  }, [])
  const dismiss = (id) => setNotices((n) => n.filter((x) => x.id !== id))

  return (
    <NoticeContext.Provider value={push}>
      <div className="cb-notices" aria-live="polite">
        {notices.map((n) => (
          <div key={n.id} className={`notice notice-${n.tone} is-dismissible`}>
            <p>{n.message}</p>
            <button type="button" className="notice-dismiss" onClick={() => dismiss(n.id)}>
              <span className="screen-reader-text">Dismiss this notice.</span>
            </button>
          </div>
        ))}
      </div>
      {children}
    </NoticeContext.Provider>
  )
}

export function useNotice() {
  return useContext(NoticeContext)
}

/**
 * Reports a store write. The change shows at once; the success notice waits until the
 * live database has confirmed it, and an error notice appears if it didn't go through.
 * Pass `false` (with an optional message) to report a failure straight away.
 */
export function useSave() {
  const notice = useNotice()
  return useCallback(
    (ok, message) => {
      if (ok === false) {
        notice(message || 'Could not save. Please try again.', 'error')
        return false
      }
      whenSaved().then((error) => {
        if (error) notice(`Not saved to the live site — ${error}. Please try again.`, 'error')
        else if (message) notice(message)
      })
      return true
    },
    [notice],
  )
}
