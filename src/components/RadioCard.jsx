import Button from "../UI/Button";
import "./RadioCard.css";

export default function RadioCard({
  selected,
  onSelect,
  children,
  leading,
  trailing,
  className = "",
  style,
  disabled,
}) {
  return (
    <Button
      type="button"
      variant={selected ? "primary" : "secondary"}
      className={`radio-card${selected ? " is-selected" : ""}${
        className ? ` ${className}` : ""
      }`}
      onClick={onSelect}
      disabled={disabled}
      style={style}
    >
      <span className="radio-card__inner">
        {leading ? (
          <span className="radio-card__leading">{leading}</span>
        ) : null}
        <span className="radio-card__label">{children}</span>
        {trailing ? (
          <span className="radio-card__trailing">{trailing}</span>
        ) : null}
      </span>
    </Button>
  );
}
