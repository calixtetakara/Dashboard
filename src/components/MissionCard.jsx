import { Link } from "react-router-dom";
import { Calendar, Hash, Layers, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

const pad3 = (n) => String(n).padStart(3, "0");

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });

/**
 * @param {object}   mission  – objet mission SpaceX
 * @param {number}   index    – position dans la grille (pour le stagger)
 */
export default function MissionCard({ mission, index = 0 }) {
  return (
    <div
      className="gd-card bracket fade-up"
      style={{
        padding: 20,
        animationDelay: `${index * 0.06}s`,
        animationFillMode: "both",
      }}
    >
      {/* ── En-tête : numéro + nom + patch ── */}
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", gap: 10, marginBottom: 14,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
            <Hash size={9} color="var(--muted)" />
            <span className="f-mono" style={{ color: "var(--muted)", fontSize: ".65rem" }}>
              {pad3(mission.flight_number)}
            </span>
          </div>
          <h3
            className="f-display"
            style={{
              color: "var(--text)", fontSize: ".8rem",
              lineHeight: 1.3, letterSpacing: ".04em",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}
            title={mission.name}
          >
            {mission.name}
          </h3>
        </div>

        {/* Patch de mission */}
        {mission.links?.patch?.small ? (
          <img
            src={mission.links.patch.small}
            alt={mission.name}
            onError={(e) => (e.target.style.display = "none")}
            style={{
              width: 46, height: 46, objectFit: "contain", flexShrink: 0,
              filter: "drop-shadow(0 0 8px rgba(0,212,255,.4))", opacity: .9,
            }}
          />
        ) : (
          <div
            style={{
              width: 46, height: 46, borderRadius: 3, flexShrink: 0,
              background: "rgba(0,212,255,.06)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Layers size={16} color="var(--muted)" />
          </div>
        )}
      </div>

      {/* ── Badge statut ── */}
      <div style={{ marginBottom: 12 }}>
        <StatusBadge success={mission.success} upcoming={mission.upcoming} />
      </div>

      {/* ── Date ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
        <Calendar size={11} color="var(--cyan)" />
        <span className="f-ui" style={{ color: "var(--muted)", fontSize: ".85rem" }}>
          {fmtDate(mission.date_utc)}
        </span>
      </div>

      {/* ── Description courte ── */}
      {mission.details && (
        <p
          className="f-ui"
          style={{
            color: "var(--muted)", fontSize: ".85rem", lineHeight: 1.5,
            marginBottom: 14,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {mission.details}
        </p>
      )}

      {/* ── CTA ── */}
      <Link
        to={`/mission/${mission.id}`}
        className="gd-btn"
        style={{ width: "100%", justifyContent: "center" }}
      >
        DÉTAILS <ArrowRight size={11} />
      </Link>
    </div>
  );
}
