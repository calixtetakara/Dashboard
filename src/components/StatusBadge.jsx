import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

const BADGE_CONFIG = {
  upcoming: {
    Icon: Clock,
    color: "#ffaa00",
    label: "EN ATTENTE",
    pulse: true,
  },
  success: {
    Icon: CheckCircle2,
    color: "#00ff88",
    label: "SUCCÈS",
    pulse: false,
  },
  failure: {
    Icon: XCircle,
    color: "#ff3366",
    label: "ÉCHEC",
    pulse: false,
  },
  unknown: {
    Icon: AlertTriangle,
    color: "#6b8aaa",
    label: "INCONNU",
    pulse: false,
  },
};

/**
 * @param {boolean|null} success  – true / false / null
 * @param {boolean}      upcoming – mission future
 */
export default function StatusBadge({ success, upcoming }) {
  const key =
    upcoming        ? "upcoming" :
    success === true  ? "success"  :
    success === false ? "failure"  : "unknown";

  const { Icon, color, label, pulse } = BADGE_CONFIG[key];

  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 10px", borderRadius: 3,
        background: `${color}12`,
        border: `1px solid ${color}44`,
        color,
        fontSize: ".7rem",
        fontFamily: "'Orbitron', monospace",
        letterSpacing: ".12em",
      }}
    >
      <Icon
        size={11}
        style={pulse ? { animation: "starPulse 1s ease-in-out infinite" } : {}}
      />
      {label}
    </span>
  );
}
