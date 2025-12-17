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
import AuthPage from "./pages/AuthPage";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [session, setSession] = useState(null);
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

  // Show WelcomeScreen if not logged in and not on /login or /signup
  if (!session) {
    return <WelcomeScreen />;
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
