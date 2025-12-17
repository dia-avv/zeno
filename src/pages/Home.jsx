import { useRef, useState } from "react";
import QuickCheckCard from "../components/QuickCheckCard";
import Button from "../UI/Button";
import { Mascot } from "../components/Mascot";
import "./Home.css";

export default function Home() {
  const quickCheckRef = useRef();
  const [allChecked, setAllChecked] = useState(false);
  return (
    <div className="home-root">
      <div className="home-mascot-placeholder">
        <Mascot zen={allChecked} />
      </div>
      <QuickCheckCard
        ref={quickCheckRef}
        onAlertChange={(alert) => setAllChecked(!alert)}
      />
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Button
          variant="primary"
          onClick={() => {
            if (quickCheckRef.current && quickCheckRef.current.checkAll) {
              quickCheckRef.current.checkAll(true);
            }
          }}
          style={{
            height: "55px",
            backgroundColor: "var(--accent-blue)",
            width: "100%",
          }}
        >
          All Done
        </Button>
      </div>
    </div>
  );
}
