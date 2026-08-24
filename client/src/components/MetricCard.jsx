export default function MetricCard({ label, value, detail, accent }) {
  return (
    <article className={`metric-card metric-card-${accent}`}>
      <div className="metric-icon" aria-hidden="true">{accent === 'mint' ? '$' : '↗'}</div>
      <div>
        <p className="metric-label">{label}</p>
        <p className="metric-value">{value}</p>
        <p className="metric-detail">{detail}</p>
      </div>
    </article>
  );
}
