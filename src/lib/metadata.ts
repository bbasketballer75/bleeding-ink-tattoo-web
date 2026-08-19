/**
 * Per-page metadata builder — keeps title/description/OG/Twitter consistent
 * across every page while still letting each page customize.
 */

import type { Metadata } from "next";
import { SHOP, SITE_URL, SITE_DESCRIPTION, OG_IMAGE } from "@/lib/constants";
import { pickFeaturedPhoto } from "@/lib/featured-photo";

export interface PageMeta {
  /** Page title — no site name, the layout's title.template appends it. */
  title: string;
  /** Page-specific description; falls back to SITE_DESCRIPTION if omitted. */
  description?: string;
  /** Canonical path (e.g. "/artists"). Default: "/" */
  path?: string;
  /** Optional image override; default OG_IMAGE. */
  image?: string;
  /** Artist slug — picks a real photo of that artist for OG cards. */
  artist?: string;
  /** Style filter — picks a photo of that style for OG cards. */
  style?: string;
  /** Defaults to true. Set false on the /book placeholder so it doesn't rank. */
  indexable?: boolean;
  /** Optional keywords for the meta keywords tag. */
  keywords?: string[];
  /** Optional robots override. */
  robots?: Metadata['robots'];
}

/**
 * Build a Metadata object with full OG + Twitter cards.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  artist,
  style,
  indexable = true,
  keywords,
}: PageMeta): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const desc = description ?? SITE_DESCRIPTION;
  const img = image ?? pickFeaturedPhoto({ artist, style });
  return {
    title,
    description: desc,
    keywords,
    alternates: { canonical: url },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: SHOP.name,
      title,
      description: desc,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [img],
    },
  };
}