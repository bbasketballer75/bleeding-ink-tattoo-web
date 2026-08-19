/**
 * Reviews — 3 testimonial cards on home page.
 *
 * Photo style is photorealistic (Dreamlike-Photoreal SD 1.5 via ComfyUI).
 * Names + quotes are demo content; swap for real Google reviews when ready.
 */

import { BONE_WHITE, BLEED_RED } from "@/lib/constants";

interface Review {
  name: string;
  location?: string;
  rating: number; // 1-5
  style: string; // style of work
  text: string;
  photo: string; // /images/generated/<file>.png
}

const REVIEWS: Review[] = [
  {
    name: "Marcus T.",
    location: "Johnstown, PA",
    rating: 5,
    style: "Coverup",
    text: "Had an old name I needed gone — Isiah turned it into a compass rose that actually means something to me now. Bold lines, clean color, looks like it was always supposed to be there. Six months healed, still looks fresh.",
    photo: "/images/generated/review-marcus.png",
  },
  {
    name: "Sarah K.",
    location: "Richland",
    rating: 5,
    style: "Color Realism",
    text: "Courtney did a phoenix thigh piece for me. The color work is unreal — saturated oranges and teals that pop without looking cartoonish. Took her time to get the placement right and made sure I was comfortable the whole session.",
    photo: "/images/generated/review-sarah.png",
  },
  {
    name: "Devon R.",
    location: "Westmont",
    rating: 5,
    style: "Traditional",
    text: "Drove past this shop a hundred times before I went in. Wish I'd gone sooner. Got a traditional snake-and-dagger from Isiah, walked out with exactly what I wanted. Walk-in friendly, no attitude, fair pricing.",
    photo: "/images/generated/review-devon.png",
  },
];

export default function Reviews() {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#E63946",
            margin: 0,
            marginBottom: 12,
          }}
        >
          From the chair
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5vw, 56px)",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            margin: 0,
            marginBottom: 12,
          }}
        >
          What clients say
        </h2>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            margin: 0,
            opacity: 0.7,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Real talk from people who got inked here. (Demo testimonials — replace with verified Google reviews.)
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {REVIEWS.map((review, i) => (
          <article
            key={i}
            style={{
              background: "rgba(245, 241, 232, 0.04)",
              border: "1px solid rgba(245, 241, 232, 0.12)",
              padding: "0 0 28px",
              borderLeft: `4px solid ${BLEED_RED}`,
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={review.photo}
              alt={`${review.name}, ${review.style} client`}
              loading="lazy"
              style={{
                display: "block",
                width: "100%",
                height: 260,
                objectFit: "cover",
                background: "#0A0A0A",
              }}
            />
            <div style={{ padding: "20px 28px 0" }}>
              {/* Star rating — div with role="img" so aria-label is valid */}
              <div
                role="img"
                aria-label={`${review.rating} out of 5 stars`}
                style={{ display: "flex", gap: 2, marginBottom: 16 }}
              >
                {Array.from({ length: 5 }).map((_, j) => (
                  <span
                    key={j}
                    style={{
                      color: j < review.rating ? BLEED_RED : "rgba(245, 241, 232, 0.2)",
                      fontSize: 18,
                      lineHeight: 1,
                    }}
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
              </div>

              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  margin: 0,
                  color: BONE_WHITE,
                  opacity: 0.85,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{review.text}&rdquo;
              </p>
            </div>

            <div
              style={{
                padding: "16px 28px 0",
                borderTop: "1px solid rgba(245, 241, 232, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: BONE_WHITE,
                  }}
                >
                  {review.name}
                </div>
                {review.location && (
                  <div style={{ fontSize: 12, opacity: 0.6, color: BONE_WHITE }}>{review.location}</div>
                )}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: BONE_WHITE,
                  background: BLEED_RED,
                  padding: "4px 10px",
                }}
              >
                {review.style}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
