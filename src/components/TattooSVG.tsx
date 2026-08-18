/**
 * TattooSVG — inline stylized SVG illustrations of common tattoo motifs.
 *
 * Demo-only: each variant is a stylized representation, NOT a literal piece.
 * For the real site, these would be replaced with photos of actual tattoos
 * the shop has permission to display.
 *
 * Variants: rose, skull, mountain, snake, compass, phoenix, moon, flame
 */

import { BONE_WHITE, INK_BLACK } from "@/lib/constants";

interface TattooSVGProps {
  style: "rose" | "skull" | "mountain" | "snake" | "compass" | "phoenix" | "moon" | "flame";
  accent: string; // hex color
}

export default function TattooSVG({ style, accent }: TattooSVGProps) {
  const baseProps = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 200 200",
    xmlns: "http://www.w3.org/2000/svg",
    style: { maxWidth: 180, maxHeight: 180 },
  } as const;

  return (
    <svg {...baseProps}>
      {/* Rose */}
      {style === "rose" && (
        <g fill="none" stroke={BONE_WHITE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          {/* Petals */}
          <path d="M100 80 C 80 80, 80 100, 100 100 C 120 100, 120 80, 100 80 Z" fill={accent} />
          <path d="M85 95 C 75 85, 95 75, 105 90" fill={accent} />
          <path d="M115 95 C 125 85, 105 75, 95 90" fill={accent} />
          <path d="M100 105 C 90 115, 110 120, 100 105" fill={accent} />
          {/* Center */}
          <circle cx="100" cy="95" r="4" fill={INK_BLACK} />
          {/* Stem */}
          <path d="M100 110 L 100 175" />
          {/* Leaves */}
          <path d="M100 135 C 80 130, 75 145, 100 145" fill={accent} stroke={accent} />
          <path d="M100 155 C 120 150, 125 165, 100 165" fill={accent} stroke={accent} />
        </g>
      )}

      {/* Skull */}
      {style === "skull" && (
        <g fill={BONE_WHITE} stroke={INK_BLACK} strokeWidth={2}>
          {/* Cranium */}
          <ellipse cx="100" cy="85" rx="55" ry="50" />
          {/* Jaw */}
          <path d="M70 115 L 75 145 L 90 150 L 100 145 L 110 150 L 125 145 L 130 115 Z" />
          {/* Eye sockets */}
          <ellipse cx="80" cy="85" rx="14" ry="16" fill={INK_BLACK} />
          <ellipse cx="120" cy="85" rx="14" ry="16" fill={INK_BLACK} />
          {/* Nasal */}
          <path d="M100 100 L 92 115 L 108 115 Z" fill={INK_BLACK} />
          {/* Teeth gaps */}
          <line x1="80" y1="135" x2="120" y2="135" stroke={INK_BLACK} strokeWidth={2} />
          <line x1="88" y1="120" x2="88" y2="150" stroke={INK_BLACK} strokeWidth={2} />
          <line x1="100" y1="120" x2="100" y2="150" stroke={INK_BLACK} strokeWidth={2} />
          <line x1="112" y1="120" x2="112" y2="150" stroke={INK_BLACK} strokeWidth={2} />
        </g>
      )}

      {/* Mountain */}
      {style === "mountain" && (
        <g fill="none" stroke={BONE_WHITE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {/* Back peaks */}
          <path d="M30 140 L 65 80 L 90 110 L 70 140 Z" fill={BONE_WHITE} fillOpacity={0.3} />
          {/* Main peak */}
          <path d="M60 140 L 100 50 L 140 140 Z" fill={BONE_WHITE} />
          {/* Snow caps */}
          <path d="M90 70 L 100 50 L 110 70 L 105 75 L 100 72 L 95 75 Z" fill={accent} stroke={accent} />
          {/* Front peak */}
          <path d="M110 140 L 140 90 L 175 140 Z" fill={BONE_WHITE} fillOpacity={0.6} />
          {/* Sun */}
          <circle cx="155" cy="50" r="10" fill={accent} stroke="none" />
          {/* Ground */}
          <line x1="20" y1="160" x2="180" y2="160" />
          {/* Small detail lines */}
          <path d="M65 80 L 75 95" strokeWidth={1.5} />
          <path d="M140 90 L 145 105" strokeWidth={1.5} />
        </g>
      )}

      {/* Snake */}
      {style === "snake" && (
        <g fill="none" stroke={BONE_WHITE} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          {/* Snake body */}
          <path
            d="M 50 60 C 80 30, 130 100, 160 70 C 170 60, 165 50, 155 60 C 145 70, 145 95, 130 90 C 110 80, 110 50, 90 60 C 70 70, 80 110, 110 130 C 130 140, 140 150, 130 170"
            stroke={accent}
          />
          {/* Head */}
          <ellipse cx="48" cy="62" rx="10" ry="7" transform="rotate(-30 48 62)" fill={accent} />
          {/* Eyes */}
          <circle cx="44" cy="58" r="1.5" fill={INK_BLACK} stroke="none" />
          <circle cx="52" cy="58" r="1.5" fill={INK_BLACK} stroke="none" />
          {/* Tongue */}
          <path d="M 38 60 L 30 55 L 32 60" stroke={accent} strokeWidth={2} />
          <path d="M 38 60 L 30 65 L 32 60" stroke={accent} strokeWidth={2} />
          {/* Dagger through body */}
          <line x1="100" y1="60" x2="100" y2="140" stroke={BONE_WHITE} strokeWidth={3} />
          <path d="M 95 60 L 105 60 L 100 50 Z" fill={BONE_WHITE} stroke={BONE_WHITE} strokeWidth={2} />
        </g>
      )}

      {/* Compass */}
      {style === "compass" && (
        <g fill="none" stroke={BONE_WHITE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {/* Outer ring */}
          <circle cx="100" cy="100" r="80" />
          <circle cx="100" cy="100" r="70" stroke={accent} />
          {/* Tick marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 100 + 75 * Math.cos(rad);
            const y1 = 100 + 75 * Math.sin(rad);
            const x2 = 100 + 65 * Math.cos(rad);
            const y2 = 100 + 65 * Math.sin(rad);
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BONE_WHITE} strokeWidth={2} />;
          })}
          {/* Star points */}
          <path d="M 100 30 L 110 100 L 100 170 L 90 100 Z" fill={BONE_WHITE} />
          <path d="M 30 100 L 100 90 L 170 100 L 100 110 Z" fill={accent} />
          {/* Center dot */}
          <circle cx="100" cy="100" r="6" fill={accent} />
          <circle cx="100" cy="100" r="3" fill={INK_BLACK} />
          {/* N */}
          <text x="100" y="22" textAnchor="middle" fill={BONE_WHITE} fontSize="14" fontWeight="700" stroke="none">N</text>
          {/* S */}
          <text x="100" y="186" textAnchor="middle" fill={BONE_WHITE} fontSize="14" fontWeight="700" stroke="none">S</text>
          {/* E */}
          <text x="180" y="105" textAnchor="middle" fill={BONE_WHITE} fontSize="14" fontWeight="700" stroke="none">E</text>
          {/* W */}
          <text x="20" y="105" textAnchor="middle" fill={BONE_WHITE} fontSize="14" fontWeight="700" stroke="none">W</text>
        </g>
      )}

      {/* Phoenix */}
      {style === "phoenix" && (
        <g fill="none" stroke={BONE_WHITE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {/* Body */}
          <ellipse cx="100" cy="110" rx="15" ry="35" fill={accent} />
          {/* Head */}
          <circle cx="100" cy="65" r="14" fill={accent} />
          {/* Beak */}
          <path d="M 100 70 L 105 78 L 100 78 Z" fill={BONE_WHITE} />
          {/* Eye */}
          <circle cx="100" cy="62" r="2" fill={INK_BLACK} stroke="none" />
          {/* Crest */}
          <path d="M 100 50 L 95 35 L 105 35 L 100 50" fill={accent} />
          <path d="M 90 52 L 80 40 L 95 45" fill={accent} />
          <path d="M 110 52 L 120 40 L 105 45" fill={accent} />
          {/* Left wing */}
          <path d="M 85 100 C 50 90, 30 60, 25 100 C 35 110, 50 110, 85 115 Z" fill={accent} />
          <path d="M 85 105 C 55 100, 40 80, 35 110" strokeWidth={1.5} />
          {/* Right wing */}
          <path d="M 115 100 C 150 90, 170 60, 175 100 C 165 110, 150 110, 115 115 Z" fill={accent} />
          <path d="M 115 105 C 145 100, 160 80, 165 110" strokeWidth={1.5} />
          {/* Tail feathers */}
          <path d="M 100 145 C 90 170, 80 175, 85 185 L 100 165 Z" fill={accent} />
          <path d="M 100 145 C 110 170, 120 175, 115 185 L 100 165 Z" fill={accent} />
          <path d="M 100 150 L 100 190" stroke={accent} strokeWidth={3} />
        </g>
      )}

      {/* Moon */}
      {style === "moon" && (
        <g fill="none" stroke={BONE_WHITE} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Crescent moon */}
          <path
            d="M 130 50 A 70 70 0 1 0 130 150 A 50 50 0 1 1 130 50 Z"
            fill={BONE_WHITE}
            stroke={BONE_WHITE}
          />
          {/* Stars */}
          <g fill={accent} stroke="none">
            <path d="M 50 50 L 52 56 L 58 56 L 53 60 L 55 66 L 50 62 L 45 66 L 47 60 L 42 56 L 48 56 Z" />
            <circle cx="35" cy="100" r="2" />
            <circle cx="65" cy="160" r="2.5" />
            <circle cx="170" cy="80" r="2" />
          </g>
          {/* Sparkles */}
          <g stroke={BONE_WHITE} strokeWidth={1.5}>
            <line x1="40" y1="35" x2="40" y2="45" />
            <line x1="35" y1="40" x2="45" y2="40" />
            <line x1="160" y1="130" x2="160" y2="138" />
            <line x1="156" y1="134" x2="164" y2="134" />
          </g>
        </g>
      )}

      {/* Flame */}
      {style === "flame" && (
        <g fill="none" stroke={BONE_WHITE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          {/* Outer flame */}
          <path
            d="M 100 30 C 80 60, 70 80, 75 110 C 65 110, 55 120, 60 140 C 50 145, 50 165, 70 175 L 130 175 C 150 165, 150 145, 140 140 C 145 120, 135 110, 125 110 C 130 80, 120 60, 100 30 Z"
            fill={accent}
            stroke={BONE_WHITE}
          />
          {/* Inner flame */}
          <path
            d="M 100 70 C 90 90, 90 110, 100 130 C 95 145, 85 150, 85 165 L 115 165 C 115 150, 105 145, 100 130 C 110 110, 110 90, 100 70 Z"
            fill={accent}
            stroke={BONE_WHITE}
            strokeOpacity={0.6}
          />
          {/* Core */}
          <path
            d="M 100 100 C 95 115, 95 130, 100 145 C 100 155, 95 160, 95 165 L 105 165 C 105 160, 100 155, 100 145 C 105 130, 105 115, 100 100 Z"
            fill={BONE_WHITE}
            stroke="none"
          />
        </g>
      )}
    </svg>
  );
}