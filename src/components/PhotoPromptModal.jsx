import React, { useRef } from "react";
import "./PhotoPromptModal.css";

export default function PhotoPromptModal({
  open,
  onClose,
  onPhoto,
  onSkip,
  deviceName,
}) {
  const fileInputRef = useRef();

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onPhoto(file);
    }
  };

  return (
    <div className="photo-modal-backdrop">
      <div className="photo-modal">
        <h3 className="photo-modal-title">Photo Confirmation</h3>
        <p className="photo-modal-desc">
          Take a photo of <b>{deviceName}</b> to prove you turned it off.{" "}
          <br></br>You will thank yourself later!
        </p>
        <div className="photo-modal-actions">
          <button
            className="photo-modal-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Take Photo
          </button>
          <button
            className="photo-modal-btn photo-modal-btn-skip"
            onClick={onSkip}
          >
            Skip
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button className="photo-modal-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}
