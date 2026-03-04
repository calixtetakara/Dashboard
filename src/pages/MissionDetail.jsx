import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft, Star, StarOff, Hash, Calendar,
  TrendingUp, FileText, Play, BookOpen, Globe,
  ExternalLink, AlertTriangle, Layers,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import LoadingScreen from "../components/LoadingScreen";

const pad3    = (n)     => String(n).padStart(3, "0");
const fmtDate = (iso, opts) => new Date(iso).toLocaleDateString("fr-FR", opts);

// ── Carte méta (N° vol, Date, Statut) ───────────────────────
function MetaCard({ Icon, label, value, color }) {
  return (
    <div className="gd-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
      <Icon size={15} color={color} />
      <div>
        <p
          className="f-ui"
          style={{ color: "var(--muted)", fontSize: ".75rem", letterSpacing: ".08em", textTransform: "uppercase" }}
        >
          {label}
        </p>
        <p className="f-mono" style={{ color, fontSize: ".9rem", marginTop: 2 }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function MissionDetail() {
  const { id } = useParams(); // ← hook React Router pour lire l'ID dans l'URL

  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [isFav,   setIsFav]   = useState(false);

  // ── Appel API ciblé sur UNE mission ─────────────────────
  useEffect(() => {
    const fetchMission = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://api.spacexdata.com/v4/launches/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setMission(await res.json());
      } catch (err) {
        setError("Impossible de charger les détails de cette mission.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]); // ← re-déclenche si l'ID change dans l'URL

  // ── États de rendu conditionnel ──────────────────────────
  if (loading) return <LoadingScreen text="RÉCUPÉRATION TÉLÉMÉTRIQUE" />;

  if (error) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <AlertTriangle size={36} color="var(--nova)" style={{ margin: "0 auto 16px" }} />
      <p className="f-display" style={{ color: "var(--nova)", fontSize: ".8rem", marginBottom: 16 }}>{error}</p>
      <Link to="/" className="gd-btn">← RETOUR</Link>
    </div>
  );

  const fullDate  = fmtDate(mission.date_utc, { weekday: "long",  day: "numeric",  month: "long",    year: "numeric" });
  const shortDate = fmtDate(mission.date_utc, { day: "2-digit", month: "2-digit", year: "numeric" });

  const statusColor = mission.success ? "var(--plasma)" : mission.upcoming ? "var(--amber)" : "var(--nova)";
  const statusLabel = mission.success ? "Succès" : mission.upcoming ? "En attente" : "Échec";

  const metaItems = [
    { Icon: Hash,       label: "N° de vol", value: `#${pad3(mission.flight_number)}`, color: "var(--cyan)"  },
    { Icon: Calendar,   label: "Date",       value: shortDate,                         color: "var(--text)"  },
    { Icon: TrendingUp, label: "Statut",     value: statusLabel,                       color: statusColor    },
  ];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 20px 80px" }}>

      {/* ── Retour ──────────────────────────────────────── */}
      <Link
        to="/"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          color: "var(--cyan)", fontFamily: "'Rajdhani', sans-serif",
          fontSize: "1rem", textDecoration: "none",
          marginBottom: 24, transition: "gap .2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.gap = "14px")}
        onMouseLeave={(e) => (e.currentTarget.style.gap = "8px")}
      >
        <ChevronLeft size={16} /> Retour aux missions
      </Link>

      {/* ── Card héro ───────────────────────────────────── */}
      <div
        className="gd-card fade-up"
        style={{ marginBottom: 14, animationFillMode: "both", position: "relative", overflow: "hidden" }}
      >
        <div className="scan-line" />
        <div style={{ padding: "28px 28px 26px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>

            {/* Patch flottant */}
            <div className="float" style={{ flexShrink: 0 }}>
              {mission.links?.patch?.small ? (
                <div style={{ position: "relative", width: 130, height: 130 }}>
                  <div style={{
                    position: "absolute", inset: -8, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(0,212,255,.1) 0%, transparent 70%)",
                  }} />
                  <img
                    src={mission.links.patch.small}
                    alt={mission.name}
                    onError={(e) => (e.target.style.display = "none")}
                    style={{
                      width: 130, height: 130, objectFit: "contain",
                      filter: "drop-shadow(0 0 20px rgba(0,212,255,.5))",
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  width: 130, height: 130, borderRadius: "50%",
                  border: "1.5px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Layers size={36} color="var(--muted)" />
                </div>
              )}
            </div>

            {/* Infos principales */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="f-display"
                style={{ color: "var(--muted)", fontSize: ".6rem", letterSpacing: ".4em", marginBottom: 8 }}
              >
                MISSION SPATIALE
              </p>
              <h1
                className="f-display"
                style={{
                  fontSize: "clamp(1.2rem, 4vw, 2rem)", fontWeight: 900,
                  color: "var(--text)", lineHeight: 1.2, marginBottom: 14,
                  textShadow: "0 0 30px rgba(0,212,255,.12)",
                }}
              >
                {mission.name}
              </h1>

              <div style={{ marginBottom: 14 }}>
                <StatusBadge success={mission.success} upcoming={mission.upcoming} />
              </div>

              <p className="f-ui" style={{ color: "var(--muted)", fontSize: "1rem" }}>{fullDate}</p>

              {/* Bouton Favoris (état local — défi bonus du module) */}
              <button
                onClick={() => setIsFav(!isFav)}
                className="gd-btn"
                style={{
                  marginTop: 14,
                  borderColor:   isFav ? "var(--amber)" : "var(--dim)",
                  color:         isFav ? "var(--amber)" : "var(--muted)",
                  background:    isFav ? "rgba(255,170,0,.07)" : "transparent",
                  boxShadow:     isFav ? "0 0 18px rgba(255,170,0,.3)" : "none",
                }}
              >
                {isFav ? <Star size={12} fill="var(--amber)" /> : <StarOff size={12} />}
                {isFav ? "RETIRÉ DES FAVORIS" : "AJOUTER AUX FAVORIS"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grille méta ─────────────────────────────────── */}
      <div
        style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
          gap: 12, marginBottom: 14,
        }}
      >
        {metaItems.map((item) => (
          <MetaCard key={item.label} {...item} />
        ))}
      </div>

      {/* ── Rapport de mission ──────────────────────────── */}
      {mission.details && (
        <div
          className="gd-card fade-up"
          style={{ padding: "22px 24px", marginBottom: 16, animationDelay: ".1s", animationFillMode: "both" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 3,
              background: "rgba(0,212,255,.08)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FileText size={13} color="var(--cyan)" />
            </div>
            <h2
              className="f-display"
              style={{ color: "var(--cyan)", fontSize: ".7rem", letterSpacing: ".2em" }}
            >
              RAPPORT DE MISSION
            </h2>
          </div>
          <p className="f-ui" style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.65 }}>
            {mission.details}
          </p>
        </div>
      )}

      {/* ── Liens externes ──────────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {mission.links?.webcast && (
          <a href={mission.links.webcast} target="_blank" rel="noreferrer" className="gd-btn">
            <Play size={11} /> WEBCAST
          </a>
        )}
        {mission.links?.article && (
          <a href={mission.links.article} target="_blank" rel="noreferrer" className="gd-btn">
            <BookOpen size={11} /> ARTICLE
          </a>
        )}
        {mission.links?.wikipedia && (
          <a href={mission.links.wikipedia} target="_blank" rel="noreferrer" className="gd-btn">
            <Globe size={11} /> WIKIPEDIA <ExternalLink size={9} />
          </a>
        )}
      </div>
    </div>
  );
}
