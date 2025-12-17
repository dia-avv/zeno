import "../components/AddDeviceModal.css";

export default function TextInput({ label, value, onChange, placeholder }) {
  return (
    <div className="adm-field">
      {label && <label className="adm-label">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="adm-input"
      />
    </div>
  );
}
