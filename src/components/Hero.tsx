/**
 * Hero — full-bleed hero block for home + inner pages.
 *
 * Variants:
 *   - "home"     : big headline, tagline, dual CTA, blood-drip accent
 *   - "compact"  : shorter, single CTA, for inner pages
 *
 * Background image is optional. When not provided, uses brand ink-black
 * with a subtle radial bleed-red gradient.
 */

"use client";

import Link from "next/link";
import { BLEED_RED, BONE_WHITE, INK_BLACK } from "@/lib/constants";

interface HeroProps {
  variant?: "home" | "compact";
  headline: string;
  tagline?: string;
  eyebrow?: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  backgroundImage?: string;
}

export default function Hero({
  variant = "home",
  headline,
  tagline,
  eyebrow,
  primaryCta,
  secondaryCta,
  backgroundImage,
}: HeroProps) {
  const isCompact = variant === "compact";

  return (
    <section
      style={{
        position: "relative",
        minHeight: isCompact ? "60vh" : "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: BONE_WHITE,
        background: backgroundImage
          ? `linear-gradient(rgba(10, 10, 10, 0.5), rgba(10, 10, 10, 0.85)), url(${backgroundImage})`
          : `radial-gradient(ellipse at top, rgba(139, 0, 0, 0.18) 0%, ${INK_BLACK} 70%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "120px 24px 60px",
        overflow: "hidden",
      }}
    >
      {/* Top drip accent — only on home */}
      {!isCompact && (
        <svg
          aria-hidden
          viewBox="0 0 32 48"
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            width: 28,
            height: 42,
            fill: BLEED_RED,
            opacity: 0.6,
          }}
        >
          <path d="M16 0 C16 0 32 18 32 30 C32 40 24 48 16 48 C8 48 0 40 0 30 C0 18 16 0 16 0 Z" />
        </svg>
      )}

      <div style={{ maxWidth: 980, width: "100%" }}>
        {/* Eyebrow — small kicker text above headline */}
        {eyebrow && (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: BLEED_RED,
              marginBottom: 16,
            }}
          >
            {eyebrow}
          </div>
        )}
        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isCompact ? "clamp(40px, 8vw, 80px)" : "clamp(56px, 12vw, 140px)",
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 0.92,
            margin: 0,
            color: BONE_WHITE,
          }}
        >
          {headline.split(" ").map((word, i, arr) => (
            <span key={i}>
              {word}
              {i < arr.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        {/* Tagline — Permanent Marker, italicized feel */}
        {tagline && (
          <p
            style={{
              fontFamily: "var(--font-marker)",
              fontSize: isCompact ? 20 : 26,
              marginTop: isCompact ? 20 : 28,
              marginBottom: isCompact ? 28 : 36,
              opacity: 0.9,
              letterSpacing: "0.01em",
              maxWidth: 640,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {tagline}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="btn-primary"
                style={{ fontSize: 16, padding: "16px 32px" }}
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="btn-secondary"
                style={{
                  fontSize: 16,
                  padding: "16px 32px",
                  color: BONE_WHITE,
                  borderColor: BONE_WHITE,
                }}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}