import zenHouse from "../assets/zen-house.png";
import stressedHouse from "../assets/stressed-house.png";

export function Mascot({ zen }) {
  return (
    <img
      src={zen ? zenHouse : stressedHouse}
      alt={zen ? "Zen mascot" : "Stressed mascot"}
    />
  );
}
