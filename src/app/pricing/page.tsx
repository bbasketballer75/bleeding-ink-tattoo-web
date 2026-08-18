/**
 * Pricing — /pricing
 *
 * Per Austin 2026-08-17: "DM for quote · $65 deposit" — no hourly rates shown.
 * Starting prices per service are shown as honest "from" estimates;
 * final quotes always come from the free consultation.
 *
 * demo-only placeholder markup — Isiah can finalize exact ranges.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { BONE_WHITE, BLEED_RED_BRIGHT, INK_BLACK } from "@/lib/constants";
import { formatUSD } from "@/lib/utils";
import { DEPOSIT_MIN } from "@/lib/constants";
import { SERVICES } from "@/data/services";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Pricing at Bleeding Ink in Johnstown, PA: starting prices per service, $65 non-refundable deposit, free consultations, walk-ins welcome. No hourly rates published — quote always given in person.",
  path: "/pricing",
  image: "/og-default.svg",
  keywords: [
    "tattoo pricing johnstown pa",
    "tattoo shop deposit johnstown",
    "how much does a tattoo cost johnstown",
    "bleeding ink pricing",
  ],
});

export default function PricingPage() {
  return (
    <>
      <Hero
        variant="compact"
        eyebrow="Pricing"
        headline="HONEST PRICING"
        tagline="No hourly rates. No surprises. Free consultation first — we tell you the price before any ink goes down."
      />

      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Pricing", href: "/pricing" },
      ]} />

      {/* Three pillars — deposit · consultation · quote */}
      <section style={{ background: "var(--color-bone-white)", color: "var(--color-ink-black)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div style={{ padding: 24, border: "2px solid var(--color-bleed-red)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-bleed-red)", marginBottom: 8 }}>
                Deposit
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1 }}>{formatUSD(DEPOSIT_MIN)}</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>
                Non-refundable. Comes off your final tattoo price.
              </div>
            </div>

            <div style={{ padding: 24, border: "2px solid rgba(10,10,10,0.15)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Consultation
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 1 }}>Free</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>
                Walk-in or book ahead. No obligation to commit.
              </div>
            </div>

            <div style={{ padding: 24, border: "2px solid rgba(10,10,10,0.15)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Hourly Rate
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, lineHeight: 1.1 }}>By quote</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>
                Realistic quote at consultation. No surprise add-ons.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Starting prices per service */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            margin: 0,
            marginBottom: 16,
            color: BONE_WHITE,
          }}>
            Starting prices by service
          </h2>
          <p style={{
            color: BONE_WHITE,
            opacity: 0.7,
            maxWidth: 720,
            marginBottom: 40,
            fontSize: 16,
          }}>
            These are honest starting points — small flash pieces, quick coverups, single-color linework. Anything with more
            detail or color saturation is quoted in person at the free consultation. Call for a same-day estimate on
            walk-in flash.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}>
            {SERVICES.filter((s) => s.startingPrice).map((s) => (
              <div key={s.slug}
                style={{
                  background: "rgba(245, 241, 232, 0.04)",
                  border: "1px solid rgba(245, 241, 232, 0.12)",
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: BLEED_RED_BRIGHT,
                }}>
                  {s.slug.replace("-", " ")}
                </div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  lineHeight: 1,
                  color: BONE_WHITE,
                  marginBottom: 8,
                }}>
                  {s.startingPrice}
                </div>
                <div style={{
                  fontSize: 14,
                  color: BONE_WHITE,
                  opacity: 0.75,
                  lineHeight: 1.6,
                }}>
                  {s.shortDescription}
                </div>
                {s.duration && (
                  <div style={{ fontSize: 12, opacity: 0.6, color: BONE_WHITE, marginTop: 8 }}>
                    Typical duration: {s.duration}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it actually works */}
      <section style={{ background: "var(--color-bone-white)", color: "var(--color-ink-black)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            margin: 0,
            marginBottom: 24,
          }}>
            How pricing actually works
          </h2>
          <div style={{ fontSize: 16, lineHeight: 1.7, color: "var(--color-ink-black)", opacity: 0.85 }}>
            <p style={{ margin: 0, marginBottom: 16 }}>
              <strong style={{ opacity: 1 }}>We don't post hourly rates.</strong> Tattoo pricing depends on the piece — size,
              detail, placement, color, skin. Every shop will quote you differently because every artist works differently.
              We'd rather you{" "}
              <span style={{ textDecoration: "underline" }}>talk to us</span> than trust a number on a website.
            </p>
            <p style={{ margin: 0, marginBottom: 16 }}>
              <strong style={{ opacity: 1 }}>The {formatUSD(DEPOSIT_MIN)} is the only dollar we publish.</strong> It's
              non-refundable. It comes off your final tattoo price at the session. We accept it
              in-person or via the booking link — whichever works for you. Reschedules with 48+ hours notice don't lose
              the deposit.
            </p>
            <p style={{ margin: 0, marginBottom: 16 }}>
              <strong style={{ opacity: 1 }}>Touch-ups within 60 days are free.</strong> Once ink heals, any lightening that
              needs work is on us. After 60 days, we still do touch-ups at cost — usually the shop minimum.
            </p>
            <p style={{ margin: 0, marginBottom: 16 }}>
              <strong style={{ opacity: 1 }}>Cash, card, Venmo all welcome.</strong> Deposit at booking, balance at session.
            </p>
          </div>

          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "2px solid rgba(10,10,10,0.1)" }}>
            <p style={{ fontSize: 18, margin: 0, marginBottom: 16 }}>
              <strong>Walk-ins welcome.</strong> Flash pieces and small consultations happen same-day.
              Custom work needs the consultation first so we can design with you.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link href="/book" className="btn-primary">Book a free consultation</Link>
              <Link href="/services" className="btn-secondary">See all services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-style Quick answers */}
      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            textTransform: "uppercase",
            color: BONE_WHITE,
            margin: 0,
            marginBottom: 24,
          }}>
            Common pricing questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FaqItem q="Why won't you post hourly rates?">
              Because every piece is different. Hourly rates encourage clients to pick the cheapest artist rather
              than the right artist for their idea. We'd rather you come in, talk to us, and get a real number — most
              of our clients tell us we were lower than they expected.
            </FaqItem>
            <FaqItem q="Does the deposit go toward my tattoo?">
              Yes. The full {formatUSD(DEPOSIT_MIN)} deposit comes off the final price at your session.
            </FaqItem>
            <FaqItem q="Is the deposit refundable?">
              No. The deposit locks your appointment slot — that's why we don't take cancellations inside 48 hours.
              Reschedule free with 48+ hours notice.
            </FaqItem>
            <FaqItem q="Do you have a shop minimum?">
              We have session minimums that vary by artist and piece. For most walk-in flash pieces the floor is{" "}
              {formatUSD(100)}–{formatUSD(150)}. Custom work starts higher. We tell you upfront at the consultation.
            </FaqItem>
            <FaqItem q="Can I pay in installments?">
              The deposit is required to book. The balance is due at your session — we don't do payment plans.
              Most of our clients save the balance after their consultation.
            </FaqItem>
          </div>
        </div>
      </section>
    </>
  );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details style={{
      background: "rgba(245, 241, 232, 0.04)",
      border: "1px solid rgba(245, 241, 232, 0.12)",
      padding: 20,
    }}>
      <summary style={{
        color: BONE_WHITE,
        fontWeight: 700,
        fontSize: 16,
        cursor: "pointer",
        listStyle: "none",
      }}>
        {q}
      </summary>
      <div style={{
        color: BONE_WHITE,
        opacity: 0.8,
        fontSize: 15,
        lineHeight: 1.6,
        marginTop: 12,
      }}>
        {children}
      </div>
    </details>
  );
}
