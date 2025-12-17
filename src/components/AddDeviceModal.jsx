import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Flame,
  Lamp,
  Smartphone,
  Coffee,
  Tv,
  Zap,
  Fan,
  Droplet,
} from "lucide-react";
import RoomSelector from "../UI/RoomSelector";
import TextInput from "../UI/TextInput";
import TimeInput from "../UI/TimeInput";
import Button from "../UI/Button";
import PlusIcon from "../assets/icons/plus.svg?react";
import "./AddDeviceModal.css";
import DefaultDeviceIcon from "../assets/icons/default-device.svg?react";
import { deviceTemplates } from "../constants/deviceTemplates";

export default function AddDeviceModal({ isOpen, onClose, onAdd }) {
  const [step, setStep] = useState("type");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deviceName, setDeviceName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [enableReminder, setEnableReminder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setDeviceName(template.label);
    setStep("details");
  };

  const handleSubmit = async () => {
    if (!selectedTemplate || !deviceName || !selectedRoom) return;

    setIsSubmitting(true);

    const newDevice = {
      name: deviceName,
      room: selectedRoom,
      icon: selectedTemplate.icon || <DefaultDeviceIcon />,
      color: selectedTemplate.color,
      reminderTime: enableReminder ? reminderTime : null,
      enabled: true,
    };
    onAdd(newDevice);

    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setStep("type");
    setSelectedTemplate(null);
    setDeviceName("");
    setSelectedRoom("");
    setReminderTime("");
    setEnableReminder(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="adm-backdrop"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="adm-shell"
          >
            <div className="adm-modal">
              {/* Header */}
              <div className="adm-header">
                <h2 className="adm-title">
                  {step === "type" ? "Choose device type" : "Device details"}
                </h2>
                <button onClick={handleClose} className="adm-close">
                  <X className="adm-closeIcon" />
                </button>
              </div>

              {/* Step 1: Choose Type */}
              {step === "type" && (
                <div className="adm-grid">
                  <motion.button
                    className="adm-tile adm-custom-tile"
                    style={{
                      background: "var(--bg-surface)",
                      border: "2px solid var(--accent-blue)",
                      color: "var(--accent-blue)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedTemplate({
                        icon: "plus",
                        label: "Custom device",
                        color: "var(--accent-blue)",
                        IconComponent: DefaultDeviceIcon,
                      });
                      setDeviceName("");
                      setStep("details");
                    }}
                  >
                    <PlusIcon
                      className="adm-tileIcon"
                      style={{ color: "var(--accent-blue)" }}
                    />
                    <span className="adm-tileLabel">Custom device</span>
                  </motion.button>
                  {deviceTemplates.map((template) => (
                    <motion.button
                      key={template.icon}
                      onClick={() => handleSelectTemplate(template)}
                      className="adm-tile"
                      style={{ backgroundColor: template.color }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <template.IconComponent
                        className="adm-tileIcon"
                        strokeWidth={1.5}
                      />
                      <span className="adm-tileLabel">{template.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Step 2: Details */}
              {step === "details" && selectedTemplate && (
                <div className="adm-details">
                  {/* Preview */}
                  <div className="adm-preview">
                    <div
                      className="adm-previewIcon"
                      style={{ backgroundColor: selectedTemplate.color }}
                    >
                      <selectedTemplate.IconComponent
                        className="adm-previewIconSvg"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="adm-previewText">{deviceName}</div>
                  </div>

                  {/* Device Name */}
                  <TextInput
                    label="Device name"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="e.g., Hair straightener"
                  />

                  {/* Room Selection */}
                  <RoomSelector
                    selectedRoom={selectedRoom}
                    onRoomChange={setSelectedRoom}
                  />

                  {/* Reminder Toggle */}
                  <div className="adm-toggleRow">
                    <span className="adm-toggleText">Set daily reminder</span>
                    <button
                      onClick={() => setEnableReminder(!enableReminder)}
                      className="adm-toggleBtn"
                    >
                      <div
                        className={`adm-switch ${
                          enableReminder ? "is-on" : ""
                        }`}
                      >
                        <motion.div
                          className="adm-switchKnob"
                          animate={{
                            left: enableReminder ? "24px" : "4px",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      </div>
                    </button>
                  </div>

                  {/* Reminder Time */}
                  {enableReminder && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <TimeInput
                        label="Reminder time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                      />
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="adm-actions">
                    <Button variant="secondary" onClick={() => setStep("type")}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!deviceName || !selectedRoom || isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add device"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
