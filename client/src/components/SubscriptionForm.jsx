import { useState } from 'react';

const initialForm = { serviceName: '', cost: '', billingCycle: 'Monthly', nextRenewalDate: '' };

export default function SubscriptionForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await onSubmit(form);
      setForm(initialForm);
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  return (
    <section className="form-section" aria-labelledby="form-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Add to your stack</p>
          <h2 id="form-heading">Track a new subscription</h2>
        </div>
        <span className="form-hint">All fields required</span>
      </div>
      <form className="subscription-form" onSubmit={handleSubmit}>
        <label>Service name<input name="serviceName" value={form.serviceName} onChange={updateField} placeholder="e.g. Figma" /></label>
        <label>Cost<input name="cost" type="number" min="0.01" step="0.01" value={form.cost} onChange={updateField} placeholder="0.00" /></label>
        <label>Billing cycle<select name="billingCycle" value={form.billingCycle} onChange={updateField}><option>Monthly</option><option>Yearly</option></select></label>
        <label>Next renewal<input name="nextRenewalDate" type="date" value={form.nextRenewalDate} onChange={updateField} /></label>
        <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add subscription'}<span aria-hidden="true">+</span></button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}
