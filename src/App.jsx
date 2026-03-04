import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar      from "./components/Navbar";
import StarField   from "./components/StarField";
import AlertSystem from "./components/AlertSystem";
import Home        from "./pages/Home";
import MissionDetail from "./pages/MissionDetail";

export default function App() {
  return (
    <Router>
      {/* ── Fond étoilé (fixed, z-index 0) ── */}
      <StarField />

      {/* ── Overlay scanlines (ambiance CRT) ── */}
      <div className="gd-scanlines" />

      {/* ── Notifications temps réel (WebSocket simulé) ── */}
      <AlertSystem />

      {/* ── Barre de navigation fixe ── */}
      <Navbar />

      {/* ── Contenu principal ── */}
      <main style={{ position: "relative", zIndex: 10, paddingTop: 60 }}>
        <Routes>
          {/* Liste des missions */}
          <Route path="/" element={<Home />} />

          {/* Détail d'une mission — :id est le paramètre dynamique */}
          <Route path="/mission/:id" element={<MissionDetail />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div
                style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  minHeight: "70vh", textAlign: "center", padding: "0 20px",
                }}
              >
                <p
                  className="f-display"
                  style={{
                    fontSize: "6rem", fontWeight: 900, color: "var(--cyan)",
                    textShadow: "0 0 40px var(--cyan)", marginBottom: 12,
                    animation: "starPulse 2s ease-in-out infinite",
                  }}
                >
                  404
                </p>
                <p className="f-display" style={{ color: "var(--muted)", fontSize: ".9rem", letterSpacing: ".2em" }}>
                  SIGNAL PERDU DANS L'ESPACE
                </p>
              </div>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}
