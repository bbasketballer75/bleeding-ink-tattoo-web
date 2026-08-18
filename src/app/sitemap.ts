import type { MetadataRoute } from "next";
import { ARTISTS } from "@/data/artists";

const BASE_URL = "https://bleedinginktattoo.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Top-level static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0, images: [`${BASE_URL}/og-default.svg`] },
    { url: `${BASE_URL}/artists`,  lastModified: now, changeFrequency: "monthly", priority: 0.8, images: [`${BASE_URL}/og/artists.svg`] },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8, images: [`${BASE_URL}/og/services.svg`] },
    { url: `${BASE_URL}/portfolio`,lastModified: now, changeFrequency: "weekly",  priority: 0.9, images: [`${BASE_URL}/og/portfolio.svg`] },
    { url: `${BASE_URL}/faq`,      lastModified: now, changeFrequency: "monthly", priority: 0.6, images: [`${BASE_URL}/og-default.svg`] },
    { url: `${BASE_URL}/book`,     lastModified: now, changeFrequency: "monthly", priority: 0.9, images: [`${BASE_URL}/og/book.svg`] },
    { url: `${BASE_URL}/contact`,  lastModified: now, changeFrequency: "yearly",  priority: 0.5, images: [`${BASE_URL}/og-default.svg`] },
    { url: `${BASE_URL}/aftercare`,lastModified: now, changeFrequency: "monthly", priority: 0.7, images: [`${BASE_URL}/og/aftercare.svg`] },
  ];

  // Artist detail routes (auto-discovered from data)
  const artistRoutes: MetadataRoute.Sitemap = ARTISTS.map((a) => ({
    url: `${BASE_URL}/artists/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
    images: [`${BASE_URL}/og/artists.svg`],
  }));

  return [...staticRoutes, ...artistRoutes];
}