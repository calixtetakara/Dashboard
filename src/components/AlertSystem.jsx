import { useState, useEffect, useCallback } from "react";
import { Satellite, Radio, Zap, Activity, CheckCircle2, Wifi } from "lucide-react";

// Simule les messages "poussés" par un serveur WebSocket
const ALERT_TEMPLATES = [
  { Icon: Satellite,    msg: "Nouveau lancement détecté — pad LC-39A",          type: "info"    },
  { Icon: Radio,        msg: "Signal reçu : Starship en approche orbite basse",  type: "info"    },
  { Icon: Zap,          msg: "Anomalie moteur signalée — vérification en cours",  type: "warn"    },
  { Icon: Activity,     msg: "Compte à rebours initialisé : T-00:10:00",          type: "info"    },
  { Icon: CheckCircle2, msg: "Satellite GEO-7 mis en orbite avec succès",         type: "success" },
  { Icon: Wifi,         msg: "WebSocket connecté — flux temps réel actif",        type: "success" },
];

const TYPE_COLOR = {
  info:    "#00d4ff",
  warn:    "#ffaa00",
  success: "#00ff88",
};

export default function AlertSystem() {
  const [toasts, setToasts] = useState([]);

  const pushAlert = useCallback(() => {
    const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
    const id = Date.now();
    // Garde max 3 toasts visibles
    setToasts((prev) => [...prev.slice(-2), { ...template, id }]);
    // Auto-suppression après 5.5s
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5600);
  }, []);

  useEffect(() => {
    // Premier toast au chargement (simule la connexion WS)
    const firstTimeout = setTimeout(pushAlert, 2200);
    // Ensuite toutes les ~13 secondes
    const interval = setInterval(pushAlert, 13000);
    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [pushAlert]);

  return (
    <div
      style={{
        position: "fixed", top: 72, right: 16, zIndex: 200,
        display: "flex", flexDirection: "column", gap: 8,
        maxWidth: 340, width: "calc(100vw - 32px)",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        const col = TYPE_COLOR[toast.type] || "#00d4ff";
        return (
          <div
            key={toast.id}
            className="slide-r"
            style={{ pointerEvents: "auto", position: "relative", overflow: "hidden" }}
          >
            {/* Corps du toast */}
            <div
              style={{
                background: "rgba(10,22,40,.97)",
                border: `1px solid ${col}44`,
                boxShadow: `0 4px 24px rgba(0,0,0,.65), 0 0 18px ${col}18`,
                borderRadius: 4, padding: "12px 14px",
                display: "flex", alignItems: "flex-start", gap: 12,
              }}
            >
              {/* Icône */}
              <div
                style={{
                  width: 28, height: 28, borderRadius: 3,
                  background: `${col}14`, border: `1px solid ${col}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <toast.Icon size={13} color={col} />
              </div>

              {/* Texte */}
              <div>
                <p
                  className="f-display"
                  style={{ color: col, fontSize: ".6rem", letterSpacing: ".25em", marginBottom: 3 }}
                >
                  ALERTE MISSION
                </p>
                <p className="f-ui" style={{ color: "var(--text)", fontSize: ".9rem", lineHeight: 1.4 }}>
                  {toast.msg}
                </p>
              </div>
            </div>

            {/* Barre de progression qui se rétrécit */}
            <div
              className="shrink-bar"
              style={{
                position: "absolute", bottom: 0, left: 0,
                height: 2, background: col, borderRadius: "0 0 4px 4px",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
