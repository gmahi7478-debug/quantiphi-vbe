import { getDashboardMetrics } from '../services/subscriptionService.js';

export function getMetrics(req, res) {
  res.status(200).json(getDashboardMetrics());
}
