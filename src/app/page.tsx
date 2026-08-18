/**
 * Home page — /.
 *
 * Sections:
 *   1. Hero (full home variant)
 *   2. Intro strip (tagline + deposit reminder)
 *   3. Artists preview (grid of ArtistCard)
 *   4. Services preview (grid of ServiceCard)
 *   5. Reviews (3 testimonials)
 *   6. Instagram feed (6 mock posts)
 *   7. CTA strip (Book / Contact)
 *   8. Location (address + Google Maps embed)
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import ArtistCard from "@/components/ArtistCard";
import ServiceCard from "@/components/ServiceCard";
import InstagramFeed from "@/components/InstagramFeed";
import Reviews from "@/components/Reviews";
import { ARTISTS } from "@/data/artists";
import { SERVICES } from "@/data/services";
import { SHOP, BLEED_RED, BONE_WHITE, DEPOSIT_MIN } from "@/lib/constants";
import { mapsEmbedUrl, mapsLink, formatUSD } from "@/lib/utils";

export const metadata = buildMetadata({
  title: `${SHOP.name} — Custom Tattoos in Johnstown, PA`,
  description:
    "Custom tattoos, coverups, and color work at Bleeding Ink inside the Johnstown Galleria. Walk-ins welcome. Free consultation. $65 deposit.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* === 1. Hero === */}
      <Hero
        variant="home"
        headline="Bleeding Ink"
        tagline="Custom tattoos, coverups, color work. Johnstown's shop since the rebrand. Walk-ins welcome, free consultation."
        primaryCta={{ href: "/book", label: "Book a Session" }}
        secondaryCta={{ href: "/portfolio", label: "See Our Work" }}
      />

      {/* === 2. Intro strip === */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-marker)",
              fontSize: 24,
              color: BLEED_RED,
              marginBottom: 24,
            }}
          >
            {SHOP.tagline}
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
            Custom pieces, coverups, and color work from a small team in the Johnstown Galleria. Walk in for a free consultation, or book ahead for custom work.{" "}
            <strong style={{ color: BLEED_RED }}>{formatUSD(DEPOSIT_MIN)} non-refundable deposit</strong> secures your slot.
          </p>
        </div>
      </section>

      {/* === 3. Artists preview === */}
      <section style={{ background: BONE_WHITE, color: "var(--color-ink-black)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
            <SectionHeading
              eyebrow="The Team"
              heading="Artists"
              body="Two artists, two distinct styles. Pick the one that fits your idea, or come in for a free consultation and we'll match you."
            />
            <Link
              href="/artists"
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: BLEED_RED,
                textDecoration: "none",
              }}
            >
              See all artists →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 32,
            }}
          >
            {ARTISTS.map((artist) => (
              <ArtistCard key={artist.slug} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      {/* === 4. Services preview === */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
            <SectionHeading
              eyebrow="What We Do"
              heading="Services"
              body="Custom work, coverups, color. Every piece starts with a conversation."
            />
            <Link
              href="/services"
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: BLEED_RED,
                textDecoration: "none",
              }}
            >
              See all services →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {SERVICES.slice(0, 3).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>


      {/* === 5. Reviews === */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reviews />
        </div>
      </section>

      {/* === 6. Instagram feed === */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(245, 241, 232, 0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <InstagramFeed />
        </div>
      </section>

      {/* === 5. CTA strip === */}
      <section
        style={{
          background: BLEED_RED,
          color: BONE_WHITE,
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 52px)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              margin: 0,
              marginBottom: 16,
              lineHeight: 0.95,
            }}
          >
            Ready to get inked?
          </h2>
          <p style={{ fontSize: 18, margin: 0, marginBottom: 32, opacity: 0.95 }}>
            Book a session or stop by for a free walk-in consultation. We're inside the Johnstown Galleria.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            <Link
              href="/book"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                background: BONE_WHITE,
                color: BLEED_RED,
                fontWeight: 700,
                textTransform: "uppercase",
                textDecoration: "none",
                fontSize: 15,
                letterSpacing: "0.02em",
              }}
            >
              Book a Session
            </Link>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                background: "transparent",
                color: BONE_WHITE,
                border: `2px solid ${BONE_WHITE}`,
                fontWeight: 700,
                textTransform: "uppercase",
                textDecoration: "none",
                fontSize: 15,
                letterSpacing: "0.02em",
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* === 7. Location === */}
      <section style={{ background: BONE_WHITE, color: "var(--color-ink-black)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 48,
              alignItems: "start",
            }}
          >
            <div>
              <SectionHeading eyebrow="Find Us" heading="Visit the Shop" />
              <div style={{ fontSize: 16, lineHeight: 1.8 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{SHOP.address.mall}</div>
                <div>{SHOP.address.street}{SHOP.address.suite ? `, ${SHOP.address.suite}` : ""}</div>
                <div>{SHOP.address.city}, {SHOP.address.state} {SHOP.address.zip}</div>
                <div style={{ marginTop: 16, fontSize: 24, fontWeight: 700, color: BLEED_RED }}>
                  {SHOP.phone.display}
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <a
                  href={mapsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ fontSize: 14 }}
                >
                  Get Directions
                </a>
              </div>
            </div>
            <div>
              <iframe
                src={mapsEmbedUrl()}
                width="100%"
                height="380"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map showing ${SHOP.address.mall} location`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}