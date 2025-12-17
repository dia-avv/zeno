import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import AddDevice from "./pages/AddDevice";
import Profiles from "./pages/Profile";
import Community from "./pages/Community";
import Navbar from "./components/NavBar";
import TopBar from "./components/TopBar";
import WelcomeScreen from "./pages/WelcomeScreen";
import PreboardingScreen from "./pages/PreboardingScreen";
import AuthPage from "./pages/AuthPage";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [session, setSession] = useState(null);
  const [preboarded, setPreboarded] = useState(() => {
    return localStorage.getItem("preboarded") === "true";
  });
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Show nothing until session is checked
  if (!sessionChecked) return null;

  // Show AuthPage for /login or /signup
  if (!session && ["/login", "/signup"].includes(location.pathname)) {
    return <AuthPage onBack={() => (window.location.href = "/zeno/")} />;
  }

  // Show PreboardingScreen if not preboarded and not logged in
  if (!session && !preboarded && location.pathname === "/preboarding") {
    return (
      <PreboardingScreen
        onComplete={() => {
          localStorage.setItem("preboarded", "true");
          setPreboarded(true);
          window.location.href = "/zeno/login";
        }}
      />
    );
  }

  // Show WelcomeScreen if not preboarded and not logged in and not on /preboarding
  if (!session && !preboarded) {
    return (
      <WelcomeScreen
        onComplete={() => (window.location.href = "/zeno/preboarding")}
      />
    );
  }

  // Show WelcomeScreen if not logged in and preboarded (fallback)
  if (!session && preboarded) {
    return (
      <WelcomeScreen
        onComplete={() => (window.location.href = "/zeno/login")}
      />
    );
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/devices/new" element={<AddDevice />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/community" element={<Community />} />
        <Route
          path="/login"
          element={
            <AuthPage onBack={() => (window.location.href = "/zeno/")} />
          }
        />
        <Route
          path="/signup"
          element={
            <AuthPage onBack={() => (window.location.href = "/zeno/")} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
