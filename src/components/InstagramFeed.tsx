/**
 * InstagramFeed — mock IG grid embedded on home page.
 *
 * For the demo: 6 SVG cards labeled @ibleedink_600 with mock captions.
 * In production: replace with real Instagram Basic Display API call
 * (or use a service like Elfsight widget).
 *
 * Each card links to https://www.instagram.com/ibleedink_600/
 */

import Link from "next/link";
import { BONE_WHITE, BLEED_RED } from "@/lib/constants";
import TattooSVG from "./TattooSVG";

interface MockPost {
  caption: string;
  style: "rose" | "skull" | "mountain" | "snake" | "compass" | "phoenix" | "moon" | "flame";
  accent: string;
  likes: number;
}

const POSTS: MockPost[] = [
  {
    caption: "Colorful lil 💐's & 🐢 Bleeding 🩸 ink",
    style: "rose",
    accent: "#C0382B",
    likes: 247,
  },
  {
    caption: "bleeding ink back in full effect even tho I never left 🔥🔥🔥",
    style: "phoenix",
    accent: "#D85A28",
    likes: 184,
  },
  {
    caption: "up late working 💯 as always imma be the youngest in charge watch",
    style: "skull",
    accent: "#F5F1E8",
    likes: 312,
  },
  {
    caption: "freestyle coverup for the homie — converted a faded name into a sleeve anchor",
    style: "compass",
    accent: "#C9A84C",
    likes: 156,
  },
  {
    caption: "fine line moon + stars — wrist piece, 2 hour session, healed up beautiful",
    style: "moon",
    accent: "#C9A84C",
    likes: 203,
  },
  {
    caption: "traditional flame on the deltoid, classic bold lines, ready for color or solid black",
    style: "flame",
    accent: "#E25822",
    likes: 178,
  },
];

export default function InstagramFeed() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            margin: 0,
            color: BONE_WHITE,
          }}
        >
          Follow @ibleedink_600
        </h3>
        <a
          href="https://www.instagram.com/ibleedink_600/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "transparent",
            color: BLEED_RED,
            border: `2px solid ${BLEED_RED}`,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Open Instagram →
        </a>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 4,
        }}
      >
        {POSTS.map((post, i) => (
          <a
            key={i}
            href="https://www.instagram.com/ibleedink_600/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "relative",
              aspectRatio: "1 / 1",
              background: `linear-gradient(135deg, ${post.accent}22 0%, #0A0A0A 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              textDecoration: "none",
              overflow: "hidden",
              border: `1px solid rgba(245, 241, 232, 0.1)`,
            }}
            aria-label={`Instagram post: ${post.caption}`}
          >
            <TattooSVG style={post.style} accent={post.accent} />

            {/* Hover overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, transparent 100%)",
                opacity: 0,
                transition: "opacity 0.2s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 12,
              }}
              className="ig-hover-overlay"
            >
              <p
                style={{
                  fontSize: 13,
                  color: BONE_WHITE,
                  margin: 0,
                  marginBottom: 8,
                  lineHeight: 1.3,
                  fontWeight: 500,
                }}
              >
                {post.caption}
              </p>
              <div style={{ fontSize: 12, color: BONE_WHITE, opacity: 0.8, fontWeight: 700 }}>
                ♥ {post.likes.toLocaleString()}
              </div>
            </div>

            <style>{`
              a:hover > .ig-hover-overlay,
              a:focus-visible > .ig-hover-overlay {
                opacity: 1 !important;
              }
            `}</style>
          </a>
        ))}
      </div>
    </div>
  );
}