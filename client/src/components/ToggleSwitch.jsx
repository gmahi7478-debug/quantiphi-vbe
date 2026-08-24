export default function ToggleSwitch({ checked, disabled, onChange, label }) {
  return (
    <label className="switch-label">
      <span className="sr-only">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true"><span /></span>
    </label>
  );
}
