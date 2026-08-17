/**
 * ArtistCard — compact artist preview tile for /artists grid.
 */

import Link from "next/link";
import { BLEED_RED, BONE_WHITE } from "@/lib/constants";
import type { Artist } from "@/types";

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      style={{
        display: "block",
        background: BONE_WHITE,
        color: "var(--color-ink-black)",
        padding: 32,
        textDecoration: "none",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        border: "1px solid rgba(10, 10, 10, 0.1)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-marker)",
          color: BLEED_RED,
          fontSize: 14,
          marginBottom: 8,
          letterSpacing: "0.02em",
        }}
      >
        {artist.role}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 32,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          margin: 0,
          marginBottom: 16,
          lineHeight: 1,
        }}
      >
        {artist.name}
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.5, margin: 0, marginBottom: 20, opacity: 0.85 }}>
        {artist.bio}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {artist.specialties.map((s) => (
          <span
            key={s}
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "4px 10px",
              border: `1px solid ${BLEED_RED}`,
              color: BLEED_RED,
            }}
          >
            {s}
          </span>
        ))}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: BLEED_RED,
        }}
      >
        View profile →
      </div>
    </Link>
  );
}