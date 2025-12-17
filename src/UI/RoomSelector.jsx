import React from "react";
import "../components/AddDeviceModal.css";

const rooms = [
  "Kitchen",
  "Bathroom",
  "Living Room",
  "Bedroom",
  "Office",
  "Garage",
];

export default function RoomSelector({ selectedRoom, onRoomChange }) {
  return (
    <div className="adm-field">
      <label className="adm-label">Room</label>
      <div className="adm-roomGrid">
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => onRoomChange(room)}
            className={`adm-roomBtn ${
              selectedRoom === room ? "is-active" : ""
            }`}
          >
            {room}
          </button>
        ))}
      </div>
    </div>
  );
}
