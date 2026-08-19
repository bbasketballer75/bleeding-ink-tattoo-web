/**
 * Portfolio piece — one tattoo shown on the site.
 *
 * Real photos (when present) are loaded from /public/images/portfolio/<artist>/.
 * For demo entries without signed-off imagery, svgStyle + accent render the
 * inline fallback. Once Isiah approves real photos, set imageUrl + leave svgStyle
 * as the placeholder fallback (defense-in-depth).
 */

export interface PortfolioPiece {
  id: string;
  title: string;
  style: string;       // traditional | fine-line | realism | blackwork | coverup | color | neo-traditional | Japanese
  artist: "isiah-jackson" | "courtney-fetzer";
  description: string;
  placement: string;    // forearm, back, ribs, calf, etc.
  sizeInches: string;   // 4x6, 6x8, full sleeve, etc.
  imageUrl?: string;    // /public/images/portfolio/<artist>/<file>.jpg (preferred)
  svgStyle: "rose" | "skull" | "mountain" | "snake" | "compass" | "phoenix" | "moon" | "flame";
  accent: string;       // hex color for SVG fallback
}

// Image assignment (real IG photos from @ibleedink_600, with owner's sign-off)
// - fresh-ink-forearm: Black-grey realism tattoo (mid-session, fresh blood)
// - shop-isiah: Isiah in his chair (owner presence / branding)
// - black-grey-chest: Large black-grey composition on chest
// - sleeve-work: Bold colorful sleeve piece
// - color-religious: Cross + rosary + lilies (color work)
// - fine-line-lilies: Delicate pink/grey fine line work
// - skull-flames: Dark heavy-handed piece
// - hand-piece: Small placement (hand/finger)

export const PORTFOLIO: PortfolioPiece[] = [
  {
    id: "demo-traditional-rose",
    title: "Traditional Rose",
    style: "Traditional",
    artist: "isiah-jackson",
    description: "Bold-lined classic American traditional rose with full-color petals and green leaves. A timeless piece that ages beautifully on any placement.",
    placement: "Forearm",
    sizeInches: "5×7",
    imageUrl: "/images/portfolio/isiah/fresh-ink-forearm.jpg",
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
    imageUrl: "/images/portfolio/isiah/skull-flames.jpg",
    svgStyle: "skull",
    accent: "#F5F1E8",
  },
  {
    id: "demo-fineline-mountain",
    title: "Fine-Line Mountains",
    style: "Fine Line",
    artist: "isiah-jackson",
    description: "Single-needle mountain range with delicate linework, fading into atmospheric perspective. Minimalist placement that tells a story.",
    placement: "Inner forearm",
    sizeInches: "3×10",
    imageUrl: "/images/portfolio/isiah/black-grey-chest.jpg",
    svgStyle: "mountain",
    accent: "#8A8A8A",
  },
  {
    id: "demo-neotrad-snake",
    title: "Neo-Traditional Snake",
    style: "Neo-Traditional",
    artist: "isiah-jackson",
    description: "Bold neo-traditional serpent with rich color fills and decorative scrollwork. Heals to a clean, readable piece that holds detail over time.",
    placement: "Thigh",
    sizeInches: "8×14",
    imageUrl: "/images/portfolio/isiah/sleeve-work.jpg",
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
    imageUrl: "/images/portfolio/isiah/sleeve-work.jpg",
    svgStyle: "compass",
    accent: "#C9A84C",
  },
  {
    id: "demo-color-phoenix",
    title: "Color Phoenix",
    style: "Color",
    artist: "isiah-jackson",
    description: "Vibrant phoenix in full color realism — saturated oranges, deep teals, and warm yellows blended across the wing feathers.",
    placement: "Thigh",
    sizeInches: "8×12",
    imageUrl: "/images/portfolio/isiah/hand-piece.jpg",
    svgStyle: "phoenix",
    accent: "#D85A28",
  },
  {
    id: "demo-fineliner-moon",
    title: "Crescent Moon",
    style: "Fine Line",
    artist: "isiah-jackson",
    description: "Minimalist crescent moon with scattered star detail. Single-needle precision for the cleanest possible lines.",
    placement: "Wrist",
    sizeInches: "2×3",
    imageUrl: "/images/portfolio/isiah/shop-isiah.jpg",
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
    imageUrl: "/images/portfolio/isiah/color-religious.jpg",
    svgStyle: "flame",
    accent: "#E25822",
  },
];

export const PORTFOLIO_STYLES = Array.from(
  new Set(PORTFOLIO.map((p) => p.style))
).sort();

export const PORTFOLIO_ARTISTS = Array.from(
  new Set(PORTFOLIO.map((p) => p.artist))
);
