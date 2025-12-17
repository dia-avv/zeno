import IconBell from "../assets/icons/bell.svg?react";
import "./TopBar.css";

export default function TopBar() {
  return (
    <header className="topbar-root">
      <div className="topbar-left">
        <h2>Zeno</h2>
      </div>
      <div className="topbar-right">
        <IconBell className="topbar-bell" />
      </div>
    </header>
  );
}
