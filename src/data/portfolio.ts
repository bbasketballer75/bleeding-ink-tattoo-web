/**
 * Portfolio piece — one tattoo shown on the site.
 * For demo purposes, all images are inline SVGs (no licensing / permission issues).
 */

export interface PortfolioPiece {
  id: string;
  title: string;
  style: string;       // traditional | fine-line | realism | blackwork | coverup | color | neo-traditional | Japanese
  artist: "isiah-jackson" | "courtney-fetzer";
  description: string;
  placement: string;    // forearm, back, ribs, calf, etc.
  sizeInches: string;   // 4x6, 6x8, full sleeve, etc.
  svgStyle: "rose" | "skull" | "mountain" | "snake" | "compass" | "phoenix" | "moon" | "flame";
  accent: string;       // hex color for SVG
}

export const PORTFOLIO: PortfolioPiece[] = [
  {
    id: "demo-traditional-rose",
    title: "Traditional Rose",
    style: "Traditional",
    artist: "isiah-jackson",
    description: "Bold-lined classic American traditional rose with full-color petals and green leaves. A timeless piece that ages beautifully on any placement.",
    placement: "Forearm",
    sizeInches: "5×7",
    svgStyle: "rose",
    accent: "#C0382B",
  },
  {
    id: "demo-blackwork-skull",
    title: "Blackwork Skull",
    style: "Blackwork",
    artist: "isiah-jackson",
    description: "High-contrast geometric skull with deep solid black fill and negative-space detail. Clean lines, no shading tricks — just ink and skin.",
    placement: "Calf",
    sizeInches: "6×8",
    svgStyle: "skull",
    accent: "#F5F1E8",
  },
  {
    id: "demo-fineline-mountain",
    title: "Fine-Line Mountains",
    style: "Fine Line",
    artist: "courtney-fetzer",
    description: "Single-needle mountain range with delicate line weight variations. Heals crisp, looks elegant, ages gracefully on softer skin tones.",
    placement: "Inner forearm",
    sizeInches: "3×4",
    svgStyle: "mountain",
    accent: "#8A8A8A",
  },
  {
    id: "demo-neotrad-snake",
    title: "Neo-Traditional Snake",
    style: "Neo-Traditional",
    artist: "isiah-jackson",
    description: "Bold serpent wrapped around a dagger, neo-traditional color palette of saturated greens and warm yellows. Modern take on a classic motif.",
    placement: "Upper arm",
    sizeInches: "8×10",
    svgStyle: "snake",
    accent: "#5A7A3A",
  },
  {
    id: "demo-coverup-compass",
    title: "Coverup Compass",
    style: "Coverup",
    artist: "isiah-jackson",
    description: "Full-coverage compass rose designed to mask a faded 10-year-old piece. Custom linework over the existing tattoo with a starburst background.",
    placement: "Upper back",
    sizeInches: "10×10",
    svgStyle: "compass",
    accent: "#C9A84C",
  },
  {
    id: "demo-color-phoenix",
    title: "Color Phoenix",
    style: "Color",
    artist: "courtney-fetzer",
    description: "Vibrant phoenix in full color realism — saturated oranges, deep teals, and warm yellows blended across the wing feathers.",
    placement: "Thigh",
    sizeInches: "8×12",
    svgStyle: "phoenix",
    accent: "#D85A28",
  },
  {
    id: "demo-fineliner-moon",
    title: "Crescent Moon",
    style: "Fine Line",
    artist: "courtney-fetzer",
    description: "Minimalist crescent moon with scattered star detail. Single-needle precision for the cleanest possible lines.",
    placement: "Wrist",
    sizeInches: "2×3",
    svgStyle: "moon",
    accent: "#C9A84C",
  },
  {
    id: "demo-traditional-flame",
    title: "Traditional Flame",
    style: "Traditional",
    artist: "isiah-jackson",
    description: "Old-school flame design with bold black outlines and saturated red/orange fill. A staple coverup accent and standalone piece.",
    placement: "Shoulder",
    sizeInches: "4×6",
    svgStyle: "flame",
    accent: "#E25822",
  },
];

export const PORTFOLIO_STYLES = Array.from(
  new Set(PORTFOLIO.map((p) => p.style))
).sort();