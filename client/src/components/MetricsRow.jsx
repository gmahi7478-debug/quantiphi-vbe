import MetricCard from './MetricCard.jsx';

export default function MetricsRow({ metrics }) {
  return (
    <section className="metrics-row" aria-label="Dashboard metrics">
      <MetricCard
        accent="mint"
        label="Total Monthly Burn Rate"
        value={`$${metrics.totalMonthlyBurnRate.toFixed(2)}`}
        detail="Across active subscriptions"
      />
      <MetricCard
        accent="amber"
        label="Upcoming Renewals"
        value={metrics.upcomingRenewals}
        detail="Active renewals in the next 7 days"
      />
    </section>
  );
}
