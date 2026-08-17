/**
 * Single source of truth for all brand tokens.
 *
 * NEVER hardcode these values in JSX. Import from this file.
 * Mirrors to globals.css @theme block — keep them in sync.
 */

// Brand colors (Street / Hustle direction — confirmed Austin 2026-08-17)
export const BLEED_RED  = "#8B0000";  // primary CTAs, accents, blood
export const INK_BLACK  = "#0A0A0A";  // text, dark sections
export const BONE_WHITE = "#F5F1E8";  // page background
export const ASH_GRAY   = "#8A8A8A";  // secondary text
export const GOLD       = "#C9A84C";  // optional CTA pop, prices

// Business tokens (single source of truth — change here, propagates everywhere)
export const DEPOSIT_MIN = 65;              // USD, non-refundable, confirmed 2026-08-17
export const DEPOSIT_POLICY = "non-refundable";

// Shop identity (confirmed 2026-08-17)
export const SHOP = {
  name: "Bleeding Ink",
  legal: "Bleeding Ink Tattooing",
  owner: "Isiah Jackson",
  tagline: "Appointments preferred, walk-ins always welcome.",
  taglineExtended: "Free consultation. Coverups our specialty. Color work our craft.",
  memorialTagline: "LONGLIVEMYBRUDDAS 🪦🕊️",
  address: {
    street: "500 Galleria Dr",
    suite: "",  // owner to fill in
    city: "Johnstown",
    state: "PA",
    zip: "15904",
    mall: "Johnstown Galleria",
  },
  phone: {
    display: "(215) 980-1386",
    tel: "+12159801386",
  },
  email: {
    // No public email yet. Contact form routes to RESEND_TO_EMAIL env var.
    primary: "",  // owner to fill in
  },
  hours: [
    { day: "Sunday",    hours: "Closed" },
    { day: "Monday",    hours: "Closed" },
    { day: "Tuesday",   hours: "11:00 AM – 7:00 PM" },
    { day: "Wednesday", hours: "11:00 AM – 7:00 PM" },
    { day: "Thursday",  hours: "11:00 AM – 7:00 PM" },
    { day: "Friday",    hours: "11:00 AM – 7:00 PM" },
    { day: "Saturday",  hours: "11:00 AM – 7:00 PM" },
  ],
  social: {
    facebook: "https://www.facebook.com/BleedingInkTattooing/",
    instagram: "https://www.instagram.com/ibleedink_600/",
    threads: "https://www.threads.net/@ibleedink_600",
    // Yelp / Google Business Profile / others will be added at Phase 4 launch
  },
} as const;

// SEO defaults
export const SITE_URL = "https://bleedinginktattoo.com";  // confirmed Austin 2026-08-17
export const SITE_DESCRIPTION = "Custom tattoo studio in Johnstown, PA. Coverups, color work, walk-ins welcome. Located in the Johnstown Galleria. Free consultation, $65 deposit.";
export const OG_IMAGE = "/og-default.png";  // generated in T3.1