import Button from "../UI/Button";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("preboarded"); // Optional: reset onboarding
    navigate("/", { replace: true });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Profile</h2>
      <Button
        variant="secondary"
        onClick={handleLogout}
        style={{ marginTop: 24 }}
      >
        Log out
      </Button>
    </div>
  );
}
