/**
 * Services offered at Bleeding Ink.
 *
 * Pricing follows the "DM for quote" posture confirmed Austin 2026-08-17:
 * no hourly rates published on the site; visitor must contact for estimate.
 * $65 non-refundable deposit is the only price shown publicly.
 */

import type { Service } from "@/types";
import { DEPOSIT_MIN } from "@/lib/constants";

export const SERVICES: Service[] = [
  {
    slug: "custom-tattoos",
    name: "Custom Tattoos",
    shortDescription: "Original designs built around your idea. Bring reference photos, a description, or a vague feeling — we'll work it out together in the consultation.",
    longDescription:
      "Every custom tattoo starts with a free consultation. We'll talk through placement, size, style, and budget, then sketch and refine before any ink goes down. Most custom work needs 2-4 hours per session.",
  },
  {
    slug: "coverups",
    name: "Coverups",
    shortDescription: "Specialty of the shop. If you've got an old tattoo you're done with, we'll work with you to design something that covers it without losing the style you actually want.",
    longDescription:
      "Coverups require a careful eye — color, density, and placement all matter. Some coverups can be done in one session; others need a laser pre-treatment to lighten the old ink first. Consultation is free; we'll tell you upfront what's realistic.",
  },
  {
    slug: "color-work",
    name: "Color Work",
    shortDescription: "Saturated, long-lasting color. We work in a range of palettes — saturated full-color pieces, soft pastels, traditional Americana — whatever fits the design.",
    duration: "varies",
  },
  {
    slug: "consultations",
    name: "Free Consultations",
    shortDescription: "Every custom piece starts with a conversation. Bring your idea, we'll bring the questions.",
    longDescription: `Walk-ins welcome for consultations. No appointment needed. We'll look at placement, size, style, and budget, and give you a realistic timeline and quote. Deposits are $${DEPOSIT_MIN} (non-refundable) when you're ready to book a session.`,
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}