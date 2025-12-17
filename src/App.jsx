import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import AddDevice from "./pages/AddDevice";
import Profiles from "./pages/Profile";
import Community from "./pages/Community";
import Navbar from "./components/NavBar";
import TopBar from "./components/TopBar";
import WelcomeScreen from "./pages/WelcomeScreen";
import PreboardingScreen from "./pages/PreboardingScreen";
import SetupWizard from "./pages/SetupWizard";
import AuthPage from "./pages/AuthPage";
import { supabase } from "./lib/supabaseClient";
import {
  applyTheme,
  getStoredThemeKey,
  normalizeThemeKey,
  storeThemeKey,
} from "./lib/theme";

function App() {
  // All hooks at the top
  const [sessionChecked, setSessionChecked] = useState(false);
  const [session, setSession] = useState(null);
  const [accountChecked, setAccountChecked] = useState(false);
  const [account, setAccount] = useState(null);
  const [setupJustCompleted, setSetupJustCompleted] = useState(false);
  const [preboarded, setPreboarded] = useState(() => {
    return localStorage.getItem("preboarded") === "true";
  });
  const location = useLocation();
  const navigate = useNavigate();

  const inferredSetupComplete =
    !!account &&
    (account.setup_complete === true ||
      (account.has_reminders !== null && account.has_reminders !== undefined));
  const setupComplete = setupJustCompleted || inferredSetupComplete;

  // Default theme for signed-out screens (Welcome/Preboarding/Auth)
  useEffect(() => {
    applyTheme("ocean");
  }, []);

  // Handle GitHub Pages redirect param for deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      // Remove ?redirect= from URL and navigate using React Router
      window.history.replaceState(
        {},
        "",
        window.location.pathname.replace(/\/$/, "")
      );
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionChecked(true);

      // If already signed in, apply last known theme immediately
      if (session?.user) {
        applyTheme(getStoredThemeKey());
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        // Reset theme on logout so WelcomeScreen is always default
        if (!session?.user) {
          applyTheme("ocean");
          storeThemeKey("ocean");
        } else {
          applyTheme(getStoredThemeKey());
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch the signed-in user's account record (drives setup completion + theme)
  useEffect(() => {
    const userId = session?.user?.id;

    // reset per-user state
    setSetupJustCompleted(false);

    if (!userId) {
      setAccount(null);
      setAccountChecked(true);
      return;
    }

    let cancelled = false;
    setAccountChecked(false);

    (async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Failed to fetch account:", error);
        setAccount(null);
        setAccountChecked(true);
        return;
      }

      setAccount(data ?? null);
      setAccountChecked(true);

      // Sync theme from account row (and persist locally)
      const themeKey = normalizeThemeKey(data?.theme);
      applyTheme(themeKey);
      storeThemeKey(themeKey);
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  // SetupWizard redirect after login for new users
  useEffect(() => {
    if (
      session &&
      accountChecked &&
      !setupComplete &&
      location.pathname !== "/setup"
    ) {
      navigate("/setup", { replace: true });
    }
  }, [session, accountChecked, setupComplete, location.pathname, navigate]);

  // Show nothing until session and account are checked
  if (!sessionChecked) return null;
  if (session && !accountChecked) return null;

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
          window.location.href = "/zeno/signup";
        }}
      />
    );
  }

  // Show SetupWizard after login for new accounts (account-based, not device-based)
  if (session && !setupComplete) {
    return (
      <SetupWizard
        onComplete={(updatedAccount) => {
          if (updatedAccount) setAccount(updatedAccount);
          setSetupJustCompleted(true);
          navigate("/", { replace: true });
        }}
        onBack={() => navigate("/", { replace: true })}
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
          path="/preboarding"
          element={
            <PreboardingScreen
              onComplete={() => {
                localStorage.setItem("preboarded", "true");
                setPreboarded(true);
                window.location.href = "/zeno/signup";
              }}
            />
          }
        />
        <Route
          path="/setup"
          element={
            session && !setupComplete ? (
              <SetupWizard
                onComplete={(updatedAccount) => {
                  if (updatedAccount) setAccount(updatedAccount);
                  window.location.href = "/zeno/";
                }}
                onBack={() => (window.location.href = "/zeno/")}
              />
            ) : (
              <Home />
            )
          }
        />
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
