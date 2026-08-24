import { subscriptions, createSubscriptionId } from '../data/subscriptions.js';
import { getMonthlyCost } from '../utils/costUtils.js';
import { getDaysUntilRenewal, isValidCalendarDate, isRenewingSoon } from '../utils/dateUtils.js';

const BILLING_CYCLES = ['Monthly', 'Yearly'];
const STATUSES = ['active', 'paused'];

function enrichSubscription(subscription) {
  const daysUntilRenewal = getDaysUntilRenewal(subscription.nextRenewalDate);
  return {
    ...subscription,
    daysUntilRenewal,
    renewingSoon: isRenewingSoon(daysUntilRenewal),
  };
}

function validateSubscriptionInput(input) {
  if (typeof input?.serviceName !== 'string' || !input.serviceName.trim()) {
    return 'Service name is required.';
  }

  const cost = Number(input.cost);
  if (!Number.isFinite(cost) || cost <= 0) {
    return 'Cost must be a positive number.';
  }

  if (!BILLING_CYCLES.includes(input.billingCycle)) {
    return 'Billing cycle must be Monthly or Yearly.';
  }

  if (!isValidCalendarDate(input.nextRenewalDate)) {
    return 'Next renewal date must be a valid date.';
  }

  return null;
}

export function listSubscriptions() {
  return subscriptions.map(enrichSubscription);
}

export function addSubscription(input) {
  const subscription = {
    id: createSubscriptionId(),
    serviceName: input.serviceName.trim(),
    cost: Number(input.cost),
    billingCycle: input.billingCycle,
    nextRenewalDate: input.nextRenewalDate,
    status: 'active',
  };
  subscriptions.unshift(subscription);
  return enrichSubscription(subscription);
}

export function updateSubscriptionStatus(id, status) {
  const subscription = subscriptions.find((item) => item.id === id);
  if (!subscription) return null;
  subscription.status = status;
  return enrichSubscription(subscription);
}

export function getDashboardMetrics() {
  const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === 'active');
  const totalMonthlyBurnRate = activeSubscriptions.reduce((total, subscription) => {
    return total + getMonthlyCost(subscription.cost, subscription.billingCycle);
  }, 0);
  const upcomingRenewals = activeSubscriptions.filter((subscription) => enrichSubscription(subscription).renewingSoon).length;

  return {
    totalMonthlyBurnRate: Number(totalMonthlyBurnRate.toFixed(2)),
    upcomingRenewals,
  };
}

export { BILLING_CYCLES, STATUSES, validateSubscriptionInput };
