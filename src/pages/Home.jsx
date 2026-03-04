import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, AlertTriangle, Target, Rocket, CheckCircle2, XCircle, Clock } from "lucide-react";
import MissionCard from "../components/MissionCard";
import LoadingScreen from "../components/LoadingScreen";

// ── Carte statistique ────────────────────────────────────────
function StatCard({ Icon, label, value, color, delay = 0 }) {
  return (
    <div
      className="gd-card fade-up"
      style={{ padding: "16px 20px", animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: 3,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `${color}12`, border: `1px solid ${color}33`,
          }}
        >
          <Icon size={13} color={color} />
        </div>
        <span
          className="f-ui"
          style={{ color: "var(--muted)", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase" }}
        >
          {label}
        </span>
      </div>
      <p
        className="f-display"
        style={{ fontSize: "1.9rem", color, textShadow: `0 0 22px ${color}66` }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Squelette de chargement ──────────────────────────────────
function SkeletonCard() {
  const bar = (h, w, mb = 0) => (
    <div className="shimmer-bg" style={{ height: h, width: w, marginBottom: mb, borderRadius: 4 }} />
  );
  return (
    <div className="gd-card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>{bar(10, 60, 8)}{bar(16, 140)}</div>
        <div className="shimmer-bg" style={{ width: 46, height: 46, borderRadius: "50%" }} />
      </div>
      {bar(22, 80, 14)}{bar(10, "100%", 6)}{bar(10, "70%", 20)}{bar(34, "100%")}
    </div>
  );
}

const FILTERS = [
  { key: "all",      label: "TOUT"       },
  { key: "success",  label: "SUCCÈS"     },
  { key: "failure",  label: "ÉCHEC"      },
  { key: "upcoming", label: "EN ATTENTE" },
];

export default function Home() {
  const [missions, setMissions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");

  // ── Appel API REST ───────────────────────────────────────
  const loadMissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://api.spacexdata.com/v4/launches");
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const data = await res.json();
      // 24 dernières missions, plus récentes en premier
      const sorted = data.reverse(); // plus récentes en premier

const success = sorted
  .filter(m => m.success === true)
  .slice(0, 6);

const failure = sorted
  .filter(m => m.success === false)
  .slice(0, 1);
const upcoming = data
  .filter(m => m.upcoming === true)
  .slice(0, 3); // nombre que tu veux afficher


setMissions([...success, ...failure, ...upcoming]);
;
    } catch (err) {
      setError("Impossible de contacter la base de données SpaceX.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMissions(); }, [loadMissions]);


  // ── Filtrage local ───────────────────────────────────────
  const shown = missions.filter((m) => {
    const matchFilter =
      filter === "all"      ? true :
      filter === "success"  ? m.success === true  :
      filter === "failure"  ? m.success === false :
      filter === "upcoming" ? !!m.upcoming         : true;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total:   missions.length,
    success: missions.filter((m) => m.success === true).length,
    failure: missions.filter((m) => m.success === false).length,
    pending: missions.filter((m) => m.upcoming).length,
  };

  return (
    <div className="gd-grid-bg" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 20px 80px" }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{ position: "relative", textAlign: "center", padding: "52px 0 44px", overflow: "hidden" }}>
        <div className="scan-line" />
        <p
          className="f-display fade-up"
          style={{
            color: "var(--cyan)", fontSize: ".65rem", letterSpacing: ".45em",
            marginBottom: 14, animationDelay: ".08s", animationFillMode: "both",
          }}
        >
          MISSION CONTROL — SYSTÈME ACTIF
        </p>
        <h1
          className="f-display fade-up"
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 900,
            color: "var(--text)", lineHeight: 1.1, marginBottom: 14,
            textShadow: "0 0 60px rgba(0,212,255,.12)",
            animationDelay: ".18s", animationFillMode: "both",
          }}
        >
          GALACTIC<br />
          <span style={{ color: "var(--cyan)", textShadow: "0 0 40px rgba(0,212,255,.75)" }}>
            DASHBOARD
          </span>
        </h1>
        <p
          className="f-ui fade-up"
          style={{
            color: "var(--muted)", fontSize: "1.05rem",
            maxWidth: 480, margin: "0 auto",
            animationDelay: ".28s", animationFillMode: "both",
          }}
        >
          Suivi en temps réel des missions SpaceX · Données live via API REST
        </p>
      </div>

      {/* ── Stats ────────────────────────────────────────── */}
      <div
        style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12, marginBottom: 32,
        }}
      >
        <StatCard Icon={Rocket}       label="Missions"    value={stats.total}   color="#00d4ff" delay={.05} />
        <StatCard Icon={CheckCircle2} label="Succès"      value={stats.success} color="#00ff88" delay={.10} />
        <StatCard Icon={XCircle}      label="Échecs"      value={stats.failure} color="#ff3366" delay={.15} />
        <StatCard Icon={Clock}        label="En attente"  value={stats.pending} color="#ffaa00" delay={.20} />
      </div>

      {/* ── Filtres + Recherche ───────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18, alignItems: "center" }}>
        {/* Champ de recherche */}
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search
            size={14} color="var(--muted)"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
          <input
            className="gd-input"
            placeholder="Rechercher une mission…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Boutons de filtre */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`gd-ghost${filter === f.key ? " on" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button className="gd-btn" onClick={loadMissions} disabled={loading} style={{ flexShrink: 0 }}>
          <RefreshCw size={12} style={loading ? { animation: "radarSpin 1s linear infinite" } : {}} />
          {loading ? "…" : "REFRESH"}
        </button>
      </div>

      {/* Compteur */}
      <p className="f-ui" style={{ color: "var(--muted)", fontSize: ".85rem", marginBottom: 16 }}>
        <span style={{ color: "var(--cyan)", fontWeight: 700 }}>{shown.length}</span> mission(s) affichée(s)
      </p>

      {/* ── Grille de missions ────────────────────────────── */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <AlertTriangle size={40} color="var(--nova)" style={{ margin: "0 auto 16px" }} />
          <p className="f-display" style={{ color: "var(--nova)", fontSize: ".8rem", letterSpacing: ".1em", marginBottom: 12 }}>
            {error}
          </p>
          <button className="gd-btn" onClick={loadMissions}>RÉESSAYER</button>
        </div>
      ) : shown.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <Target size={36} color="var(--muted)" style={{ margin: "0 auto 16px" }} />
          <p className="f-display" style={{ color: "var(--muted)", fontSize: ".75rem", letterSpacing: ".2em" }}>
            AUCUNE MISSION TROUVÉE
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {shown.map((m, i) => (
            <MissionCard key={m.id} mission={m} index={i} />
          ))}
        </div>
      )}

      {/* ── Ticker défilant ───────────────────────────────── */}
      {!loading && missions.length > 0 && (
        <div
          style={{
            marginTop: 52,
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            padding: "10px 0",
          }}
        >
          <div className="gd-ticker-wrap">
            <div className="gd-ticker-inner">
              {[...missions, ...missions].map((m, i) => (
                <span
                  key={i}
                  className="f-mono"
                  style={{
                    color: "var(--muted)", fontSize: ".7rem",
                    flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 8,
                  }}
                >
                  <span style={{ color: "var(--cyan)" }}>◆</span>
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
