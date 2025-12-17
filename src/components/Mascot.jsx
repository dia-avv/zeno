import zenHouse from "../assets/zen-house.webp";
import stressedHouse from "../assets/stressed-house.webp";

export function Mascot({ zen }) {
  return (
    <img
      src={zen ? zenHouse : stressedHouse}
      alt={zen ? "Zen mascot" : "Stressed mascot"}
      fetchPriority="high"
    />
  );
}
