import ToggleSwitch from './ToggleSwitch.jsx';

function formatCurrency(cost) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cost);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${dateString}T00:00:00Z`));
}

export default function SubscriptionTable({ subscriptions, updatingId, onToggle }) {
  return (
    <section className="table-section" aria-labelledby="subscriptions-heading">
      <div className="section-heading table-heading"><div><p className="eyebrow">Your recurring spend</p><h2 id="subscriptions-heading">All subscriptions <span>{subscriptions.length}</span></h2></div><span className="table-count">{subscriptions.length} tracked</span></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Service</th><th>Cost</th><th>Billing cycle</th><th>Next renewal</th><th>Status</th></tr></thead>
          <tbody>{subscriptions.map((subscription) => (
            <tr className={subscription.status === 'paused' ? 'is-paused' : ''} key={subscription.id}>
              <td><div className="service-cell"><span className="service-mark">{subscription.serviceName.slice(0, 1).toUpperCase()}</span><strong>{subscription.serviceName}</strong></div></td>
              <td><strong>{formatCurrency(subscription.cost)}</strong></td>
              <td><span className="cycle-text">{subscription.billingCycle}</span></td>
              <td><div className="renewal-cell"><span>{formatDate(subscription.nextRenewalDate)}</span>{subscription.renewingSoon && <span className="soon-badge">Renewing soon</span>}</div></td>
              <td><div className="status-cell"><ToggleSwitch checked={subscription.status === 'active'} disabled={updatingId === subscription.id} label={`Set ${subscription.serviceName} ${subscription.status === 'active' ? 'paused' : 'active'}`} onChange={(checked) => onToggle(subscription, checked ? 'active' : 'paused')} /><span className="status-text">{subscription.status === 'active' ? 'Active' : 'Paused'}</span></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}
