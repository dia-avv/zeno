import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import IconHome from "../assets/icons/home.svg?react";
import IconDevices from "../assets/icons/devices.svg?react";
import IconProfile from "../assets/icons/profile.svg?react";
import IconCommunity from "../assets/icons/community.svg?react";
import "./Navbar.css";

export default function Navbar() {
  const listRef = useRef(null);
  const location = useLocation();
  const [indicatorX, setIndicatorX] = useState(0);

  const updateIndicator = () => {
    const listEl = listRef.current;
    if (!listEl) return;

    const activeLink = listEl.querySelector(".navMenu-link.is-active");
    if (!activeLink) return;

    const navEl = listEl.closest(".navMenu");
    const navRect = navEl.getBoundingClientRect();
    const listRect = listEl.getBoundingClientRect();
    // Prefer centering the indicator under the icon element if available
    const iconEl = activeLink.querySelector(".navMenu-icon");
    let centerX = null;

    if (iconEl) {
      const iconRect = iconEl.getBoundingClientRect();
      centerX = iconRect.left - listRect.left + iconRect.width / 2;
    } else {
      const linkRect = activeLink.getBoundingClientRect();
      centerX = linkRect.left - listRect.left + linkRect.width / 2;
    }

    // Clamp to the list bounds so indicator never goes outside
    const minX = 8; // small inset
    const maxX = listRect.width - 8;
    const clampedX = Math.max(minX, Math.min(maxX, centerX));
    setIndicatorX(clampedX);
  };

  useEffect(() => {
    updateIndicator();
    const timer = setTimeout(updateIndicator, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, []);

  return (
    <nav className="navMenu" aria-label="Primary">
      <ul
        className="navMenu-list"
        ref={listRef}
        style={{ "--indicator-x": `${indicatorX}px` }}
      >
        <li className="navMenu-item">
          <NavLink
            className={({ isActive }) =>
              `navMenu-link${isActive ? " is-active" : ""}`
            }
            to="/"
            end
          >
            <span className="navMenu-icon">
              <IconHome />
            </span>
            <span className="navMenu-label">Home</span>
          </NavLink>
          <span className="navMenu-indicator" aria-hidden="true" />
        </li>

        <li className="navMenu-item">
          <NavLink
            className={({ isActive }) =>
              `navMenu-link${isActive ? " is-active" : ""}`
            }
            to="/devices"
          >
            <span className="navMenu-icon">
              <IconDevices />
            </span>
            <span className="navMenu-label">Devices</span>
          </NavLink>
          <span className="navMenu-indicator" aria-hidden="true" />
        </li>

        <li className="navMenu-item">
          <NavLink
            className={({ isActive }) =>
              `navMenu-link${isActive ? " is-active" : ""}`
            }
            to="/community"
          >
            <span className="navMenu-icon">
              <IconCommunity />
            </span>
            <span className="navMenu-label">Community</span>
          </NavLink>
          <span className="navMenu-indicator" aria-hidden="true" />
        </li>
        <span className="navMenu-indicator" aria-hidden="true" />

        <li className="navMenu-item">
          <NavLink
            className={({ isActive }) =>
              `navMenu-link${isActive ? " is-active" : ""}`
            }
            to="/profiles"
          >
            <span className="navMenu-icon">
              <IconProfile />
            </span>
            <span className="navMenu-label">Profiles</span>
          </NavLink>
          <span className="navMenu-indicator" aria-hidden="true" />
        </li>
      </ul>
    </nav>
  );
}
