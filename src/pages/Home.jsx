import { useRef, useState } from "react";
import QuickCheckCard from "../components/QuickCheckCard";
import Button from "../UI/Button";
import { Mascot } from "../components/Mascot";
import "./Home.css";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const quickCheckRef = useRef();
  const [allChecked, setAllChecked] = useState(false);
  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [location.pathname]);

  return (
    <div className="home-root">
      <div className="home-mascot-placeholder">
        <Mascot zen={allChecked} />
      </div>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <Button
          variant="primary"
          onClick={() => {
            if (quickCheckRef.current && quickCheckRef.current.checkAll) {
              quickCheckRef.current.checkAll(true);
            }
          }}
          style={{
            height: "55px",
            width: "100%",
          }}
        >
          All Done
        </Button>
      </div>
      <QuickCheckCard
        ref={quickCheckRef}
        onAlertChange={(alert) => setAllChecked(!alert)}
        session={session}
      />
    </div>
  );
}
