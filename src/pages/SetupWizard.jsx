import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Bell, MapPin, Palette, Check } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import Button from "../UI/Button";
import "./SetupWizard.css";

const deviceOptions = [
  { name: "Hair Straightener", icon: "💇" },
  { name: "Coffee Maker", icon: "☕" },
  { name: "Lamp", icon: "💡" },
  { name: "Iron", icon: "👔" },
  { name: "Stove", icon: "🔥" },
  { name: "Curling Iron", icon: "💁" },
  { name: "Space Heater", icon: "🌡️" },
  { name: "Candles", icon: "🕯️" },
];

const themeColors = [
  { name: "Ocean Blue", primary: "#5b8fb9", secondary: "#111c2e" },
  { name: "Forest Green", primary: "#6b9b7c", secondary: "#1a2e1f" },
  { name: "Sunset Purple", primary: "#9b7cb8", secondary: "#241e2e" },
  { name: "Warm Amber", primary: "#b89b5b", secondary: "#2e271e" },
  { name: "Rose Pink", primary: "#b87c9b", secondary: "#2e1e27" },
];

export default function SetupWizard({ onComplete, onBack }) {
  const [step, setStep] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [customDevice, setCustomDevice] = useState("");
  const [hasReminders, setHasReminders] = useState(true);
  const [isAtDoor, setIsAtDoor] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themeColors[0]);
  const [loading, setLoading] = useState(false);
  const totalSteps = 4;

  const toggleDevice = (device) => {
    if (selectedDevices.some((d) => d.name === device.name)) {
      setSelectedDevices(selectedDevices.filter((d) => d.name !== device.name));
    } else {
      setSelectedDevices([...selectedDevices, device]);
    }
  };

  const addCustomDevice = () => {
    if (customDevice.trim()) {
      setSelectedDevices([
        ...selectedDevices,
        { name: customDevice, icon: "📱" },
      ]);
      setCustomDevice("");
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      // Save to Supabase
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      // Upsert account
      await supabase.from("accounts").upsert({
        id: user.id,
        theme: selectedTheme.name,
        has_reminders: hasReminders,
        location_name: isAtDoor ? locationName : null,
      });
      // Insert devices
      if (selectedDevices.length > 0) {
        const deviceRows = selectedDevices.map((d) => ({
          account_id: user.id,
          name: d.name,
          icon: d.icon,
          color: d.color ?? "#5b8fb9", // default color if not set
          room: d.room ?? "",
          enabled: d.enabled ?? false,
          reminder_time: d.reminderTime ?? null,
        }));
        await supabase.from("devices").insert(deviceRows);
      }
      setLoading(false);
      onComplete && onComplete();
    }
  };

  const handleSkipLocation = () => {
    setIsAtDoor(false);
    setStep(step + 1);
  };

  const canProceed = () => {
    if (step === 1) return selectedDevices.length > 0;
    if (step === 3 && isAtDoor) return locationName.trim().length > 0;
    return true;
  };

  return (
    <div className="setupwizard-root">
      <div className="setupwizard-header">
        <button
          onClick={() => (step === 1 ? onBack() : setStep(step - 1))}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: 0,
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <div style={{ color: "var(--text-secondary)" }}>
          Step {step} of {totalSteps}
        </div>
      </div>
      <div className="setupwizard-progress">
        <div className="setupwizard-progressbar">
          <div
            className="setupwizard-progressbar-inner"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      <div className="setupwizard-content">
        {/* Step 1: Add Devices */}
        {step === 1 && (
          <div>
            <div className="setupwizard-step-title">
              What devices do you want to monitor?
            </div>
            <div className="setupwizard-step-desc">
              Select all the devices you want to keep track of
            </div>
            <div className="setupwizard-device-grid">
              {deviceOptions.map((device) => (
                <button
                  key={device.name}
                  type="button"
                  className={`setupwizard-device-btn${
                    selectedDevices.some((d) => d.name === device.name)
                      ? " selected"
                      : ""
                  }`}
                  onClick={() => toggleDevice(device)}
                >
                  <span className="setupwizard-device-icon">{device.icon}</span>
                  <span>{device.name}</span>
                </button>
              ))}
            </div>
            <div className="setupwizard-add-device">
              <label>Add custom device</label>
              <div className="setupwizard-add-device-row">
                <input
                  type="text"
                  value={customDevice}
                  onChange={(e) => setCustomDevice(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomDevice()}
                  placeholder="e.g., Toaster"
                />
                <button
                  className="add-btn"
                  type="button"
                  onClick={addCustomDevice}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            {selectedDevices.length > 0 && (
              <div className="setupwizard-selected-count">
                {selectedDevices.length} device
                {selectedDevices.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        )}
        {/* Step 2: Set Reminders */}
        {step === 2 && (
          <div>
            <div className="setupwizard-step-title">
              Enable Daily Reminders?
            </div>
            <div className="setupwizard-step-desc">
              Get gentle notifications to check your devices before leaving home
            </div>
            <button
              type="button"
              className={`setupwizard-reminder-btn${
                hasReminders ? " selected" : ""
              }`}
              onClick={() => setHasReminders(true)}
            >
              <span>Yes, remind me daily</span>
              {hasReminders && (
                <span className="setupwizard-reminder-check">
                  <Check size={16} />
                </span>
              )}
            </button>
            <button
              type="button"
              className={`setupwizard-reminder-btn${
                !hasReminders ? " selected" : ""
              }`}
              onClick={() => setHasReminders(false)}
            >
              <span>No, I'll check manually</span>
              {!hasReminders && (
                <span className="setupwizard-reminder-check">
                  <Check size={16} />
                </span>
              )}
            </button>
          </div>
        )}
        {/* Step 3: Set Location */}
        {step === 3 && (
          <div>
            <div className="setupwizard-step-title">
              Set Your Entry Location
            </div>
            <div className="setupwizard-step-desc">
              For the best experience, stand by your entry door to save this
              location
            </div>
            {!isAtDoor ? (
              <div>
                <Button
                  variant="primary"
                  style={{ width: "100%", marginBottom: 12 }}
                  onClick={() => setIsAtDoor(true)}
                >
                  I'm at the door, save location
                </Button>
                <Button
                  variant="secondary"
                  style={{ width: "100%" }}
                  onClick={handleSkipLocation}
                >
                  Skip for now
                </Button>
              </div>
            ) : (
              <div className="setupwizard-location-box">
                <div style={{ color: "var(--text-primary)", marginBottom: 8 }}>
                  Location saved!
                </div>
                <label className="setupwizard-location-label">
                  Name this location (optional)
                </label>
                <input
                  className="setupwizard-location-input"
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g., Front Door, Main Entrance"
                />
              </div>
            )}
          </div>
        )}
        {/* Step 4: Choose Theme */}
        {step === 4 && (
          <div>
            <div className="setupwizard-step-title">Choose Your Theme</div>
            <div className="setupwizard-step-desc">
              Pick colors that make you feel at home
            </div>
            {themeColors.map((theme) => (
              <button
                key={theme.name}
                type="button"
                className={`setupwizard-theme-btn${
                  selectedTheme.name === theme.name ? " selected" : ""
                }`}
                onClick={() => setSelectedTheme(theme)}
              >
                <div className="setupwizard-theme-swatches">
                  <div
                    className="setupwizard-theme-swatch"
                    style={{ background: theme.primary }}
                  />
                  <div
                    className="setupwizard-theme-swatch"
                    style={{ background: theme.secondary }}
                  />
                </div>
                <span>{theme.name}</span>
                {selectedTheme.name === theme.name && (
                  <span className="setupwizard-theme-check">
                    <Check size={16} />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="setupwizard-bottom">
        <Button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          variant="primary"
          style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
        >
          {loading
            ? "Saving..."
            : step === totalSteps
            ? "Complete Setup"
            : "Continue"}
        </Button>
      </div>
    </div>
  );
}
