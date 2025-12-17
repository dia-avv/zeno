import IconLocation from "../assets/icons/location.svg?react";
import "../components/DeviceCard.css";

export default function LocationTag({ room }) {
  if (!room) return null;
  return (
    <div className="location-tag">
      <span style={{ fontSize: 12 }}>
        <IconLocation />
      </span>
      <span>{room}</span>
    </div>
  );
}
