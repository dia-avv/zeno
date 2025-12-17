import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AuthPage.css";

export default function AuthPage({ onBack }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      <button className="auth-back" onClick={onBack}>
        ← Back
      </button>
      <div className="auth-box">
        <h2>{mode === "login" ? "Log In" : "Create Account"}</h2>
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-submit">
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>
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
