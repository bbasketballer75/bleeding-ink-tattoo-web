/**
 * Artists roster — v1 (confirmed Austin 2026-08-17).
 *
 * Both artists are confirmed via public sources (FB work history for Courtney,
 * Austin-confirmed for shop owner).
 *
 * Future: add more artists by appending to this array. Each artist's
 * /artists/[slug] page is auto-generated from this data.
 */

import type { Artist } from "@/types";

export const ARTISTS: Artist[] = [
  {
    slug: "isiah-jackson",
    name: "Isiah Jackson",
    role: "Owner · Lead Artist",
    instagram: "ibleedink_600",
    yearsTattooing: undefined, // owner to confirm
    specialties: ["Custom", "Coverups", "Color"],
    bio: "Owner and lead artist at Bleeding Ink. Custom pieces, coverups, and color work are the focus. Approach is hands-on with every client — bring your idea, leave with ink you actually want to live with.",
    joinedYear: 2024,
  },
  {
    slug: "courtney-fetzer",
    name: "Courtney Fetzer",
    role: "Artist",
    instagram: undefined, // personal IG not publicly linked to shop
    yearsTattooing: undefined, // apprentice, started June 2026
    specialties: ["Apprentice", "Custom"],
    bio: "Joining the team in June 2026. Working her way through the craft and growing into her style. Single mom, tattooist, makeup fiend — and a pleasure to sit with.",
    joinedYear: 2026,
  },
];

export function getArtist(slug: string): Artist | undefined {
  return ARTISTS.find((a) => a.slug === slug);
}