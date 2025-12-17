import "./Button.css";

export default function Button({
  children,
  icon,
  variant = "primary",
  iconOnly = false,
  onClick,
  ...props
}) {
  return (
    <button
      className={`btn btn--${variant}${iconOnly ? " btn--icon-only" : ""}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children && !iconOnly && <span className="btn-label">{children}</span>}
    </button>
  );
}
