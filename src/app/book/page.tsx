/**
 * Book a session — /book.
 *
 * Demo: real consultation form (10 fields) that submits to a server action
 * which logs to console. In production this would email Isiah + Courtney
 * via Resend/SMS/CRM.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ConsultationForm from "./ConsultationForm";
import { BONE_WHITE, BLEED_RED } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Book a Session",
  description:
    "Book a free consultation or tattoo session at Bleeding Ink in Johnstown, PA. Tell us your idea, size, placement, and preferred artist. We'll respond within 1 business day.",
  path: "/book",
    image: "/og/book.svg",  keywords: [
    "book tattoo johnstown pa",
    "tattoo consultation johnstown",
    "tattoo appointment johnstown",
  ],
  robots: { index: true, follow: true },
});

export default function BookPage() {
  return (
    <>
      <Hero
        variant="compact"
        eyebrow="Book"
        headline="BOOK A SESSION"
        tagline="Free consultation first. We'll go over your idea, sizing, placement, and schedule — no commitment required to chat."
      />

      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Book a Session", href: "/book" }
      ]} />

      <section style={{ padding: "60px 20px", background: "#0A0A0A" }}>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            gap: 48,
          }}
        >
          {/* Left: form */}
          <div>
            <ConsultationForm />
          </div>

          {/* Right: what to expect + deposit info */}
          <aside>
            <div
              style={{
                background: "rgba(245, 241, 232, 0.05)",
                border: "1px solid rgba(245, 241, 232, 0.15)",
                padding: "24px 24px",
                borderRadius: 2,
                marginBottom: 24,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  margin: 0,
                  marginBottom: 16,
                  color: BONE_WHITE,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                }}
              >
                What happens next
              </h3>
              <ol style={{ margin: 0, padding: 0, listStyle: "none", counterReset: "step" }}>
                {[
                  "We'll reply within 1 business day with questions or a time to chat.",
                  "Free consultation (in-person or by phone) to nail down the design.",
                  "Once you're ready, $65 non-refundable deposit locks your appointment.",
                  "Show up, get tattooed, leave with a piece you'll love.",
                ].map((step, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 14,
                      marginBottom: 14,
                      color: BONE_WHITE,
                      fontSize: 14,
                      lineHeight: 1.5,
                      opacity: 0.85,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        background: BLEED_RED,
                        color: BONE_WHITE,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div
              style={{
                background: BLEED_RED,
                color: BONE_WHITE,
                padding: "20px 24px",
                borderRadius: 2,
              }}
            >
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  margin: 0,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                Deposit: $65 non-refundable
              </h4>
              <p style={{ fontSize: 13, lineHeight: 1.55, margin: 0, opacity: 0.95 }}>
                Applies to the final cost. Cancels inside 48 hours forfeit the deposit. Reschedule free with 48+ hours notice.
              </p>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: "20px 0",
                borderTop: "1px solid rgba(245, 241, 232, 0.15)",
                color: BONE_WHITE,
                fontSize: 13,
                lineHeight: 1.6,
                opacity: 0.7,
              }}
            >
              <p style={{ margin: 0, marginBottom: 8 }}>
                <strong style={{ opacity: 1 }}>Walk-ins always welcome</strong> for flash pieces and small consults.
              </p>
              <p style={{ margin: 0 }}>
                For custom work, this form is the fastest path. Or call us directly.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}