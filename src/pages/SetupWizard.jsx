import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Bell, MapPin, Palette, Check } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import Button from "../UI/Button";
import { applyTheme, storeThemeKey } from "../lib/theme";
import RadioCard from "../components/RadioCard";
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
  {
    key: "ocean",
    name: "Ocean Blue",
    primary: "#5b8fb9",
    secondary: "#111c2e",
  },
  {
    key: "forest",
    name: "Forest Green",
    primary: "#6b9b7c",
    secondary: "#1a2e1f",
  },
  {
    key: "sunset",
    name: "Sunset Purple",
    primary: "#9b7cb8",
    secondary: "#241e2e",
  },
  {
    key: "amber",
    name: "Warm Amber",
    primary: "#b89b5b",
    secondary: "#2e271e",
  },
  { key: "rose", name: "Rose Pink", primary: "#b87c9b", secondary: "#2e1e27" },
];

export default function SetupWizard({ onBack, onComplete }) {
  const [step, setStep] = useState(1);
  const [hasReminders, setHasReminders] = useState(true);
  const [isAtDoor, setIsAtDoor] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themeColors[0]);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const totalSteps = 3;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setSaveError(null);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("You must be signed in to finish setup.");

        const payload = {
          id: user.id,
          theme: selectedTheme.key,
          has_reminders: hasReminders,
          location_name: isAtDoor ? locationName : null,
        };

        const { error: upsertError } = await supabase
          .from("accounts")
          .upsert(payload);

        if (upsertError) throw upsertError;

        onComplete?.(payload);
      } catch (e) {
        setSaveError(e?.message ?? "Failed to save setup.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSkipLocation = () => {
    setIsAtDoor(false);
    setStep(step + 1);
  };

  const canProceed = () => {
    if (step === 2 && isAtDoor) return locationName.trim().length > 0;
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
        {/* Step 1: Set Reminders */}
        {step === 1 && (
          <div>
            <div className="setupwizard-step-title">
              Enable Daily Reminders?
            </div>
            <div className="setupwizard-step-desc">
              Get gentle notifications to check your devices before leaving home
            </div>
            <RadioCard
              selected={hasReminders}
              onSelect={() => setHasReminders(true)}
              className={`setupwizard-reminder-btn${
                hasReminders ? " selected" : ""
              }`}
              trailing={hasReminders ? <Check size={16} /> : null}
              style={{ width: "100%", marginBottom: 8 }}
            >
              Yes, remind me daily
            </RadioCard>
            <RadioCard
              selected={!hasReminders}
              onSelect={() => setHasReminders(false)}
              className={`setupwizard-reminder-btn${
                !hasReminders ? " selected" : ""
              }`}
              trailing={!hasReminders ? <Check size={16} /> : null}
              style={{ width: "100%" }}
            >
              No, I'll check manually
            </RadioCard>
          </div>
        )}
        {/* Step 2: Set Location */}
        {step === 2 && (
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
        {/* Step 3: Choose Theme */}
        {step === 3 && (
          <div>
            <div className="setupwizard-step-title">Choose Your Theme</div>
            <div className="setupwizard-step-desc">
              Pick colors that make you feel at home
            </div>
            {themeColors.map((theme) => {
              const selected = selectedTheme.name === theme.name;
              return (
                <RadioCard
                  key={theme.name}
                  selected={selected}
                  onSelect={() => {
                    setSelectedTheme(theme);
                    applyTheme(theme.key);
                    storeThemeKey(theme.key);
                  }}
                  className={`setupwizard-theme-btn${
                    selected ? " selected" : ""
                  }`}
                  leading={
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
                  }
                  trailing={selected ? <Check size={16} /> : null}
                  style={{ width: "100%", marginBottom: 8 }}
                >
                  {theme.name}
                </RadioCard>
              );
            })}
          </div>
        )}
      </div>
      <div className="setupwizard-bottom">
        {saveError ? (
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
            {saveError}
          </div>
        ) : null}
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
