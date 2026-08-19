/**
 * Reviews — 3 testimonial cards on home page.
 *
 * HONEST DISCLOSURE (2026-08-19): the names + quotes + photos below are
 * *demonstration content*. The portraits are AI-generated via ComfyUI; the
 * quotes are stitched together from patterns we've seen on real tattoo
 * shop Google reviews. Nothing here represents a verified customer.
 *
 * Two-step plan to make this real:
 *   1. When we have actual Google reviews for the shop:
 *      - Replace names with real review authors
 *      - Replace text with their actual quotes
 *      - Set portrait to a real author avatar (or use the initials circle)
 *      - Remove the DEMO badge
 *   2. Until then: keep the badge visible at all times so visitors know.
 *
 * The badges + initials avatars + the prominent "DEMO TESTIMONIALS"
 * header are an honest-disclosure design — we are NOT trying to fool
 * visitors into thinking these are real people.
 */

import { BONE_WHITE, BLEED_RED } from "@/lib/constants";

interface Review {
  name: string;
  initials: string;
  location?: string;
  rating: number; // 1-5
  style: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    name: "Marcus T. (demo)",
    initials: "MT",
    location: "Johnstown, PA",
    rating: 5,
    style: "Coverup",
    text: "Had an old name I needed gone — Isiah turned it into a compass rose that actually means something to me now. Bold lines, clean color, looks like it was always supposed to be there. Six months healed, still looks fresh.",
  },
  {
    name: "Sarah K. (demo)",
    initials: "SK",
    location: "Richland",
    rating: 5,
    style: "Color Realism",
    text: "Courtney did a phoenix thigh piece for me. The color work is unreal — saturated oranges and teals that pop without looking cartoonish. Took her time to get the placement right and made sure I was comfortable the whole session.",
  },
  {
    name: "Devon R. (demo)",
    initials: "DR",
    location: "Westmont",
    rating: 5,
    style: "Traditional",
    text: "Drove past this shop a hundred times before I went in. Wish I'd gone sooner. Got a traditional snake-and-dagger from Isiah, walked out with exactly what I wanted. Walk-in friendly, no attitude, fair pricing.",
  },
];

// One accent ring color per card so the avatars look distinct
const AVATAR_BG = ["#C0382B", "#D85A28", "#8A8A8A"];
const AVATAR_TEXT = ["#0A0A0A", "#0A0A0A", "#F5F1E8"];

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
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            border: `2px solid ${BLEED_RED}`,
            color: BLEED_RED,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            margin: "0 auto 16px",
          }}
          role="note"
          aria-label="Demo testimonials disclaimer"
        >
          Demo testimonials · awaiting Google review verification
        </div>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            margin: 0,
            opacity: 0.7,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Quotations on this section are composed to illustrate the kinds of
          things clients commonly say about Bleeding Ink. They&rsquo;ll be
          replaced with verified reviews from Google once we collect them.
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
              padding: "28px 28px 32px",
              borderLeft: `4px solid ${BLEED_RED}`,
            }}
          >
            {/* Initials avatar — replaces AI portrait to make demo nature obvious */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: AVATAR_BG[i],
                color: AVATAR_TEXT[i],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
              aria-hidden="true"
            >
              {review.initials}
            </div>

            {/* Star rating */}
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
                marginBottom: 16,
                color: BONE_WHITE,
                opacity: 0.85,
                fontStyle: "italic",
              }}
            >
              &ldquo;{review.text}&rdquo;
            </p>

            <div
              style={{
                paddingTop: 16,
                borderTop: "1px solid rgba(245, 241, 232, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                flexWrap: "wrap",
                gap: 8,
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

      {/* Bottom note: call-to-action to leave an honest review */}
      <p
        style={{
          fontSize: 14,
          textAlign: "center",
          marginTop: 32,
          marginBottom: 0,
          opacity: 0.7,
        }}
      >
        Are you a real client?{" "}
        <a
          href="https://g.page/r/bleeding-ink/review"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: BLEED_RED, fontWeight: 700 }}
        >
          Leave a Google review →
        </a>
      </p>
    </div>
  );
}
