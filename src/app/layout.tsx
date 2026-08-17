/**
 * Root layout — fonts, metadata, JSON-LD schema.
 *
 * T0.4 (fonts) + T0.5 (metadata baseline) landed together since they
 * share the same file.
 */

import type { Metadata, Viewport } from "next";
import { Anton, Inter, Permanent_Marker } from "next/font/google";
import { SHOP, SITE_URL, SITE_DESCRIPTION, OG_IMAGE } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Fonts — Street / Hustle direction
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
});

// SEO baseline — overridden per page via generateMetadata where needed
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SHOP.name} — Custom Tattoos in Johnstown, PA`,
    template: `%s · ${SHOP.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "tattoo shop johnstown pa",
    "custom tattoos johnstown",
    "coverup tattoo johnstown",
    "color tattoo johnstown",
    "walk-in tattoo johnstown",
    "bleeding ink",
    "johnstown galleria tattoo",
    "tattoo artist johnstown",
  ],
  authors: [{ name: SHOP.owner }],
  creator: SHOP.owner,
  publisher: SHOP.legal,
  robots: { index: true, follow: true },

  // OpenGraph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SHOP.name,
    title: `${SHOP.name} — Custom Tattoos in Johnstown, PA`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SHOP.name} — Custom tattoos in Johnstown, PA`,
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: `${SHOP.name} — Custom Tattoos in Johnstown, PA`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },

  // Verification tags (added at Phase 4 after GBP + Bing Webmaster setup)
  // verification: { google: "...", bing: "..." },

  // Icons (placeholder paths — replaced in T3.1)
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },

  // Canonical
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#8B0000",  // bleed red — matches Android address bar
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD LocalBusiness + TattooParlor schema (per `research/04-seo-keywords.md`)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["TattooParlor", "LocalBusiness"],
  "@id": `${SITE_URL}#business`,
  name: SHOP.legal,
  alternateName: SHOP.name,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: SHOP.phone.display,
  // email: SHOP.email.primary,  // empty until owner provides
  image: `${SITE_URL}${OG_IMAGE}`,
  logo: `${SITE_URL}/icons/logo.png`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: SHOP.address.street,
    addressLocality: SHOP.address.city,
    addressRegion: SHOP.address.state,
    postalCode: SHOP.address.zip,
    addressCountry: "US",
  },
  openingHoursSpecification: SHOP.hours
    .filter((h) => h.hours !== "Closed")
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: "11:00",
      closes: "19:00",
    })),
  sameAs: [SHOP.social.facebook, SHOP.social.instagram, SHOP.social.threads],
  founder: {
    "@type": "Person",
    name: SHOP.owner,
  },
  aggregateRating: undefined, // added once reviews come in
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${permanentMarker.variable}`}
    >
      <body className="font-body" style={{ background: "var(--color-ink-black)", color: "var(--color-bone-white)" }}>
        {/* JSON-LD for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar />
        <main id="main" style={{ minHeight: "60vh" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}