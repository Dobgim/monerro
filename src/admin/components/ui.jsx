import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'
import Icon from './Icon'

export function Button({ variant = 'secondary', size, icon, children, className = '', ...props }) {
  return (
    <button type="button" className={`adm-btn adm-btn--${variant}${size ? ` adm-btn--${size}` : ''} ${className}`} {...props}>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children && <span>{children}</span>}
    </button>
  )
}

export function IconButton({ icon, label, variant = 'ghost', ...props }) {
  return (
    <button type="button" className={`adm-iconbtn adm-iconbtn--${variant}`} aria-label={label} title={label} {...props}>
      <Icon name={icon} size={17} />
    </button>
  )
}

export function Field({ label, hint, error, children, className = '' }) {
  const id = useId()
  return (
    <div className={`adm-field ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {typeof children === 'function' ? children(id) : children}
      {error ? <p className="adm-field__error">{error}</p> : hint && <p className="adm-field__hint">{hint}</p>}
    </div>
  )
}

export function TextInput({ label, hint, error, className, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      {(id) => <input id={id} className="adm-input" {...props} />}
    </Field>
  )
}

export function TextArea({ label, hint, className, ...props }) {
  return (
    <Field label={label} hint={hint} className={className}>
      {(id) => <textarea id={id} className="adm-input adm-textarea" {...props} />}
    </Field>
  )
}

export function Select({ label, hint, options, className, ...props }) {
  return (
    <Field label={label} hint={hint} className={className}>
      {(id) => (
        <select id={id} className="adm-input adm-select" {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  )
}

export function Toggle({ checked, onChange, label, description }) {
  const id = useId()
  return (
    <div className="adm-toggle">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={`adm-switch${checked ? ' is-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
      {label && (
        <label htmlFor={id} className="adm-toggle__text">
          <span>{label}</span>
          {description && <small>{description}</small>}
        </label>
      )}
    </div>
  )
}

export function Segmented({ value, onChange, options, label }) {
  return (
    <div className="adm-field">
      {label && <span className="adm-field__label">{label}</span>}
      <div className="adm-segmented" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value} className={value === o.value ? 'is-active' : ''} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Badge({ tone = 'neutral', children }) {
  return <span className={`adm-badge adm-badge--${tone}`}>{children}</span>
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="adm-pagehead">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="adm-pagehead__actions">{actions}</div>}
    </div>
  )
}

export function Card({ title, actions, children, className = '', padded = true }) {
  return (
    <section className={`adm-card ${className}`}>
      {(title || actions) && (
        <header className="adm-card__head">
          {title && <h2>{title}</h2>}
          {actions}
        </header>
      )}
      <div className={padded ? 'adm-card__body' : ''}>{children}</div>
    </section>
  )
}

export function EmptyState({ icon = 'search', title, children }) {
  return (
    <div className="adm-empty">
      <Icon name={icon} size={28} />
      <p className="adm-empty__title">{title}</p>
      {children && <p>{children}</p>}
    </div>
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
    ref.current?.querySelector('.adm-modal__body input, .adm-modal__body textarea, .adm-modal__body select, button')?.focus()
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
    <div className="adm-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`adm-modal__dialog${wide ? ' is-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="adm-modal__head">
          <h2>{title}</h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </header>
        <div className="adm-modal__body">{children}</div>
        {footer && <footer className="adm-modal__foot">{footer}</footer>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose, danger = true }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="adm-confirm">{message}</p>
    </Modal>
  )
}

// ---- toasts ----------------------------------------------------------------

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((message, tone = 'success') => {
    const id = Math.random()
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`adm-toast adm-toast--${t.tone}`}>
            <Icon name={t.tone === 'error' ? 'alert' : 'check'} size={16} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

// Save helper: runs a store write and reports quota failures to the user
export function useSave() {
  const toast = useToast()
  return useCallback(
    (ok, message) => {
      if (ok === false) toast('Could not save — browser storage is full. Try smaller images or remove some.', 'error')
      else if (message) toast(message)
      return ok !== false
    },
    [toast],
  )
}
