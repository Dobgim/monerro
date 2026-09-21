// Orders this customer has sent from this device (shown under My Account).
// Kept only in their browser — the shop receives orders on WhatsApp.
const KEY = 'cannabuddyhub-orders'

export function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function saveOrder(order) {
  try {
    localStorage.setItem(KEY, JSON.stringify([order, ...loadOrders()].slice(0, 20)))
  } catch {
    // storage unavailable — the order still goes out on WhatsApp
  }
}
