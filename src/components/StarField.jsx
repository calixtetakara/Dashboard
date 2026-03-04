import { useEffect, useRef } from "react";

// Génère les étoiles une seule fois (stable entre renders)
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id:  i,
  x:   (Math.random() * 100).toFixed(1) + "%",
  y:   (Math.random() * 100).toFixed(1) + "%",
  sz:  (Math.random() * 2.2 + 0.5).toFixed(1) + "px",
  dur: (Math.random() * 5 + 2).toFixed(1) + "s",
  dly: (Math.random() * 5).toFixed(1) + "s",
  op:  (Math.random() * 0.5 + 0.1).toFixed(2),
}));

const NEBULAE = [
  { color: "#00d4ff", x: "18%", y: "22%", size: 520 },
  { color: "#00ff88", x: "78%", y: "62%", size: 420 },
  { color: "#ff3366", x: "48%", y: "82%", size: 360 },
];

export default function StarField() {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        pointerEvents: "none", overflow: "hidden",
      }}
    >
      {/* Étoiles */}
      {STARS.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.x, top: s.y,
            width: s.sz, height: s.sz,
            opacity: s.op,
            "--dur": s.dur,
            "--dly": s.dly,
          }}
        />
      ))}

      {/* Nébuleuses ambiantes */}
      {NEBULAE.map((n, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: n.x, top: n.y,
            width: n.size, height: n.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${n.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
            opacity: 0.04,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
