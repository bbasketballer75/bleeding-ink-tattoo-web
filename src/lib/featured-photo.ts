/**
 * Featured-photo picker for OG / Twitter cards.
 *
 * Each page picks one real portfolio photo for its social preview
 * (vs. the old single static OG_IMAGE for every page).
 *
 * Selection rules:
 *  - Prefer pieces WITH imageUrl (real photos, not SVG placeholders)
 *  - Prefer pieces that match the page context (artist or style)
 *  - Otherwise fall back to the first Isiah piece (since all real photos are his)
 *  - Final fallback: the static OG_IMAGE constant
 */

import { PORTFOLIO } from "@/data/portfolio";
import { OG_IMAGE } from "@/lib/constants";
import type { PortfolioPiece } from "@/types";


const REAL = PORTFOLIO.filter((p) => Boolean(p.imageUrl));


function urlOf(p: PortfolioPiece): string {
  // imageUrl is already a public path like "/images/portfolio/isiah/fresh-ink-forearm.jpg"
  return p.imageUrl || OG_IMAGE;
}


export function pickFeaturedPhoto(opts: {
  artist?: string;       // artist slug ("isiah-jackson" | "courtney-fetzer")
  style?: string;        // e.g. "Blackwork"
} = {}): string {
  if (REAL.length === 0) return OG_IMAGE;

  // 1. exact artist match
  if (opts.artist) {
    const m = REAL.find((p) => p.artist === opts.artist);
    if (m) return urlOf(m!);
  }

  // 2. exact style match
  if (opts.style) {
    const m = REAL.find((p) => p.style.toLowerCase() === opts.style!.toLowerCase());
    if (m) return urlOf(m!);
  }

  // 3. fall back to first real photo (Isiah's, by definition)
  return urlOf(REAL[0]!);
}


export function pickArtistPhotos(artist: string, max: number = 4): PortfolioPiece[] {
  return PORTFOLIO.filter((p) => p.artist === artist && p.imageUrl).slice(0, max);
}


export function pickFeaturedPhotos(max: number = 4): PortfolioPiece[] {
  return REAL.slice(0, max);
}
