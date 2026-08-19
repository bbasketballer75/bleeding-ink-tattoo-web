/**
 * Home — /
 *
 * One-page summary. Sections (each is its own <section>):
 *   1. Hero (compact variant)
 *   2. Intro strip + $65 deposit
 *   3. Artists preview (Isiah + Courtney)
 *   4. Services preview (3 of 4)
 *   5. Reviews (3 demos)
 *   6. Instagram feed (6 mock cards)
 *   7. CTA strip (Book + Contact)
 *   8. Location (address + hours + map)
 *
 * Light sections (Artists/Services/Reviews/CTA/Location) have explicit
 * `background: BONE_WHITE` so BLEED_RED labels pass WCAG AA on light bg.
 * Dark sections (Hero/Intro/Instagram) inherit the body's dark bg.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { SHOP, BLEED_RED, BONE_WHITE, DEPOSIT_MIN } from "@/lib/constants";
import Hero from "@/components/Hero";
import Reviews from "@/components/Reviews";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import InstagramFeed from "@/components/InstagramFeed";
import PortfolioCard from "@/components/PortfolioCard";
import { ARTISTS } from "@/data/artists";
import { SERVICES } from "@/data/services";
import { PORTFOLIO } from "@/data/portfolio";
import { telLink, mapsEmbedUrl, mapsLink, formatUSD } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Bleeding Ink — Custom Tattoos in Johnstown, PA",
  description: "Custom tattoos, coverups, and color work at Bleeding Ink inside the Johnstown Galleria. Walk-ins welcome. Free consultation. $65 deposit.",
  artist: "isiah-jackson",
  path: "/",
  image: "/og-default.svg",
  keywords: [
    "tattoo Johnstown PA",
    "custom tattoos Johnstown",
    "coverup tattoos",
    "color work tattoo",
    "walk-in tattoo shop",
    "tattoo Johnstown Galleria",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero
        variant="home"
        eyebrow="Bleeding Ink Tattooing"
        headline="INK. NOT APOLOGIES."
        tagline="Appointments preferred, walk-ins always welcome. Free consultation. Coverups our specialty. Color work our craft."
      />

      {/* === 2. Intro strip — LIGHT bg ($65 deposit + value props) === */}
      <section style={{ background: BONE_WHITE, color: "var(--color-ink-black)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-marker)",
              fontSize: 24,
              color: BLEED_RED,
              marginBottom: 24,
            }}
          >
            Appointments preferred, walk-ins always welcome.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
            Custom pieces, coverups, and color work from a small team in the Johnstown Galleria. Walk in for a free consultation, or book ahead for custom work.{" "}
            <strong style={{ color: BLEED_RED }}>{formatUSD(DEPOSIT_MIN)} non-refundable deposit</strong> secures your slot.
          </p>
        </div>
      </section>

      {/* === 3. Artists preview — LIGHT bg === */}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {ARTISTS.map((artist) => (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                style={{
                  background: "var(--color-bone-white)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: 28,
                  color: "var(--color-ink-black)",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    background: BLEED_RED,
                    color: BONE_WHITE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    marginBottom: 16,
                  }}
                >
                  {artist.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    textTransform: "uppercase",
                    margin: 0,
                    marginBottom: 6,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {artist.name}
                </h3>
                <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {artist.role}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.85 }}>
                  {artist.specialties.slice(0, 3).join(" · ")}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === 4. Services preview — LIGHT bg === */}
      {/* === 3.5. Featured work — DARK bg (real IG photos) === */}
      {(() => {
        const featured = PORTFOLIO.filter((p) => p.artist === "isiah-jackson").slice(0, 4);
        if (featured.length === 0) return null;
        return (
          <section style={{ padding: "60px 24px 80px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between",
                            flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-marker)",
                      fontSize: 14,
                      color: BLEED_RED,
                      marginBottom: 8,
                    }}
                  >
                    Fresh ink
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(32px, 4vw, 44px)",
                      textTransform: "uppercase",
                      margin: 0,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Recent work
                  </h2>
                </div>
                <Link
                  href="/portfolio"
                  className="btn-secondary"
                  style={{ fontSize: 13 }}
                >
                  See full portfolio →
                </Link>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 20,
                }}
              >
                {featured.map((piece) => (
                  <PortfolioCard key={piece.id} piece={piece} />
                ))}
              </div>
            </div>
          </section>
        );
      })()}
      <section style={{ background: BONE_WHITE, color: "var(--color-ink-black)", padding: "80px 24px" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {SERVICES.slice(0, 3).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* === 5. Reviews — DARK bg (intentional for hero testimonial look) === */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(245, 241, 232, 0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reviews />
        </div>
      </section>

      {/* === 6. Instagram feed — DARK bg === */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(245, 241, 232, 0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <InstagramFeed />
        </div>
      </section>

      {/* === 7. CTA strip — BLEED_RED bg === */}
      <section
        style={{
          background: BLEED_RED,
          color: BONE_WHITE,
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontSize: 18, opacity: 0.95, margin: 0, marginBottom: 24 }}>
            Ready to talk about your piece? Free consultation, no obligation.
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

      {/* === 8. Location — LIGHT bg === */}
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
                  <a
                    href={`tel:${SHOP.phone.tel}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                    aria-label={`Call Bleeding Ink at ${SHOP.phone.display}`}
                  >
                    {SHOP.phone.display}
                  </a>
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
                height="240"
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
