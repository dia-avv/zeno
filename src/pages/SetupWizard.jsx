import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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

  // ...UI code (same as your previous SetupWizard, using Button for actions)...
  // For brevity, not included here. Plug in your UI from before.

  return (
    <div className="setupwizard-root">
      {/* ...existing wizard UI... */}
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
  );
}
