import { unitPrice } from './links'

// Subscribe & Save options, matching the original shop: the biggest discount for weekly
// delivery, 5% less for every 2 weeks, 10% less for monthly.
export function subscriptionPlans(product) {
  const max = parseInt(product?.price?.subscribeDiscount, 10)
  if (!max) return []
  return [
    { interval: 'week', label: 'Every week', off: max },
    { interval: '2 weeks', label: 'Every 2 weeks', off: max - 5 },
    { interval: 'month', label: 'Every month', off: max - 10 },
  ].filter((p) => p.off > 0)
}

/** Price for one unit, with the subscription discount applied when a plan is chosen. */
export function planUnitPrice(product, plan) {
  const base = unitPrice(product?.price)
  return plan ? Math.round(base * (100 - plan.off)) / 100 : base
}

export const planText = (plan) => (plan ? `Subscribe: ${plan.label.toLowerCase()} (${plan.off}% off)` : 'One-time purchase')
