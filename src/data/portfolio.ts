/**
 * Portfolio — v1 placeholder.
 *
 * IMPORTANT: All entries below are placeholders. Real portfolio images
 * must come from the shop owner (Isiah) with written permission to use
 * on the website. Until then, we render an "coming soon" state on the
 * /portfolio page rather than fake/stock content.
 *
 * To add real pieces: drop images into public/images/portfolio/{artistSlug}/
 * and append to PORTFOLIO below. Use next/image's intrinsic width/height
 * to avoid layout shift.
 */

import type { PortfolioPiece } from "@/types";

export const PORTFOLIO: PortfolioPiece[] = [
  // Placeholder entries — replaced by real shop work in Phase 4
  // Example shape:
  // {
  //   id: "isiah-001",
  //   artistSlug: "isiah-jackson",
  //   title: "Color sleeve session 1",
  //   imageUrl: "/images/portfolio/isiah-jackson/001.jpg",
  //   width: 1200,
  //   height: 1600,
  //   altText: "Full-color floral sleeve in progress",
  //   featured: true,
  //   year: 2026,
  // },
];

export function getPortfolioByArtist(slug: string): PortfolioPiece[] {
  return PORTFOLIO.filter((p) => p.artistSlug === slug);
}

export function getFeaturedPortfolio(): PortfolioPiece[] {
  return PORTFOLIO.filter((p) => p.featured);
}