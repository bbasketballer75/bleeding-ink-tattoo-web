/**
 * PortfolioCard — one tile in the /portfolio grid.
 *
 * Renders an inline SVG (no licensing needed for demo) + style tags.
 */

import { BLEED_RED, BONE_WHITE } from "@/lib/constants";
import type { PortfolioPiece } from "@/types";
import TattooSVG from "./TattooSVG";

interface PortfolioCardProps {
  piece: PortfolioPiece;
}

export default function PortfolioCard({ piece }: PortfolioCardProps) {
  return (
    <article
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        background: BONE_WHITE,
        color: "#0A0A0A",
        overflow: "hidden",
      }}
    >
      {/* Image area — real photo if available, else SVG portrait */}
      <div
        style={{
          aspectRatio: "1 / 1",
          width: "100%",
          background: piece.imageUrl
            ? "#0A0A0A"
            : `linear-gradient(135deg, ${piece.accent}22 0%, #0A0A0A 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: piece.imageUrl ? 0 : 24,
          overflow: "hidden",
        }}
      >
        {piece.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={piece.imageUrl}
            alt={`${piece.title} — ${piece.style} tattoo by ${
              piece.artist === "isiah-jackson" ? "Isiah Jackson" : "Courtney Fetzer"
            }`}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <TattooSVG style={piece.svgStyle} accent={piece.accent} />
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: BONE_WHITE,
              background: BLEED_RED,
              borderRadius: 2,
            }}
          >
            {piece.style}
          </span>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#0A0A0A",
              background: "rgba(10, 10, 10, 0.08)",
              borderRadius: 2,
            }}
          >
            {piece.placement}
          </span>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#0A0A0A",
              background: "rgba(10, 10, 10, 0.08)",
              borderRadius: 2,
            }}
          >
            {piece.sizeInches}"
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            margin: 0,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
          }}
        >
          {piece.title}
        </h3>

        <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, opacity: 0.75 }}>
          {piece.description}
        </p>
      </div>
    </article>
  );
}