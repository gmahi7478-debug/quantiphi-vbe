import {
  addSubscription,
  listSubscriptions,
  STATUSES,
  updateSubscriptionStatus,
  validateSubscriptionInput,
} from '../services/subscriptionService.js';

export function getSubscriptions(req, res) {
  res.status(200).json({ subscriptions: listSubscriptions() });
}

export function createSubscription(req, res) {
  const validationError = validateSubscriptionInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  return res.status(201).json({ subscription: addSubscription(req.body) });
}

export function patchSubscriptionStatus(req, res) {
  const { status } = req.body;
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Status must be active or paused.' });
  }

  const subscription = updateSubscriptionStatus(req.params.id, status);
  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found.' });
  }

  return res.status(200).json({ subscription });
}
