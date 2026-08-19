/**
 * Artists index — /artists.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import ArtistCard from "@/components/ArtistCard";
import { ARTISTS } from "@/data/artists";

export const metadata = buildMetadata({
  title: "Our Artists",
  description: "Meet the artists at Bleeding Ink Tattooing in Johnstown, PA. Custom tattoos, coverups, color work, apprentices.",
  artist: "isiah-jackson",
  path: "/artists",
    image: "/og/artists.svg",});

export default function ArtistsPage() {
  return (
    <>
      <Hero
        variant="compact"
        headline="Artists"
        tagline="Custom work, coverups, color. Each artist brings their own style — pick the one who fits your idea."
      />
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Artists", href: "/artists" }
      ]} />

      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeading
            eyebrow="The Team"
            heading={`${ARTISTS.length} artists, working out of the Johnstown Galleria`}
            body="Tap a card to see each artist's full profile, specialties, and Instagram."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 32,
            }}
          >
            {ARTISTS.map((artist) => (
              <ArtistCard key={artist.slug} artist={artist} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}