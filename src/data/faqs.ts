/**
 * FAQ entries — shop policies, walk-ins, deposits, ages, aftercare basics.
 *
 * Sourced from research/01-competitor-sites.md (FB page description) and
 * common tattoo-shop policies from Qrolic + Seahawk research.
 */

import type { FAQ } from "@/types";
import { DEPOSIT_MIN } from "@/lib/constants";

export const FAQS: FAQ[] = [
  {
    question: "Do you take walk-ins?",
    answer:
      "Yes! Walk-ins are always welcome. That said, appointments are preferred — booking ahead guarantees you a slot and lets your artist prepare the stencil. For larger custom work, we strongly recommend an appointment.",
  },
  {
    question: "How much is a tattoo?",
    answer:
      "It depends on size, detail, placement, and style. We don't publish hourly rates — every piece is different. Send us a message with your idea and we'll give you a realistic quote. Consultations are always free.",
  },
  {
    question: "What's the deposit?",
    answer: `The deposit is $${DEPOSIT_MIN}, non-refundable. It comes off the price of your final tattoo. Deposits secure your appointment slot and cover the artist's time for designing and preparing your stencil.`,
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "Deposits are non-refundable. If you need to reschedule, please give us at least 48 hours notice and we'll move your deposit to a new appointment date — one time only. Late cancellations or no-shows forfeit the deposit.",
  },
  {
    question: "How old do you have to be?",
    answer:
      "18+ for any tattoo, no exceptions. Pennsylvania state law requires parental consent for minors, but our shop policy is 18+ across the board. Bring valid photo ID.",
  },
  {
    question: "Do you do coverups?",
    answer:
      "Coverups are a specialty. Bring a photo of your existing tattoo (well-lit, in focus) and we'll tell you at the consultation what's realistic. Some coverups can be done in one session; others need laser lightening first.",
  },
  {
    question: "Where are you located?",
    answer:
      "We're inside the Johnstown Galleria, 500 Galleria Dr, Johnstown PA 15904. Walk-ins are welcome — just look for our sign inside the mall.",
  },
  {
    question: "What are your hours?",
    answer: "Closed Sunday and Monday. Tuesday through Saturday, 11 AM to 7 PM. We sometimes close for private events — check our Facebook page for last-minute schedule changes.",
  },
  {
    question: "How do I book?",
    answer: "Use the Book page for a consultation or session appointment. Or just call us at (215) 980-1386 during shop hours. We respond to all inquiries within 2 business days.",
  },
  {
    question: "Do you do piercings?",
    answer: "Currently we're focused on tattoo work — no piercings at the moment. Check back later.",
  },
];

export function getFAQsByCategory(): { category: string; faqs: FAQ[] }[] {
  // Could split into categories later; for now single "General" section
  return [{ category: "General", faqs: FAQS }];
}