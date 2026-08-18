/**
 * Book — /book.
 *
 * v1 PLACEHOLDER (T2.7 PAUSE GATE).
 *
 * Per Stage 3 build plan T2.7, this page is the pause gate that requires
 * the shop owner (Isiah) to set up a GlossGenius account before we can
 * embed their real booking widget.
 *
 * What this page does today:
 *   - Renders a clear message that booking is "coming soon"
 *   - Provides fallback paths (call to book, walk-in info, contact form)
 *   - Documents EXACTLY what needs to happen to enable real booking:
 *       1. Isiah creates a GlossGenius account (free tier)
 *       2. Sets deposit to $65 non-refundable
 *       3. Configures hours Tue-Sat 11-7
 *       4. Gets his booking URL (e.g. https://ibleedink.glossgenius.com)
 *       5. Shares URL with Austin → Austin pastes into GGL_BOOKING_URL env
 *       6. Hermes wires the embed
 *
 *   - Includes the URL constant ready to swap in when ready
 *
 * To enable real booking: replace the "Coming Soon" panel below with the
 * GlossGenius embed iframe. Embed code example:
 *
 *   <iframe
 *     src={process.env.NEXT_PUBLIC_GGL_BOOKING_URL}
 *     width="100%"
 *     height="900"
 *     style="border: 0;"
 *     title="Book with Bleeding Ink"
 *   />
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import { SHOP, BLEED_RED, BONE_WHITE, DEPOSIT_MIN } from "@/lib/constants";
import { formatUSD } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Book a Session",
  description: 'Book a custom tattoo session or free consultation at Bleeding Ink in Johnstown, PA. Online booking coming soon — call (215) 980-1386.',
  path: "/book",  indexable: false,
});

export default function BookPage() {
  return (
    <>
      <Hero
        variant="compact"
        headline="Book a Session"
        tagline="Free consultation first. Deposit to lock in your slot. Walk-ins welcome too."
      />

      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Booking"
            heading="Online booking coming soon"
            body="We're setting up the booking system. In the meantime, you've got three easy ways to get on the schedule."
          />

          {/* Three options grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
              marginBottom: 48,
            }}
          >
            {/* Option 1: Call */}
            <div
              style={{
                background: "var(--color-bone-white)",
                color: "var(--color-ink-black)",
                padding: 32,
                display: "flex",
                flexDirection: "column",
                border: "2px solid var(--color-bleed-red)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-marker)",
                  color: BLEED_RED,
                  fontSize: 14,
                  marginBottom: 12,
                }}
              >
                Fastest
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  textTransform: "uppercase",
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Call us
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, marginBottom: 20, opacity: 0.85 }}>
                Speak to Isiah or Courtney directly during shop hours. We can often fit walk-ins in the same day.
              </p>
              <a
                href={`tel:${SHOP.phone.tel}`}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  color: BLEED_RED,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  marginTop: "auto",
                }}
              >
                {SHOP.phone.display}
              </a>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
                Tue–Sat, 11 AM – 7 PM
              </div>
            </div>

            {/* Option 2: Walk-in */}
            <div
              style={{
                background: "var(--color-bone-white)",
                color: "var(--color-ink-black)",
                padding: 32,
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgba(10, 10, 10, 0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-marker)",
                  color: BLEED_RED,
                  fontSize: 14,
                  marginBottom: 12,
                }}
              >
                No appointment
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  textTransform: "uppercase",
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Walk in
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, marginBottom: 20, opacity: 0.85 }}>
                Pop into the shop any time we're open for a free consultation. No appointment needed.
              </p>
              <div style={{ marginTop: "auto", fontSize: 13, lineHeight: 1.5 }}>
                <strong>Johnstown Galleria</strong>
                <br />
                500 Galleria Dr
                <br />
                Johnstown, PA 15904
              </div>
            </div>

            {/* Option 3: Message */}
            <div
              style={{
                background: "var(--color-bone-white)",
                color: "var(--color-ink-black)",
                padding: 32,
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgba(10, 10, 10, 0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-marker)",
                  color: BLEED_RED,
                  fontSize: 14,
                  marginBottom: 12,
                }}
              >
                Async
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  textTransform: "uppercase",
                  margin: 0,
                  marginBottom: 12,
                }}
              >
                Send a message
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, marginBottom: 20, opacity: 0.85 }}>
                Drop us a description of your idea and we'll get back within 2 business days.
              </p>
              <Link
                href="/contact"
                style={{
                  display: "inline-block",
                  marginTop: "auto",
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: BLEED_RED,
                  textDecoration: "none",
                }}
              >
                Open contact form →
              </Link>
            </div>
          </div>

          {/* Deposit info */}
          <div
            style={{
              padding: 32,
              background: BLEED_RED,
              color: BONE_WHITE,
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                textTransform: "uppercase",
                margin: 0,
                marginBottom: 12,
              }}
            >
              {formatUSD(DEPOSIT_MIN)} deposit to lock in your slot
            </h3>
            <p style={{ margin: 0, fontSize: 16, opacity: 0.95 }}>
              Non-refundable. Comes off the price of your final tattoo.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}