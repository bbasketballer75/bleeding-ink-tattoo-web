/**
 * Services — /services.
 *
 * Lists every service with full descriptions. Pricing posture:
 * "DM for quote" — no hourly rates published (per Austin 2026-08-17).
 * Only the $65 non-refundable deposit is shown publicly.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/data/services";
import { DEPOSIT_MIN, BLEED_RED } from "@/lib/constants";
import { formatUSD } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description: "Custom tattoos, coverups, color work, free consultations. Walk-ins welcome at Bleeding Ink in Johnstown, PA.",
};

export default function ServicesPage() {
  return (
    <>
      <Hero
        variant="compact"
        headline="Services"
        tagline="Custom work, coverups, color. Every piece starts with a free conversation."
      />

      <section style={{ padding: "60px 24px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeading
            eyebrow="What We Do"
            heading={`${SERVICES.length} core services`}
            body="From coverups to color work, we do it all. Bring a photo, a description, or a feeling — we'll work it out together."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing posture */}
      <section style={{ background: "var(--color-bone-white)", color: "var(--color-ink-black)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Pricing"
            heading="DM for quote · ${formatUSD(DEPOSIT_MIN)} to book"
            body="Every piece is different. Hourly rates depend on size, detail, placement, and style — we'll give you a realistic quote at the consultation. The deposit is the only number we publish, and it's non-refundable."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
              marginTop: 32,
            }}
          >
            <div style={{ padding: 24, border: `2px solid ${BLEED_RED}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: BLEED_RED, marginBottom: 8 }}>
                Deposit
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1 }}>{formatUSD(DEPOSIT_MIN)}</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>Non-refundable. Comes off your final tattoo price.</div>
            </div>
            <div style={{ padding: 24, border: "2px solid rgba(10, 10, 10, 0.15)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Consultation
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1 }}>Free</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>Walk in or book ahead. No obligation.</div>
            </div>
            <div style={{ padding: 24, border: "2px solid rgba(10, 10, 10, 0.15)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Hourly Rate
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, lineHeight: 1.1 }}>By quote</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>Depends on the piece. We'll tell you upfront.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontSize: 18, opacity: 0.85, margin: 0, marginBottom: 24 }}>
            Ready to talk about your piece? Free consultation, no obligation.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            <Link href="/book" className="btn-primary" style={{ fontSize: 14 }}>Book a Session</Link>
            <Link href="/contact" className="btn-secondary" style={{ fontSize: 14 }}>Send a Message</Link>
          </div>
        </div>
      </section>
    </>
  );
}