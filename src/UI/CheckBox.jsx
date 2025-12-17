export default function CheckBox({ checked = false, onChange, ...props }) {
  return (
    <input type="checkbox" checked={checked} onChange={onChange} {...props} />
  );
}
