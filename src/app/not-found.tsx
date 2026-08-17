// No <html> wrapper here (Next.js 16 App Router gotcha — see AGENTS.md).
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: "-0.04em" }}>
        404
      </h1>
      <p style={{ fontSize: 18, opacity: 0.7 }}>
        This page doesn&apos;t exist. Try one of the links above.
      </p>
      <a
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "#8B0000",
          color: "#F5F1E8",
          textDecoration: "none",
          fontWeight: 700,
          letterSpacing: "0.02em",
          marginTop: 16,
        }}
      >
        Back to home
      </a>
    </div>
  );
}