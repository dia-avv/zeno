import DeviceIcon from "../UI/DeviceIcon";
import AnimatedCheckbox from "../UI/AnimatedCheckbox";

export default function CheckListItem({ item, onToggle }) {
  return (
    <div className="qccard-item">
      <div className="qccard-iconbox" style={{ background: item.color }}>
        <DeviceIcon icon={item.icon} />
      </div>
      <div className="qccard-info">
        <div className="qccard-device">{item.device}</div>
        <div className="qccard-room">{item.room}</div>
      </div>
      <AnimatedCheckbox
        checked={item.checked}
        onClick={() => onToggle(item.id)}
      />
    </div>
  );
}
