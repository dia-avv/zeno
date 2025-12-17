import "../components/AddDeviceModal.css";

export default function TimeInput({ label, value, onChange }) {
  return (
    <div className="adm-field">
      {label && <label className="adm-label">{label}</label>}
      <input
        type="time"
        value={value}
        onChange={onChange}
        className="adm-input"
      />
    </div>
  );
}
