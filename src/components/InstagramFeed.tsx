/**
 * InstagramFeed — real IG photos from @ibleedink_600 embedded on home page.
 *
 * Replaced the previous SVG mock cards with real Isiah Jackson photos.
 * The fabricated like-counts and pieced-together captions are gone; what
 * you see now are real images from the shop's IG + real captions cleaned
 * up to one line each.
 *
 * Each card links to https://www.instagram.com/ibleedink_600/ for the
 * full post.
 */

import Link from "next/link";
import { BONE_WHITE, BLEED_RED_BRIGHT } from "@/lib/constants";

interface RealPost {
  image: string;
  caption: string;
  style: string; // short tag, not fabricated like-count
}

// Real photos from Isiah Jackson's @ibleedink_600.
// Captions are short summaries, not fabricated likes or engagement metrics.
const POSTS: RealPost[] = [
  {
    image: "/images/portfolio/isiah/fresh-ink-forearm.jpg",
    caption: "Black-grey realism — fresh from a session",
    style: "Black & Grey",
  },
  {
    image: "/images/portfolio/isiah/shop-isiah.jpg",
    caption: "Behind the chair at Bleeding Ink",
    style: "Shop",
  },
  {
    image: "/images/portfolio/isiah/black-grey-chest.jpg",
    caption: "Large black-grey chest composition",
    style: "Black & Grey",
  },
  {
    image: "/images/portfolio/isiah/sleeve-work.jpg",
    caption: "Bold color sleeve work",
    style: "Color",
  },
  {
    image: "/images/portfolio/isiah/color-religious.jpg",
    caption: "Color realism — cross + rosary + lilies",
    style: "Color",
  },
  {
    image: "/images/portfolio/isiah/fine-line-lilies.jpg",
    caption: "Fine-line delicate work",
    style: "Fine Line",
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
            color: BLEED_RED_BRIGHT,
            border: `2px solid ${BLEED_RED_BRIGHT}`,
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
              background: "#0A0A0A",
              display: "block",
              textDecoration: "none",
              overflow: "hidden",
              border: "1px solid rgba(245, 241, 232, 0.1)",
            }}
            aria-label={`Instagram post: ${post.caption}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.caption}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
            />

            {/* Hover overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 60%, transparent 100%)",
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
                  marginBottom: 4,
                  lineHeight: 1.3,
                  fontWeight: 500,
                }}
              >
                {post.caption}
              </p>
              <div style={{ fontSize: 11, color: BONE_WHITE, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                {post.style}
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
