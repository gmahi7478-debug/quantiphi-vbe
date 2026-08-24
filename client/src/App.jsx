import { useEffect, useState } from 'react';
import MetricsRow from './components/MetricsRow.jsx';
import SubscriptionForm from './components/SubscriptionForm.jsx';
import SubscriptionTable from './components/SubscriptionTable.jsx';
import { createSubscription, getMetrics, getSubscriptions, updateSubscriptionStatus } from './services/api.js';

const emptyMetrics = { totalMonthlyBurnRate: 0, upcomingRenewals: 0 };

export default function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [metrics, setMetrics] = useState(emptyMetrics);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState('');

  async function loadDashboard() {
    setPageError('');
    try {
      const [subscriptionData, metricsData] = await Promise.all([getSubscriptions(), getMetrics()]);
      setSubscriptions(subscriptionData.subscriptions);
      setMetrics(metricsData);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  async function handleAdd(form) {
    setSubmitting(true);
    try {
      await createSubscription(form);
      await loadDashboard();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(subscription, status) {
    setUpdatingId(subscription.id);
    setPageError('');
    try {
      await updateSubscriptionStatus(subscription.id, status);
      await loadDashboard();
    } catch (error) {
      setPageError(error.message);
    } finally {
      setUpdatingId('');
    }
  }

  return (
    <main className="app-shell">
      <div className="ambient-shape shape-one" aria-hidden="true" />
      <div className="ambient-shape shape-two" aria-hidden="true" />
      <div className="page-content">
        <header className="page-header">
          <div className="brand-lockup"><span className="brand-mark" aria-hidden="true">↗</span><span>Ledgerly</span></div>
          <div className="header-note"><span className="live-dot" /> Personal finance overview</div>
          <h1>Subscription <em>tracker</em></h1>
          <p className="subtitle">A clearer view of what keeps running, what is coming due, and where your monthly spend goes.</p>
        </header>

        {loading ? <div className="state-panel" role="status">Loading your subscriptions...</div> : pageError && subscriptions.length === 0 ? <div className="state-panel error-panel" role="alert"><strong>We could not load the dashboard.</strong><span>{pageError}</span><button className="secondary-button" onClick={loadDashboard}>Try again</button></div> : <>
          <MetricsRow metrics={metrics} />
          <SubscriptionForm onSubmit={handleAdd} submitting={submitting} />
          {pageError && <div className="inline-error" role="alert">{pageError}</div>}
          {subscriptions.length === 0 ? <div className="state-panel"><strong>No subscriptions yet.</strong><span>Add your first recurring service above to start tracking.</span></div> : <SubscriptionTable subscriptions={subscriptions} updatingId={updatingId} onToggle={handleToggle} />}
        </>}
        <footer>In-memory workspace <span>•</span> Last updated from your local API</footer>
      </div>
    </main>
  );
}
