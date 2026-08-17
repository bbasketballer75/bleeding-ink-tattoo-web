/**
 * SectionHeading — reusable heading block for content sections.
 *
 * Optional eyebrow text (kicker), big headline, optional body copy.
 * Anton display font on headline; Inter for eyebrow/body.
 */

import { BLEED_RED } from "@/lib/constants";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  heading,
  body,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div style={{ textAlign: align, marginBottom: 48, maxWidth: align === "center" ? 720 : 960 }}>
      {eyebrow && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: BLEED_RED,
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 6vw, 64px)",
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {heading}
      </h2>
      {body && (
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            marginTop: 20,
            opacity: 0.85,
          }}
        >
          {body}
        </p>
      )}
    </div>
  );
}