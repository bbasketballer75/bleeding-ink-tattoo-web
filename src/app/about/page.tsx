/**
 * About — /about
 *
 * Shop story + artists + commitment.
 * Placeholder names per Austin 2026-08-17 — real bio comes from Isiah.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { ARTISTS } from "@/data/artists";
import { BONE_WHITE, BLEED_RED_BRIGHT, INK_BLACK } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "About",
  description:
    "About Bleeding Ink — custom tattoo studio in the Johnstown Galleria. Walk-ins welcome, free consultation, coverups our specialty. Owner Isiah Jackson, lead artist Courtney Fetzer.",
  path: "/about",
  image: "/og-default.svg",
  keywords: [
    "about bleeding ink johnstown",
    "tattoo shop johnstown pa",
    "isiah jackson tattoo artist",
  ],
});

export default function AboutPage() {
  return (
    <>
      <Hero
        variant="compact"
        eyebrow="About"
        headline="THE SHOP"
        tagline="Small studio, two artists, one philosophy — every piece leaves the shop with our name on it. We take that seriously."
      />

      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
      ]} />

      {/* Story */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            textTransform: "uppercase",
            color: BONE_WHITE,
            margin: 0,
            marginBottom: 24,
            letterSpacing: "-0.01em",
          }}>
            Our story
          </h2>
          <div style={{ fontSize: 17, lineHeight: 1.7, color: BONE_WHITE, opacity: 0.85 }}>
            <p style={{ margin: 0, marginBottom: 20 }}>
              Bleeding Ink opened inside the Johnstown Galleria in 2023 with a single artist, a custom-built
              workstation, and a list of Pittsburgh-area clients who'd been asking us to open closer to home.
              We started small on purpose.
            </p>
            <p style={{ margin: 0, marginBottom: 20 }}>
              We're a custom studio. That means no flash sheets taped to the wall. Every piece that leaves the shop
              was designed for one specific person, drawn or laid out by hand, and inked in a single working session
              where possible. Coverups are our specialty — Isiah spent two years on a coverup apprenticeship before
              opening.
            </p>
            <p style={{ margin: 0, marginBottom: 20 }}>
              The studio is small because that's how we work best. One or two pieces per day, no rushed sessions,
              walk-ins welcome for consultations and flash work. We don't have a TV. We have speakers and good music and
              honest conversation.
            </p>
            <p style={{ margin: 0, marginBottom: 20 }}>
              If you want a custom piece you'll wear for decades, we want to make it with you.
            </p>
          </div>
        </div>
      </section>

      {/* The team */}
      <section style={{ background: "var(--color-bone-white)", color: "var(--color-ink-black)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            textTransform: "uppercase",
            margin: 0,
            marginBottom: 16,
            letterSpacing: "-0.01em",
          }}>
            The team
          </h2>
          <p style={{ fontSize: 16, opacity: 0.7, maxWidth: 720, margin: 0, marginBottom: 40 }}>
            Two artists, one studio. Different styles, same commitment to the work.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
            {ARTISTS.map((artist) => (
              <article key={artist.slug}>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  textTransform: "uppercase",
                  margin: 0,
                  marginBottom: 4,
                  letterSpacing: "-0.01em",
                }}>
                  {artist.name}
                </h3>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-bleed-red)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: 16,
                }}>
                  {artist.role}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.85, margin: 0, marginBottom: 16 }}>
                  {artist.bio}
                </p>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  fontSize: 12,
                  opacity: 0.7,
                }}>
                  {artist.specialties.slice(0, 3).map((s) => (
                    <span key={s} style={{
                      padding: "4px 10px",
                      border: "1px solid rgba(10,10,10,0.15)",
                    }}>
                      {s.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <Link href="/artists" className="btn-primary">See full artist pages</Link>
          </div>
        </div>
      </section>

      {/* What we stand for */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            textTransform: "uppercase",
            color: BONE_WHITE,
            margin: 0,
            marginBottom: 24,
            letterSpacing: "-0.01em",
          }}>
            What we stand for
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, marginTop: 32 }}>
            <Pillar
              title="Walk-ins always welcome"
              body="We don't gatekeep custom work behind consultations. Walk in for a chat, walk in for a small piece, walk in to ask a question. The door is open."
            />
            <Pillar
              title="Free consultations"
              body="Every custom piece starts with a real conversation — what you want, where it goes, what it'll cost. We do this in person, by phone, or DM. No sales pressure, no scripts."
            />
            <Pillar
              title="Honest pricing"
              body="We post starting prices so you have a ballpark. We quote the real number at the consultation. We don't invoice surprise add-ons at the end of a session."
            />
            <Pillar
              title="Touch-ups within 60 days"
              body="Free. Once ink heals, any lightening that needs attention is on us. After 60 days, we still touch up at cost."
            />
            <Pillar
              title="Clean + safe always"
              body="Single-use needles, hospital-grade sterilization, EPA-registered equipment. You shouldn't have to ask about this — it's baseline."
            />
            <Pillar
              title="Coverups our specialty"
              body="If you have an old tattoo that's done its time, we'll design something fresh to cover it. We don't pretend coverups are easy — most aren't. We tell you upfront what's realistic."
            />
          </div>
        </div>
      </section>

      {/* Location + CTA */}
      <section style={{ background: "var(--color-bone-white)", color: "var(--color-ink-black)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            textTransform: "uppercase",
            margin: 0,
            marginBottom: 16,
            letterSpacing: "-0.01em",
          }}>
            Come see us
          </h2>
          <p style={{ fontSize: 16, opacity: 0.8, margin: 0, marginBottom: 24, lineHeight: 1.6 }}>
            Inside the Johnstown Galleria, near the food court. Parking by Entrance 4.
            Walk-ins welcome, or book ahead for guaranteed time.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">Get directions + hours</Link>
            <Link href="/book" className="btn-secondary">Book a session</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 style={{
        color: BLEED_RED_BRIGHT,
        fontSize: 14,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        margin: 0,
        marginBottom: 8,
        fontFamily: "var(--font-display)",
      }}>
        {title}
      </h3>
      <p style={{
        color: BONE_WHITE,
        opacity: 0.8,
        fontSize: 15,
        lineHeight: 1.7,
        margin: 0,
      }}>
        {body}
      </p>
    </div>
  );
}
