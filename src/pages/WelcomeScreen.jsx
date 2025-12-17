import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./WelcomeScreen.css";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="welcome-root">
      <div className="welcome-mascot">
        <div className="mascot-house">
          <div className="mascot-roof" />
          <div className="mascot-body" />
          <div className="mascot-door" />
          <div className="mascot-eyes" />
          <div className="mascot-smile" />
        </div>
      </div>
      <h1 className="welcome-title">Welcome to SafeHome</h1>
      <p className="welcome-desc">
        Never worry about leaving devices on again. Your peaceful home companion
        is here to help.
      </p>
      <ul className="welcome-features">
        <li>✓ Quick daily safety checks</li>
        <li>🏠 Personalized device reminders</li>
        <li>😌 Peace of mind, anywhere</li>
      </ul>
      <button className="welcome-btn" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
}
