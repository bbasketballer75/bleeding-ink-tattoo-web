/**
 * Portfolio — /portfolio.
 *
 * v1 placeholder state: shows a "coming soon" with instructions for the
 * shop owner to upload images. Real portfolio renders once PORTFOLIO array
 * in src/data/portfolio.ts has entries.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import { PORTFOLIO } from "@/data/portfolio";
import { BLEED_RED } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Custom tattoos, coverups, color work by the artists at Bleeding Ink in Johnstown, PA.",
};

export default function PortfolioPage() {
  return (
    <>
      <Hero
        variant="compact"
        headline="Portfolio"
        tagline="Recent work from the shop. Updated as we go."
      />

      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {PORTFOLIO.length === 0 ? (
            <>
              <SectionHeading
                eyebrow="Coming Soon"
                heading="Portfolio is being curated"
                body="We're working with the artists to publish their best pieces. Check back soon, or follow @ibleedink_600 on Instagram for the latest."
              />
              <div
                style={{
                  background: "var(--color-bone-white)",
                  color: "var(--color-ink-black)",
                  padding: 48,
                  border: "2px dashed rgba(10, 10, 10, 0.2)",
                  marginTop: 24,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    textTransform: "uppercase",
                    margin: 0,
                    marginBottom: 16,
                  }}
                >
                  Until then, see us on Instagram
                </h3>
                <p style={{ margin: 0, marginBottom: 24, opacity: 0.85 }}>
                  The artists post their freshest work to Instagram first. Tap through to see what's coming off the chair this week.
                </p>
                <a
                  href="https://www.instagram.com/ibleedink_600/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ fontSize: 14 }}
                >
                  Open Instagram ↗
                </a>
              </div>
            </>
          ) : (
            <>
              <SectionHeading
                eyebrow="The Work"
                heading={`${PORTFOLIO.length} piece${PORTFOLIO.length === 1 ? "" : "s"} on the wall`}
                body="Real tattoos by real artists. Click any image to see the full session story."
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {PORTFOLIO.map((piece) => (
                  <div
                    key={piece.id}
                    style={{
                      position: "relative",
                      aspectRatio: `${piece.width} / ${piece.height}`,
                      background: `var(--color-ash-gray)`,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={piece.imageUrl}
                      alt={piece.altText}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <div
            style={{
              marginTop: 64,
              padding: "32px 24px",
              borderTop: `1px solid ${BLEED_RED}`,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 16, opacity: 0.85, margin: 0, marginBottom: 16 }}>
              Want something specific? Bring your idea and we'll build it together.
            </p>
            <Link href="/book" className="btn-primary" style={{ fontSize: 14 }}>
              Book a Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}