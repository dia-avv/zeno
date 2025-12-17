import React from "react";
import "./ToggleSwitch.css";

export default function ToggleSwitch({
  enabled,
  onToggle,
  ariaLabel = "Toggle",
}) {
  return (
    <button onClick={onToggle} className="toggle" aria-label={ariaLabel}>
      <div className={`toggle-track ${enabled ? "on" : "off"}`}>
        <div
          className="toggle-thumb"
          style={{ left: enabled ? "24px" : "4px" }}
        />
      </div>
    </button>
  );
}
