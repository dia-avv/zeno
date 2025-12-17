import {
  X,
  Flame,
  Lamp,
  Smartphone,
  Coffee,
  Tv,
  Zap,
  Fan,
  Droplet,
} from "lucide-react";

export default function DeviceIcon({ icon, size = 20, bgColor }) {
  // Icon map matching AddDeviceModal templates
  const iconMap = {
    flame: Flame,
    lamp: Lamp,
    smartphone: Smartphone,
    coffee: Coffee,
    tv: Tv,
    iron: Zap,
    fan: Fan,
    heater: Droplet,
  };

  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    return <span style={{ fontSize: size }}>●</span>;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      strokeWidth={1.5}
      color="var(--grey)"
      aria-hidden
    />
  );
}
