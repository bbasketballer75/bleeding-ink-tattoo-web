/**
 * Hero — full-bleed hero block for home + inner pages.
 *
 * Variants:
 *   - "home"     : big headline, tagline, dual CTA, blood-drip accent
 *   - "compact"  : shorter, single CTA, for inner pages
 *
 * Background is a LAYERED composition (designed 2026-08-18):
 *   1. Solid INK_BLACK base
 *   2. Outer radial vignette: BLEED_RED_700 -> INK_BLACK (rim falloff)
 *   3. Inner radial hot spot: BLEED_RED_500/300 -> transparent (center glow)
 *   4. Subtle noise/grain overlay: bone-white alpha 0.02 (paper texture)
 *   5. SVG backdrop (drip, cross, star, grid, smoke) at 0.55 opacity
 *   6. Animated BLEED_RED halo behind headline (framer-motion subtle scale loop)
 *   7. Headline has BLEED_RED text-shadow for depth
 *   8. Permanent Marker copy has an ink-drip SVG underline accent
 *
 * Honors AGENTS.md: inline style={{}} only, imports from constants.ts.
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BLEED_RED, BONE_WHITE, INK_BLACK } from "@/lib/constants";
import HeroBackdrop from "./HeroBackdrop";

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
        // LAYERED background (AGENTS.md: inline only, use constants):
        //   - base INK_BLACK solid
        //   - outer vignette: BLEED_RED_700 (#5f0000) -> transparent
        //   - inner hot spot: BLEED_RED_500 (#8B0000) at top -> transparent
        //   - total of 3 stacked radial-gradients (CSS supports comma-separated)
        background: backgroundImage
          ? `linear-gradient(rgba(10, 10, 10, 0.5), rgba(10, 10, 10, 0.85)), url(${backgroundImage})`
          : [
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 0, 0, 0.32) 0%, rgba(139, 0, 0, 0.08) 45%, transparent 70%)",
              "radial-gradient(ellipse 90% 100% at 50% 100%, rgba(95, 0, 0, 0.22) 0%, transparent 60%)",
              "radial-gradient(ellipse 100% 100% at 50% 50%, #0A0A0A 0%, #0A0A0A 70%)",
            ].join(", "),
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "120px 24px 60px",
        overflow: "hidden",
      }}
    >
      {/* Subtle paper-grain noise overlay — bone-white alpha, fixed full-bleed */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(245,241,232,0.025) 0%, transparent 50%), " +
            "radial-gradient(circle at 80% 70%, rgba(245,241,232,0.02) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Custom SVG backdrop art (existing — bumped to higher opacity below) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <HeroBackdrop opacity={0.55} />
      </div>

      {/* Animated BLEED_RED halo behind headline — subtle breathing scale loop */}
      {!isCompact && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: [0.5, 0.7, 0.5], scale: [1, 1.04, 1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(800px, 80vw)",
            height: "min(800px, 80vw)",
            background:
              "radial-gradient(circle, rgba(139, 0, 0, 0.18) 0%, transparent 65%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      )}

      {/* Top drip accent — only on home */}
      {!isCompact && (
        <svg
          aria-hidden
          viewBox="0 0 32 48"
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 56,
            height: 84,
            fill: BLEED_RED,
            opacity: 0.75,
            zIndex: 5,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))",
          }}
        >
          <path d="M16 0 C16 0 32 18 32 30 C32 40 24 48 16 48 C8 48 0 40 0 30 C0 18 16 0 16 0 Z" />
        </svg>
      )}

      <div style={{ maxWidth: 980, width: "100%", position: "relative", zIndex: 4 }}>
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
        {/* Headline — with BLEED_RED text-shadow for depth (no outline, just soft red glow) */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isCompact ? "clamp(40px, 8vw, 80px)" : "clamp(56px, 12vw, 140px)",
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 0.92,
            margin: 0,
            color: BONE_WHITE,
            textShadow: isCompact
              ? "0 0 30px rgba(139, 0, 0, 0.25), 0 2px 0 rgba(0,0,0,0.4)"
              : "0 0 60px rgba(139, 0, 0, 0.45), 0 0 120px rgba(139, 0, 0, 0.25), 0 2px 0 rgba(0,0,0,0.5)",
          }}
        >
          {headline.split(" ").map((word, i, arr) => (
            <span key={i}>
              {word}
              {i < arr.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        {/* Tagline — Permanent Marker, with an ink-drip SVG underline accent */}
        {tagline && (
          <div style={{ position: "relative", display: "inline-block" }}>
            <p
              style={{
                fontFamily: "var(--font-marker)",
                fontSize: isCompact ? 20 : 26,
                marginTop: isCompact ? 20 : 28,
                marginBottom: isCompact ? 28 : 36,
                opacity: 0.92,
                letterSpacing: "0.01em",
                maxWidth: 640,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {tagline}
            </p>
            {/* Tiny ink-drip underline beneath the tagline — only on home */}
            {!isCompact && (
              <svg
                aria-hidden
                viewBox="0 0 64 12"
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -10,
                  transform: "translateX(-50%)",
                  width: 64,
                  height: 12,
                  fill: BLEED_RED,
                  opacity: 0.6,
                }}
              >
                {/* asymmetric ink-drip: a round pool that tapers to a thin point */}
                <path d="M4 0 C4 0 8 4 8 7 C8 10 6 12 4 12 C2 12 0 10 0 7 C0 4 4 0 4 0 Z M14 0 L18 0 L18 4 L14 4 Z M22 0 C22 0 24 2 24 5 L24 9 L20 9 L20 5 C20 2 22 0 22 0 Z" />
              </svg>
            )}
          </div>
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
