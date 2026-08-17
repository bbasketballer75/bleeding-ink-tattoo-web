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
  artistSlug: string;
  title?: string;
  imageUrl: string;
  width: number;   // intrinsic width for next/image
  height: number;  // intrinsic height for aspect ratio
  altText: string;
  featured?: boolean;
  year?: number;
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