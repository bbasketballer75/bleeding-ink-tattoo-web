"use client";

/**
 * Portfolio client component — handles style filter state.
 */

import { useState } from "react";
import { PORTFOLIO, PORTFOLIO_STYLES } from "@/data/portfolio";
import { BLEED_RED, BONE_WHITE } from "@/lib/constants";
import PortfolioCard from "./PortfolioCard";

export default function PortfolioGrid() {
  const [filter, setFilter] = useState<string | null>(null);
  const visible = filter
    ? PORTFOLIO.filter((p) => p.style === filter)
    : PORTFOLIO;

  return (
    <>
      {/* Style filter */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          marginBottom: 48,
        }}
      >
        <button
          type="button"
          onClick={() => setFilter(null)}
          style={{
            padding: "8px 16px",
            background: filter === null ? BLEED_RED : "transparent",
            color: filter === null ? BONE_WHITE : BONE_WHITE,
            border: `2px solid ${filter === null ? BLEED_RED : "rgba(245, 241, 232, 0.3)"}`,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: 2,
            transition: "all 0.15s ease",
          }}
        >
          All ({PORTFOLIO.length})
        </button>
        {PORTFOLIO_STYLES.map((style) => {
          const count = PORTFOLIO.filter((p) => p.style === style).length;
          const active = filter === style;
          return (
            <button
              key={style}
              type="button"
              onClick={() => setFilter(style)}
              style={{
                padding: "8px 16px",
                background: active ? BLEED_RED : "transparent",
                color: BONE_WHITE,
                border: `2px solid ${active ? BLEED_RED : "rgba(245, 241, 232, 0.3)"}`,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 2,
                transition: "all 0.15s ease",
              }}
            >
              {style} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: BONE_WHITE,
            opacity: 0.6,
            fontSize: 16,
            padding: "60px 20px",
          }}
        >
          No pieces in this style yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {visible.map((piece) => (
            <PortfolioCard key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    </>
  );
}