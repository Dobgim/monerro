// Payment methods offered at checkout. The shop owner turns each on/off and enters the
// account customers should pay (Admin → Settings → Payment methods).
export const PAYMENT_METHODS = [
  { id: 'paypal', label: 'PayPal', color: '#003087', symbol: 'P', accountLabel: 'PayPal email or PayPal.me link', placeholder: 'payments@cannabuddyhub.com' },
  { id: 'venmo', label: 'Venmo', color: '#008cff', symbol: 'V', accountLabel: 'Venmo username', placeholder: '@CannaBuddyHub' },
  { id: 'zelle', label: 'Zelle', color: '#6d1ed4', symbol: 'Z', accountLabel: 'Zelle email or phone number', placeholder: 'zelle@cannabuddyhub.com' },
  { id: 'btc', label: 'Bitcoin (BTC)', color: '#f7931a', symbol: '₿', accountLabel: 'Bitcoin wallet address', placeholder: 'bc1q…' },
  { id: 'cashapp', label: 'Cash App', color: '#00c244', symbol: '$', accountLabel: 'Cash App $Cashtag', placeholder: '$CannaBuddyHub' },
]

export function defaultPayments() {
  return Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, { enabled: true, account: '' }]))
}

/** Methods the shop currently accepts, with their saved account details. */
export function enabledMethods(payments) {
  return PAYMENT_METHODS.filter((m) => payments?.[m.id]?.enabled !== false).map((m) => ({ ...m, account: payments?.[m.id]?.account || '' }))
}
