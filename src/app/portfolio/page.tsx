/**
 * Portfolio — /portfolio.
 *
 * Showcases every piece in src/data/portfolio.ts with style filter chips.
 * Demo data uses inline SVGs (TattooSVG component) so we don't ship
 * unlicensed images. Real shop owner would replace these with actual photos.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import PortfolioGrid from "@/components/PortfolioGrid";
import Button from "@/components/Button";
import Link from "next/link";
import { BONE_WHITE, BLEED_RED } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Browse portfolio pieces by Isiah Jackson and Courtney Fetzer — traditional, fine line, blackwork, neo-traditional, coverups, and color work. Filter by style.",
  path: "/portfolio",
    image: "/og/portfolio.svg",  keywords: [
    "tattoo portfolio johnstown pa",
    "traditional tattoos johnstown",
    "fine line tattoos",
    "color tattoos johnstown",
    "tattoo coverup portfolio",
  ],
});

export default function PortfolioPage() {
  return (
    <>
      <Hero
        variant="compact"
        eyebrow="Portfolio"
        headline="OUR WORK"
        tagline="Custom pieces by Isiah and Courtney. Filter by style — see something you like? Drop us a line."
      />

      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Portfolio", href: "/portfolio" }
      ]} />

      <section style={{ padding: "60px 20px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <PortfolioGrid />
        </div>
      </section>

      {/* CTA strip */}
      <section
        style={{
          padding: "80px 20px",
          background: BONE_WHITE,
          color: "#0A0A0A",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
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
            See something you like?
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              opacity: 0.7,
              margin: 0,
              marginBottom: 32,
            }}
          >
            Bring your idea — or let us help you find one. Free consultation, walk-ins welcome, $65 deposit secures your slot.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <Link href="/book">
              <Button variant="primary">Book a Session</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary">Ask a Question</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}