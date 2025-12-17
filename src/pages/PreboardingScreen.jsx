import React, { useState } from "react";
import ShieldIcon from "../assets/icons/shield.svg?react";
import PaletteIcon from "../assets/icons/palette.svg?react";
import TrophyIcon from "../assets/icons/trophy.svg?react";
import UsersIcon from "../assets/icons/users.svg?react";
import { ChevronRight } from "lucide-react";
import Button from "../UI/Button";
import "./PreboardingScreen.css";

const slides = [
  {
    icon: ShieldIcon,
    title: "Keep Your Home Safe",
    description:
      "Never worry about leaving devices on again. Monitor your hair straighteners, lamps, coffee makers, and more.",
    color: "var(--accent-blue)",
  },
  {
    icon: PaletteIcon,
    title: "Make It Yours",
    description:
      "Personalize the app with your favorite theme colors and create a cozy experience that feels like home.",
    color: "var(--accent-blue)",
  },
  {
    icon: TrophyIcon,
    title: "Build Your Streak",
    description:
      "Check off devices daily and earn prizes to decorate your little house companion. The longer your streak, the cozier your home!",
    color: "var(--accent-blue)",
  },
  {
    icon: UsersIcon,
    title: "Compete & Connect",
    description:
      "Live with someone? Turn safety into a friendly competition. Who protects the house the most?",
    color: "var(--accent-blue)",
  },
];

export default function PreboardingScreen({ onComplete }) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else onComplete();
  };
  const skip = () => onComplete();

  return (
    <div className="preboarding-root">
      <div className="preboarding-skip-row">
        <button className="preboarding-skip" onClick={skip}>
          Skip
        </button>
      </div>
      <div className="preboarding-slide">
        <div
          className="preboarding-icon"
          style={{ background: "var(--bg-surface)" }}
        >
          {React.createElement(slides[current].icon, {
            width: 48,
            height: 48,
            style: { color: slides[current].color },
          })}
        </div>
        <h1 className="preboarding-title">{slides[current].title}</h1>
        <p className="preboarding-desc">{slides[current].description}</p>
      </div>
      <div className="preboarding-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={
              i === current ? "preboarding-dot active" : "preboarding-dot"
            }
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      <Button
        className="preboarding-next"
        onClick={next}
        variant="primary"
        style={{ width: "100%", maxWidth: 320, margin: "20px auto 0 auto" }}
        icon={<ChevronRight size={28} style={{ marginLeft: 8 }} />}
      >
        {current < slides.length - 1 ? "Next" : "Get Started"}
      </Button>
    </div>
  );
}
