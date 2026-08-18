/**
 * Contact — /contact.
 *
 * Two-column layout:
 * - Left: contact form (client component, server action)
 * - Right: shop info, hours, map, phone CTA
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "./ContactForm";
import { SHOP, BLEED_RED, BONE_WHITE } from "@/lib/constants";
import { mapsEmbedUrl, mapsLink } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Contact",
  description: 'Get in touch with Bleeding Ink in Johnstown, PA. Phone (215) 980-1386, hours, location at the Johnstown Galleria, and consultation form.',
  path: "/contact",
    image: "/og/default.svg",});

export default function ContactPage() {
  return (
    <>
      <Hero
        variant="compact"
        headline="Get in Touch"
        tagline="Free consultation, no obligation. Drop a message and we'll get back within 2 business days."
      />

      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Contact", href: "/contact" }
      ]} />

      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 48,
            }}
          >
            {/* Form */}
            <div>
              <SectionHeading
                eyebrow="Send a Message"
                heading="Tell us about your idea"
                body="The more detail you give us — style, size, placement, references — the faster we can give you a useful reply."
              />
              <ContactForm />
            </div>

            {/* Shop info */}
            <div>
              <SectionHeading
                eyebrow="Visit or Call"
                heading="Walk-ins welcome"
              />

              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: BLEED_RED, marginBottom: 8 }}>
                  Address
                </div>
                <div style={{ fontSize: 17, lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 700 }}>{SHOP.address.mall}</div>
                  <div>{SHOP.address.street}{SHOP.address.suite ? `, ${SHOP.address.suite}` : ""}</div>
                  <div>{SHOP.address.city}, {SHOP.address.state} {SHOP.address.zip}</div>
                </div>
                <a
                  href={mapsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: BLEED_RED,
                    textDecoration: "none",
                  }}
                >
                  Open in Google Maps →
                </a>
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: BLEED_RED, marginBottom: 8 }}>
                  Phone
                </div>
                <a
                  href={`tel:${SHOP.phone.tel}`}
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-display)",
                    fontSize: 36,
                    color: BONE_WHITE,
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {SHOP.phone.display}
                </a>
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: BLEED_RED, marginBottom: 8 }}>
                  Hours
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 15, lineHeight: 1.8 }}>
                  {SHOP.hours.map((h) => (
                    <li key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: 16, maxWidth: 280, color: "var(--color-ink-black)" }}>
                      <span>{h.day}</span>
                      <span style={{ fontWeight: h.hours === "Closed" ? 400 : 600, color: h.hours === "Closed" ? "#666" : "var(--color-ink-black)" }}>{h.hours}</span>
                    </li>
                  ))}
                </ul>
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
        </div>
      </section>
    </>
  );
}