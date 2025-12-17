import { useState } from "react";
import DeviceIcon from "../UI/DeviceIcon";
import Button from "../UI/Button";
import IconPencil from "../assets/icons/pencil.svg?react";
import IconTrash from "../assets/icons/trash.svg?react";
import "./DeviceCard.css";
import ToggleSwitch from "../UI/ToggleSwitch";
import LocationTag from "../UI/LocationTag";
import ReminderTag from "../UI/ReminderTag";
import PhotoPromptModal from "./PhotoPromptModal";
import { supabase } from "../lib/supabaseClient";

export default function DeviceCard({ device, onToggle, onEdit, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoPrompt, setPhotoPrompt] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(device.photo_url);

  const handleEditClick = () => {
    onEdit(device);
    setIsModalOpen(true);
  };

  const handleToggle = () => {
    if (!device.enabled) {
      setPhotoPrompt(true);
    } else {
      onToggle(device.id);
    }
  };

  const handlePhoto = async (file) => {
    // Upload to Supabase Storage
    const filePath = `${device.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("device-proof-photos")
      .upload(filePath, file, { upsert: true });
    if (error) {
      alert("Photo upload failed: " + error.message);
      setPhotoPrompt(false);
      return;
    }
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("device-proof-photos")
      .getPublicUrl(filePath);
    const url = publicUrlData.publicUrl;
    // Save URL to the device row
    await supabase
      .from("devices")
      .update({ photo_url: url, enabled: true })
      .eq("id", device.id);
    setPhotoUrl(url);
    setPhotoPrompt(false);
    onToggle(device.id);
  };

  return (
    <div className="device-card">
      <div className="device-card-inner">
        <div className="device-icon" style={{ background: device.color }}>
          <DeviceIcon icon={device.icon} />
        </div>

        <div className="device-content">
          <div className="device-header">
            <div>
              <h3 className="device-title">{device.name}</h3>
              <LocationTag room={device.room} />
            </div>

            <ToggleSwitch
              enabled={device.enabled}
              onToggle={handleToggle}
              ariaLabel={device.enabled ? "Disable device" : "Enable device"}
            />
          </div>

          <ReminderTag time={device.reminderTime} />

          {(photoUrl || device.photo_url) && (
            <div className="device-photo-proof">
              <img
                src={photoUrl || device.photo_url}
                alt="Proof"
                className="device-photo-img"
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
            </div>
          )}

          <div className="device-actions">
            <Button
              variant="primary"
              icon={<IconPencil />}
              onClick={handleEditClick}
            >
              Edit
            </Button>

            <Button
              variant="danger"
              icon={<IconTrash />}
              iconOnly
              onClick={() => onDelete(device.id)}
              aria-label={`Delete ${device.name}`}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PhotoPromptModal
          device={device}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <PhotoPromptModal
        open={photoPrompt}
        deviceName={device.name}
        onClose={() => setPhotoPrompt(false)}
        onPhoto={handlePhoto}
        onSkip={() => {
          setPhotoPrompt(false);
          onToggle(device.id);
        }}
      />
    </div>
  );
}
