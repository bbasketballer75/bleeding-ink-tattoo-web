/**
 * HeroBackdrop — abstract ink-themed SVG art for the home hero.
 *
 * Replaces the bland radial gradient with a layered illustration:
 * - Drip/blood splatter forms
 * - Geometric grid lines (tattoo stencil vibe)
 * - Smoke wisps
 * - A central stylized anchor (cross/star motif)
 *
 * Drawn behind the headline content, fixed to the section.
 *
 * `opacity` (default 0.4) controls overall visibility; parent (Hero.tsx)
 * may pass a higher value when other depth layers are added beneath.
 */

interface HeroBackdropProps {
  opacity?: number;
}

export default function HeroBackdrop({ opacity = 0.4 }: HeroBackdropProps = {}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <defs>
        <radialGradient id="bleedGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#8B0000" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#8B0000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="smokeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#F5F1E8" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#F5F1E8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <rect width="100%" height="100%" fill="url(#bleedGlow)" />

      {/* Stencil grid lines — bumped opacity for legibility */}
      <g stroke="#8B0000" strokeWidth="0.5" opacity="0.5">
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={50 * i} x2="1440" y2={50 * i} />
        ))}
        {Array.from({ length: 29 }).map((_, i) => (
          <line key={`v${i}`} x1={50 * i} y1="0" x2={50 * i} y2="900" />
        ))}
      </g>

      {/* (Decorative cross+star removed 2026-08-18: too generic, disconnected from headline.
          Kept the drip motifs and scattered texture — they read as authentic tattoo stencil
          rather than arbitrary geometric shapes.) */}

      {/* Drip forms */}
      <g fill="#8B0000" opacity="0.5">
        <path d="M 350 100 C 350 100 380 200 380 240 C 380 270 365 285 350 285 C 335 285 320 270 320 240 C 320 200 350 100 350 100 Z" />
        <path d="M 1100 200 C 1100 200 1130 290 1130 325 C 1130 355 1115 370 1100 370 C 1085 370 1070 355 1070 325 C 1070 290 1100 200 1100 200 Z" />
        <path d="M 720 30 C 720 30 740 80 740 100 C 740 115 730 125 720 125 C 710 125 700 115 700 100 C 700 80 720 30 720 30 Z" />
      </g>

      {/* Smoke wisps */}
      <g fill="url(#smokeGrad)" opacity="0.7">
        <ellipse cx="400" cy="850" rx="300" ry="100" />
        <ellipse cx="1100" cy="850" rx="350" ry="120" />
      </g>

      {/* Texture — small scattered marks */}
      <g fill="#F5F1E8" opacity="0.25">
        {Array.from({ length: 60 }).map((_, i) => {
          const x = (i * 137) % 1440;
          const y = ((i * 89) % 800) + 50;
          return <circle key={i} cx={x} cy={y} r={(i % 4) + 1} />;
        })}
      </g>
    </svg>
  );
}