import { addCalendarDays, getTodayCalendarDate } from '../utils/dateUtils.js';

const today = getTodayCalendarDate();

export const subscriptions = [
  { id: 'sub-1', serviceName: 'Netflix', cost: 15.49, billingCycle: 'Monthly', nextRenewalDate: addCalendarDays(today, 4), status: 'active' },
  { id: 'sub-2', serviceName: 'Adobe Creative Cloud', cost: 599.88, billingCycle: 'Yearly', nextRenewalDate: addCalendarDays(today, 18), status: 'active' },
  { id: 'sub-3', serviceName: 'Spotify', cost: 11.99, billingCycle: 'Monthly', nextRenewalDate: addCalendarDays(today, 7), status: 'active' },
  { id: 'sub-4', serviceName: 'Dropbox', cost: 19.99, billingCycle: 'Monthly', nextRenewalDate: addCalendarDays(today, 2), status: 'paused' },
];

export function createSubscriptionId() {
  return `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}