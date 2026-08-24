async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

export function getSubscriptions() {
  return request('/api/subscriptions');
}

export function getMetrics() {
  return request('/api/dashboard/metrics');
}

export function createSubscription(subscription) {
  return request('/api/subscriptions', {
    method: 'POST',
    body: JSON.stringify(subscription),
  });
}

export function updateSubscriptionStatus(id, status) {
  return request(`/api/subscriptions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
