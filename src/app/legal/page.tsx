/**
 * Legal — /legal.
 *
 * Combined Privacy Policy + Terms of Service. Single page (one scroll)
 * keeps the demo simple. Real shop would split + review with an attorney.
 *
 * Privacy & Terms are placeholder content marked as "demo" — a real launch
 * requires attorney review before collecting personal data.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SHOP, BONE_WHITE, BLEED_RED } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Privacy & Terms",
  description:
    "Bleeding Ink's privacy policy and terms of service. How we collect, store, and use your information when you book a consultation or browse this site.",
  path: "/legal",
  image: "/og-default.svg",
  keywords: ["bleeding ink privacy", "tattoo shop terms", "consent form"],
});

const LAST_UPDATED = "August 18, 2026";

const SECTIONS = [
  {
    id: "privacy",
    eyebrow: "Privacy Policy",
    title: "What we collect · how we use it",
    body: (
      <>
        <p style={{ margin: 0, marginBottom: 16 }}>
          We collect information you give us directly: your name, phone, email,
          Instagram handle (if you provide one), the description of the tattoo
          you want, and the photos you attach to your booking inquiry.
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          We use this information for one purpose: getting back to you about your
          tattoo. Your name + phone + description goes to Isiah and Courtney. Your
          email gets a copy of the conversation if you provide one. We do not
          sell, rent, or trade your information with third parties. We don&apos;t run
          ad retargeting on this site.
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          Consultation inquiries stored on our booking system (GlossGenius, after
          launch) are retained for the duration of our business relationship plus
          seven years for tax purposes. You can ask us to delete your inquiry
          records at any time by emailing{" "}
          <code style={{ background: "rgba(10,10,10,0.06)", padding: "2px 6px" }}>
            privacy@bleedingink.example
          </code>
          .
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          This demo site is hosted on Cloudflare Workers. Cloudflare logs visit
          metadata (timestamp, country-level IP, requested URL) for 30 days
          for abuse mitigation. We do not have access to logs from the workers
          tier beyond aggregate visitor counts.
        </p>
      </>
    ),
  },
  {
    id: "terms",
    eyebrow: "Terms of Service",
    title: "Booking, deposit, cancellation, age",
    body: (
      <>
        <p style={{ margin: 0, marginBottom: 16 }}>
          <strong>Walk-ins are always welcome</strong> for consultations and small
          flash work. For custom pieces, we book sessions by appointment once a
          deposit is on file.
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          <strong>The $65 deposit is non-refundable.</strong> It comes off the
          final price of your tattoo. Reschedules with 48+ hours notice keep the
          deposit on file for a future appointment. Reschedules within 48 hours,
          or no-shows, forfeit the deposit and require a fresh one.
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          <strong>You must be 18+</strong> to get tattooed at this shop, or have a
          parent or guardian present at the consultation (we&apos;ll explain the rest
          in person — state law applies). Valid photo ID required at every session.
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          <strong>Consent and care</strong> happen at the consultation: allergies,
          skin conditions, medications, and any prior complications all need a
          heads-up. We follow CDC and state health-department guidelines for
          sterilization and aseptic technique.
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          <strong>Refund policy:</strong> deposits are non-refundable. Refunds on
          the final tattoo price, where applicable, are determined case-by-case.
          Touch-ups within six months of the original session are included.
        </p>
      </>
    ),
  },
  {
    id: "photos",
    eyebrow: "Photo + portfolio rights",
    title: "If we post your piece",
    body: (
      <>
        <p style={{ margin: 0, marginBottom: 16 }}>
          We love showing finished work. <strong>By default we use your tattoo in
          portfolio photos and social media posts</strong> — it&apos;s a huge part of
          how new clients find us.
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          If you&apos;d rather we didn&apos;t, tell us at the consultation or any time
          afterward by emailing{" "}
          <code style={{ background: "rgba(10,10,10,0.06)", padding: "2px 6px" }}>
            studio@bleedingink.example
          </code>
          . We&apos;ll keep your piece off our feed and offline portfolio, retroactive
          if needed.
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          When we post your piece, we attach your first name and Instagram handle
          only if you ask us to. Anonymous portfolio photos are also welcome.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    eyebrow: "Cookies + analytics",
    title: "How this site tracks you",
    body: (
      <>
        <p style={{ margin: 0, marginBottom: 16 }}>
          This demo site uses no analytics, no tracking pixels, and no
          advertising cookies. The only state we store in your browser is the
          consultation form draft you have typed but not yet submitted, which we
          keep in <code>localStorage</code> so a refresh doesn&apos;t lose your work.
        </p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          Cloudflare Workers sets a single technical cookie for load balancing
          (<code>__cf_bm</code>) to distinguish bots from real visitors. That
          cookie expires after 30 minutes of inactivity. We do not use it to
          track you across sessions.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    eyebrow: "Questions",
    title: "How to reach us",
    body: (
      <p style={{ margin: 0 }}>
                Email{" "}
                <code style={{ background: "rgba(10,10,10,0.06)", padding: "2px 6px" }}>
                  studio@bleedingink.example
                </code>{" "}
                or call{" "}
                <code style={{ background: "rgba(10,10,10,0.06)", padding: "2px 6px" }}>
                  {SHOP.phone.display}
                </code>
                . In person: {SHOP.address.mall}, {SHOP.address.city}.
              </p>
    ),
  },
];

export default function LegalPage() {
  return (
    <>
      <Hero variant="compact" eyebrow="Legal" headline="PRIVACY & TERMS" />

      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Legal", href: "/legal" },
      ]} />

      {/* Demo notice bar */}
      <section style={{ background: BLEED_RED, color: BONE_WHITE, padding: "12px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
          DEMO CONTENT — placeholder text. Real launch requires attorney review before any personal data is collected.
        </p>
      </section>

      {/* Last updated */}
      <section style={{ padding: "40px 24px 16px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.7, textAlign: "center" }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* TOC */}
      <section style={{ padding: "0 24px 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <nav
            aria-label="Sections"
            style={{
              padding: 20,
              border: "1px solid rgba(245, 241, 232, 0.15)",
              background: "rgba(245, 241, 232, 0.04)",
            }}
          >
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0, marginBottom: 12, opacity: 0.7 }}>
              Jump to
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    style={{ fontSize: 14, color: BONE_WHITE, textDecoration: "underline", textUnderlineOffset: 3 }}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Sections */}
      <section style={{ padding: "20px 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 56 }}>
          {SECTIONS.map((s) => (
            <article key={s.id} id={s.id} style={{ scrollMarginTop: 80 }}>
              <p style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: BLEED_RED,
                margin: 0,
                marginBottom: 12,
              }}>
                {s.eyebrow}
              </p>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 36px)",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                margin: 0,
                marginBottom: 24,
                lineHeight: 1.05,
              }}>
                {s.title}
              </h3>
              <div style={{ fontSize: 16, lineHeight: 1.65, opacity: 0.85 }}>
                {s.body}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
