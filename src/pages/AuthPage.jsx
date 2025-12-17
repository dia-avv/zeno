import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AuthPage.css";
import Button from "../UI/Button";
import TextInput from "../UI/TextInput";
import PasswordInput from "../UI/PasswordInput";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ onBack }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate("/", { replace: true });
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSwitch = () => {
    setMode(mode === "login" ? "signup" : "login");
    resetFields();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
    }
  };

  return (
    <div className="auth-root">
      <Button
        variant="secondary"
        onClick={onBack}
        style={{ marginBottom: 24, alignSelf: "flex-start" }}
        className="btn btn--primary btn--no-flex"
      >
        ← Back
      </Button>
      <div className="auth-box">
        <h2>{mode === "login" ? "Log In" : "Create Account"}</h2>
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          )}
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" variant="primary" style={{ marginTop: 8 }}>
            {mode === "login" ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <div className="auth-switch">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button onClick={handleSwitch}>Sign up</button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={handleSwitch}>Log in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
