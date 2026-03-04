import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Rocket, Wifi, WifiOff, Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [connected,  setConnected]  = useState(true);
  const location = useLocation();

  // Simule des micro-coupures de connexion WebSocket
  useEffect(() => {
    const iv = setInterval(
      () => setConnected((c) => (Math.random() > 0.07 ? true : !c)),
      9000
    );
    return () => clearInterval(iv);
  }, []);

  const isHome   = location.pathname === "/";
  const isDetail = location.pathname.startsWith("/mission/");
  const liveColor = connected ? "var(--plasma)" : "var(--nova)";

  return (
    <nav className="gd-nav">
      <div
        style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 20px",
          height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* ── Logo ── */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ position: "relative", width: 34, height: 34 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "1.5px solid var(--cyan)",
              animation: "radarSpin 8s linear infinite",
            }} />
            <div style={{
              position: "absolute", inset: 4, borderRadius: "50%",
              border: "1px solid rgba(0,212,255,.35)",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Rocket size={14} color="var(--cyan)" />
            </div>
            <div style={{
              position: "absolute", inset: -2, borderRadius: "50%",
              background: "rgba(0,212,255,.14)", filter: "blur(6px)",
            }} />
          </div>
          <div>
            <p
              className="f-display"
              style={{
                color: "var(--cyan)", fontSize: ".75rem",
                letterSpacing: ".25em", lineHeight: 1,
                textShadow: "0 0 16px rgba(0,212,255,.55)",
              }}
            >
              GALACTIC
            </p>
            <p
              className="f-display"
              style={{ color: "var(--muted)", fontSize: ".5rem", letterSpacing: ".4em", lineHeight: 1, marginTop: 2 }}
            >
              DASHBOARD
            </p>
          </div>
        </Link>

        {/* ── Desktop links ── */}
        <div className="gd-desk" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            to="/"
            className="f-display"
            style={{
              fontSize: ".65rem", letterSpacing: ".2em", textDecoration: "none",
              color: isHome ? "var(--cyan)" : "var(--muted)",
              textShadow: isHome ? "0 0 14px var(--cyan)" : "none",
              transition: "all .2s",
            }}
          >
            / MISSIONS
          </Link>

          {isDetail && (
            <span
              className="f-display"
              style={{
                color: "var(--plasma)", fontSize: ".65rem", letterSpacing: ".2em",
                textShadow: "0 0 14px var(--plasma)",
              }}
            >
              / DÉTAIL
            </span>
          )}

          {/* Indicateur LIVE */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "4px 12px", borderRadius: 3,
              background: `${liveColor}0e`,
              border: `1px solid ${liveColor}44`,
            }}
          >
            {connected
              ? <Wifi size={11} color={liveColor} />
              : <WifiOff size={11} color={liveColor} />
            }
            <span
              className="f-display"
              style={{ color: liveColor, fontSize: ".6rem", letterSpacing: ".2em" }}
            >
              {connected ? "LIVE" : "OFFLINE"}
            </span>
            <div
              style={{
                width: 5, height: 5, borderRadius: "50%", background: liveColor,
                animation: "starPulse 1.2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* ── Hamburger mobile ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cyan)", display: "none" }}
          className="gd-ham"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Menu mobile déroulant ── */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(2,12,27,.97)",
            borderTop: "1px solid var(--border)",
            padding: "12px 20px",
          }}
        >
          <Link
            to="/"
            className="f-display"
            style={{
              display: "block", color: "var(--cyan)", fontSize: ".7rem",
              letterSpacing: ".2em", textDecoration: "none",
            }}
            onClick={() => setMenuOpen(false)}
          >
            / MISSIONS
          </Link>
        </div>
      )}
    </nav>
  );
}
