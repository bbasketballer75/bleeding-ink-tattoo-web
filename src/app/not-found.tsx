// No <html> wrapper here (Next.js 16 App Router gotcha — see AGENTS.md).
import Link from "next/link";
import { BLEED_RED, BONE_WHITE } from "@/lib/constants";

const QUICK_LINKS = [
  { href: "/portfolio", label: "Portfolio", desc: "Recent work" },
  { href: "/book", label: "Book a Session", desc: "Free consultation" },
  { href: "/artists", label: "Artists", desc: "Meet Isiah + Courtney" },
  { href: "/aftercare", label: "Aftercare", desc: "How to heal your tattoo" },
];

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "60px 24px",
        textAlign: "center",
      }}
    >
      {/* Big drips */}
      <svg
        aria-hidden
        viewBox="0 0 80 120"
        style={{ width: 56, height: 84, fill: BLEED_RED, opacity: 0.6 }}
      >
        <path d="M40 0 C40 0 80 50 80 80 C80 100 62 120 40 120 C18 120 0 100 0 80 C0 50 40 0 40 0 Z" />
      </svg>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: BLEED_RED,
          margin: 0,
        }}
      >
        Error 404
      </p>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(64px, 14vw, 160px)",
          textTransform: "uppercase",
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
          margin: 0,
        }}
      >
        Lost in the ink
      </h1>

      <p style={{ fontSize: 18, opacity: 0.7, maxWidth: 460, margin: 0 }}>
        That page doesn't exist — or it bled out. Try one of these instead.
      </p>

      {/* Quick-link grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          width: "100%",
          maxWidth: 640,
          marginTop: 16,
        }}
      >
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "block",
              padding: "16px 18px",
              background: "rgba(245, 241, 232, 0.04)",
              border: "1px solid rgba(245, 241, 232, 0.12)",
              borderLeft: `4px solid ${BLEED_RED}`,
              color: BONE_WHITE,
              textDecoration: "none",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{link.label}</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>{link.desc}</div>
          </Link>
        ))}
      </div>

      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "14px 28px",
          marginTop: 16,
          background: BLEED_RED,
          color: BONE_WHITE,
          textDecoration: "none",
          fontWeight: 700,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          fontSize: 14,
        }}
      >
        Back to home →
      </Link>
    </div>
  );
}