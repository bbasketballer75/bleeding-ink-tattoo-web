/**
 * FAQ — /faq.
 *
 * Uses native <details>/<summary> for accordion behavior (no JS).
 * Each FAQ renders as a disclosure — bone-white card on dark background.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import { FAQS } from "@/data/faqs";
import { SITE_URL } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "FAQ",
  description: 'Common questions about Bleeding Ink in Johnstown, PA — walk-ins, $65 deposit, ages, aftercare, coverups.',
  path: "/faq",
    image: "/og/default.svg",});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/faq#page`,
  mainEntity: FAQS.map((f, i) => ({
    "@type": "Question",
    "@id": `${SITE_URL}/faq#q${i + 1}`,
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero
        variant="compact"
        headline="FAQ"
        tagline="Everything you might want to know before stopping by."
      />

      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "FAQ", href: "/faq" }
      ]} />

      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <SectionHeading
            eyebrow="Common Questions"
            heading={`${FAQS.length} quick answers`}
            body="If you don't see your question here, send us a message from the contact page and we'll get back to you within 2 business days."
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq, i) => (
              <details
                key={i}
                style={{
                  background: "var(--color-bone-white)",
                  color: "var(--color-ink-black)",
                  padding: 0,
                  border: "1px solid rgba(10, 10, 10, 0.1)",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    padding: 24,
                    fontWeight: 700,
                    fontSize: 17,
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <span>{faq.question}</span>
                  <span
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--color-bleed-red)",
                      color: "var(--color-bone-white)",
                      fontSize: 18,
                      fontWeight: 400,
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </summary>
                <div style={{ padding: "0 24px 24px", fontSize: 15, lineHeight: 1.6 }}>
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          {/* CTA strip */}
          <div
            style={{
              marginTop: 48,
              padding: 32,
              background: "var(--color-bleed-red)",
              color: "var(--color-bone-white)",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                textTransform: "uppercase",
                margin: 0,
                marginBottom: 12,
                letterSpacing: "-0.01em",
              }}
            >
              Still have questions?
            </h3>
            <p style={{ fontSize: 16, margin: 0, marginBottom: 24, opacity: 0.95 }}>
              Drop us a message and we'll get back to you within 2 business days.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                background: "var(--color-bone-white)",
                color: "var(--color-bleed-red)",
                fontWeight: 700,
                textTransform: "uppercase",
                textDecoration: "none",
                fontSize: 14,
                letterSpacing: "0.02em",
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}