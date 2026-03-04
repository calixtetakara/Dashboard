export default function LoadingScreen({ text = "ANALYSE EN COURS" }) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "55vh", gap: 24,
      }}
    >
      {/* Radar spinner */}
      <div style={{ position: "relative", width: 72, height: 72 }}>
        {/* Ring extérieur fixe */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2px solid var(--dim)",
        }} />
        {/* Ring extérieur tournant */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2px solid transparent", borderTopColor: "var(--cyan)",
          animation: "radarSpin 1.2s linear infinite",
        }} />
        {/* Ring intérieur tournant inverse */}
        <div style={{
          position: "absolute", inset: 8, borderRadius: "50%",
          border: "1px solid transparent", borderTopColor: "rgba(0,212,255,.5)",
          animation: "radarSpin .8s linear infinite reverse",
        }} />
        {/* Point central */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div
            className="glow-pulse"
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--cyan)", boxShadow: "0 0 16px var(--cyan)",
            }}
          />
        </div>
      </div>

      {/* Texte + dots */}
      <div style={{ textAlign: "center" }}>
        <p
          className="f-display"
          style={{ color: "var(--cyan)", fontSize: ".7rem", letterSpacing: ".35em" }}
        >
          {text}
        </p>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "var(--cyan)",
                animation: `starPulse 1s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
