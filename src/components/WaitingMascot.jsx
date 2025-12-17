import waitingMascot from "../assets/waiting-house.png";

export function WaitingMascot() {
  return (
    <img
      src={waitingMascot}
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
