/**
 * Aftercare — /aftercare.
 *
 * 7-section comprehensive tattoo aftercare guide. High SEO intent.
 * Content is generic / FDA-aligned (no medical claims, no guarantees).
 *
 * Sections:
 *   1. First 24 hours (the bandage)
 *   2. Day 1-3 (washing routine)
 *   3. Day 3-14 (moisturizing + peeling)
 *   4. Sun exposure
 *   5. Swimming + water exposure
 *   6. Signs of infection (when to contact us)
 *   7. Healing timeline (visual)
 *
 * Plus FAQ + CTA strip at the bottom.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/Hero";
import TocList from "@/components/TocList";
import Link from "next/link";
import { BONE_WHITE, BLEED_RED } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Tattoo Aftercare Guide",
  description:
    "Complete tattoo aftercare guide from Bleeding Ink in Johnstown, PA. First 24 hours, washing, moisturizing, sun exposure, swimming, signs of infection, and the full healing timeline.",
  path: "/aftercare",
  keywords: [
    "tattoo aftercare",
    "tattoo healing",
    "tattoo aftercare instructions",
    "new tattoo care",
    "tattoo infection signs",
    "tattoo peeling",
    "healing tattoo johnstown",
  ],
});

const SECTIONS = [
  {
    id: "first-24",
    number: "01",
    title: "The first 24 hours",
    summary: "Keep the bandage on, stay clean, let it breathe.",
    bullets: [
      "Leave your bandage on for 2–6 hours (we'll tell you exactly when we wrap it).",
      "After removing the bandage, gently wash with lukewarm water and unscented soap.",
      "Pat dry with a paper towel — don't rub, don't use a bath towel (bacteria).",
      "Let the tattoo air-dry for 10–15 minutes before applying anything.",
      "Wear loose, clean, breathable clothing over the area. Tight fabrics trap moisture and bacteria.",
    ],
  },
  {
    id: "week-one",
    number: "02",
    title: "Days 1–3: washing routine",
    summary: "Twice a day. Gentle. Unscented.",
    bullets: [
      "Wash the tattoo twice a day — morning and night — with lukewarm water and fragrance-free soap.",
      "Use your clean hands (not a washcloth — they harbor bacteria).",
      "Pat dry. Wait until the skin is fully dry before moisturizing.",
      "Apply a thin layer of unscented moisturizer (we recommend Hustle Butter or Aquaphor — light coat, you should still see the tattoo through it).",
      "Don't re-bandage. Fresh tattoos need airflow to heal.",
    ],
  },
  {
    id: "weeks-two-three",
    number: "03",
    title: "Days 3–14: peeling + itching",
    summary: "This is the ugly phase. Don't pick.",
    bullets: [
      "The tattoo will start to peel and flake like a sunburn around day 4–7. This is normal.",
      "It will be itchy. Do NOT scratch — you'll pull ink out and risk scarring.",
      "Tap or slap the area lightly if the itching is unbearable.",
      "Continue washing + moisturizing twice daily through the peeling phase.",
      "Scabs (if any) will fall off on their own. Picking scabs = missing ink + potential scarring.",
    ],
  },
  {
    id: "sun",
    number: "04",
    title: "Sun exposure",
    summary: "UV fades tattoos. Always protect.",
    bullets: [
      "Keep new tattoos out of direct sunlight for the first 2 weeks. Cover with loose clothing.",
      "After healing, ALWAYS use SPF 30+ sunscreen on the tattoo when exposed to sun.",
      "UV exposure is the #1 cause of premature tattoo fading — even years after healing.",
      "Don't use tanning beds on a fresh tattoo (or honestly, ever — they fade tattoos AND cause cancer).",
      "Clothing with UPF rating is the best long-term protection.",
    ],
  },
  {
    id: "swimming",
    number: "05",
    title: "Swimming & water exposure",
    summary: "No pools, hot tubs, lakes, or oceans until fully healed.",
    bullets: [
      "No submerging the tattoo in water for at least 2–3 weeks. That means no swimming, hot tubs, baths, or lakes.",
      "Quick showers are fine. Avoid letting the shower stream hit the tattoo directly for the first few days.",
      "Pools and hot tubs are especially bad — chlorine and bacteria can cause infection and fade colors.",
      "Lakes, rivers, and oceans contain bacteria that can infect open wounds. Wait until fully healed.",
      "Once healed, brief water exposure is fine — but rinse the tattoo with clean water after swimming.",
    ],
  },
  {
    id: "infection",
    number: "06",
    title: "Signs of infection (contact us or a doctor)",
    summary: "When in doubt, call. We'd rather hear from you.",
    bullets: [
      "Excessive redness that spreads or worsens after day 3.",
      "Pus that's thick, yellow/green, or has a bad smell (some plasma weeping is normal in the first 24–48h).",
      "Fever, chills, or feeling generally unwell — could indicate systemic infection.",
      "Red streaks radiating from the tattoo.",
      "Severe pain that's getting worse, not better, after day 3.",
      "If you notice any of these, contact us immediately at (215) 980-1386 or visit a doctor. Don't wait.",
    ],
  },
  {
    id: "timeline",
    number: "07",
    title: "Full healing timeline",
    summary: "Surface heals in 2-4 weeks. Full healing takes months.",
    bullets: [
      "Week 1: Tender, red, slightly swollen. Start of healing.",
      "Weeks 2–3: Peeling and itching. The surface is repairing.",
      "Weeks 4–6: Surface looks healed but is still fragile underneath.",
      "Months 2–6: Deeper layers of skin continue to heal. Colors settle into their final shade.",
      "Total healing time: 6 months for surface, up to 12 months for deep layers. Don't judge your tattoo's final colors until then.",
    ],
  },
];

export default function AftercarePage() {
  return (
    <>
      <Hero
        variant="compact"
        eyebrow="Aftercare"
        headline="HEAL GUIDE"
        tagline="Fresh ink is the start. How you take care of it determines how good it looks in 10 years. Read this — save it."
      />

      {/* TOC */}
      <nav
        aria-label="Table of contents"
        style={{
          padding: "40px 20px 0",
          background: "#0A0A0A",
          color: BONE_WHITE,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            background: "rgba(245, 241, 232, 0.05)",
            border: "1px solid rgba(245, 241, 232, 0.15)",
            padding: "20px 24px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
              marginBottom: 12,
              color: BLEED_RED,
            }}
          >
            What's inside
          </h2>
          <TocList
            links={SECTIONS.map((s) => ({
              href: `#${s.id}`,
              number: s.number,
              label: s.title,
            }))}
          />
        </div>
      </nav>

      {/* Sections */}
      <section style={{ padding: "60px 20px 80px", background: "#0A0A0A", color: BONE_WHITE }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {SECTIONS.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              style={{
                paddingTop: 40,
                paddingBottom: 40,
                borderTop: i === 0 ? "none" : "1px solid rgba(245, 241, 232, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 48,
                    color: BLEED_RED,
                    lineHeight: 1,
                    opacity: 0.8,
                  }}
                  aria-hidden
                >
                  {s.number}
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(28px, 4vw, 40px)",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                    color: BONE_WHITE,
                  }}
                >
                  {s.title}
                </h2>
              </div>

              <p
                style={{
                  fontSize: 18,
                  color: BONE_WHITE,
                  opacity: 0.7,
                  fontStyle: "italic",
                  marginTop: 0,
                  marginBottom: 24,
                  paddingLeft: 64,
                }}
              >
                {s.summary}
              </p>

              <ul
                style={{
                  margin: 0,
                  paddingLeft: 64,
                  paddingRight: 0,
                  listStyle: "none",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: BONE_WHITE,
                }}
              >
                {s.bullets.map((bullet, j) => (
                  <li
                    key={j}
                    style={{
                      marginBottom: 12,
                      paddingLeft: 16,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        color: BLEED_RED,
                        fontWeight: 700,
                      }}
                      aria-hidden
                    >
                      ▸
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Quick reminder card */}
      <section style={{ padding: "60px 20px", background: BLEED_RED, color: BONE_WHITE }}>
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
              margin: 0,
              marginBottom: 16,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            Questions? Worried?
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, margin: 0, marginBottom: 24, opacity: 0.95 }}>
            We'd rather hear from you than have you worried. Call, text, or message us — quick answers, no judgment.
          </p>
          <a
            href="tel:+12159801386"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              background: BONE_WHITE,
              color: "#0A0A0A",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textDecoration: "none",
              border: `2px solid ${BONE_WHITE}`,
            }}
          >
            Call (215) 980-1386
          </a>
        </div>
      </section>

      {/* Bottom nav to portfolio */}
      <section
        style={{
          padding: "60px 20px",
          background: BONE_WHITE,
          color: "#0A0A0A",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 16,
              opacity: 0.7,
              margin: 0,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 700,
            }}
          >
            Or
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 56px)",
              margin: 0,
              marginBottom: 16,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            Plan your next piece
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, marginBottom: 32, opacity: 0.7 }}>
            Browse our portfolio of work, then book a free consultation. Walk-ins welcome, $65 deposit locks your slot.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <Link
              href="/portfolio"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                background: BLEED_RED,
                color: BONE_WHITE,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: `2px solid ${BLEED_RED}`,
              }}
            >
              See Portfolio
            </Link>
            <Link
              href="/book"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                background: "transparent",
                color: BLEED_RED,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: `2px solid ${BLEED_RED}`,
              }}
            >
              Book a Session
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}