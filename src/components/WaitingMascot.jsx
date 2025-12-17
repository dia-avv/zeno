import waitingMascot from "../assets/waiting-house.webp";

export function WaitingMascot() {
  return (
    <img
      src={waitingMascot}
      fetchPriority="high"
      alt="Waiting mascot"
      className="devices-waiting-mascot"
      style={{
        width: 300,
        height: 300,
        display: "block",
      }}
    />
  );
}
