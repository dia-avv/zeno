import React from "react";
import IconClock from "../assets/icons/clock.svg?react";
import "../components/DeviceCard.css";

export default function ReminderTag({ time }) {
  if (!time) return null;
  return (
    <div className="reminder-tag">
      <span style={{ fontSize: 12 }}>
        <IconClock />
      </span>
      <span>Daily reminder at {time}</span>
    </div>
  );
}
