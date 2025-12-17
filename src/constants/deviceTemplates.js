import {
  Flame,
  Lamp,
  Smartphone,
  Coffee,
  Tv,
  Zap,
  Fan,
  Droplet,
} from "lucide-react";

// Shared device templates for AddDeviceModal and SetupWizard
export const deviceTemplates = [
  {
    icon: "flame",
    label: "Hair straightener",
    color: "#3d2a2a",
    IconComponent: Flame,
  },
  { icon: "lamp", label: "Lamp", color: "#3d3a2a", IconComponent: Lamp },
  {
    icon: "smartphone",
    label: "Phone charger",
    color: "#2a2f3d",
    IconComponent: Smartphone,
  },
  {
    icon: "coffee",
    label: "Coffee maker",
    color: "#332a3d",
    IconComponent: Coffee,
  },
  { icon: "tv", label: "TV", color: "#3d2a38", IconComponent: Tv },
  { icon: "iron", label: "Iron", color: "#3d2a2f", IconComponent: Zap },
  { icon: "fan", label: "Fan", color: "#2a3a3d", IconComponent: Fan },
  {
    icon: "heater",
    label: "Space heater",
    color: "#3d302a",
    IconComponent: Droplet,
  },
];
