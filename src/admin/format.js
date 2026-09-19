export function formatPrice(price) {
  if (!price) return '—'
  const prefix = price.prefix ? `${price.prefix} ` : ''
  if (price.type === 'range') return `${prefix}$${price.min} – $${price.max}`
  if (price.type === 'sale') return `${prefix}$${price.sale} (was $${price.regular})`
  return `${prefix}$${price.amount}`
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  return `${Math.floor(s / 86400)} d ago`
}

export function downloadFile(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}
