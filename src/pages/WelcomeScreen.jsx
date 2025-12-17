import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Button from "../UI/Button";
import { WaitingMascot } from "../components/WaitingMascot";
import "./WelcomeScreen.css";

export default function WelcomeScreen({ onComplete }) {
  const navigate = useNavigate();

  // Session check is handled in App.jsx
  const handleGetStarted = () => {
    if (onComplete) onComplete();
    else navigate("/preboarding");
  };

  return (
    <div className="welcome-root">
      <div className="welcome-mascot">
        <WaitingMascot />
      </div>
      <h1 className="welcome-title">Welcome to Zeno!</h1>
      <p className="welcome-desc">
        Never worry about leaving devices on again. Your peaceful home companion
        is here to help.
      </p>
      <ul className="welcome-features">
        <li>✓ Quick daily safety checks</li>
        <li>🏠 Personalized device reminders</li>
        <li>😌 Peace of mind, anywhere</li>
      </ul>
      <Button
        variant="primary"
        onClick={handleGetStarted}
        style={{ marginTop: 16, minWidth: "100%" }}
        className="btn btn--primary btn--no-flex"
      >
        Get Started
      </Button>
    </div>
  );
}
