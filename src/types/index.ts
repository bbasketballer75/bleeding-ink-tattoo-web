/**
 * Type definitions for artists, portfolio pieces, services, FAQ entries.
 */

export interface Artist {
  slug: string;
  name: string;
  role: string;
  instagram?: string;
  yearsTattooing?: number;
  specialties: string[];
  bio: string;
  joinedYear: number;
}

export interface PortfolioPiece {
  id: string;
  title: string;
  style: string;       // traditional | fine-line | realism | blackwork | coverup | color | neo-traditional | Japanese
  artist: "isiah-jackson" | "courtney-fetzer";
  description: string;
  placement: string;    // forearm, back, ribs, calf, etc.
  sizeInches: string;   // 4x6, 6x8, full sleeve, etc.
  imageUrl?: string;    // /public/images/portfolio/<artist>/<file>.jpg (preferred over svgStyle)
  svgStyle: "rose" | "skull" | "mountain" | "snake" | "compass" | "phoenix" | "moon" | "flame";
  accent: string;       // hex color for SVG fallback
}

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  startingPrice?: string;
  duration?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}