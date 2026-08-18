/**
 * Artist detail page — /artists/[slug].
 *
 * Auto-generates one page per entry in src/data/artists.ts.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ARTISTS, getArtist } from "@/data/artists";
import { SHOP, BLEED_RED, SITE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTISTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return { title: "Artist not found" };
  return buildMetadata({
    title: `${artist.name} — ${artist.role}`,
    description: artist.bio,
    path: `/artists/${artist.slug}`,
  });
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const artist = getArtist(slug);

  if (!artist) {
    notFound();
  }

  const instagramUrl = artist.instagram
    ? `https://www.instagram.com/${artist.instagram}/`
    : null;

  return (
    <>
      <Hero
        variant="compact"
        headline={artist.name}
        tagline={`${artist.role} · ${artist.joinedYear > 2024 ? `Joined ${artist.joinedYear}` : "Owner"}`}
      />

      
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Artists", href: "/artists" },
          { label: artist.name, href: `/artists/${artist.slug}` },
        ]} />

        <section style={{ padding: "60px 24px 80px" }}>
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 48,
          }}
        >
          {/* Bio */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                textTransform: "uppercase",
                margin: 0,
                marginBottom: 16,
                letterSpacing: "-0.01em",
              }}
            >
              About
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.85, margin: 0, marginBottom: 32 }}>
              {artist.bio}
            </p>
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: 14 }}
              >
                Instagram ↗
              </a>
            )}
          </div>

          {/* Specialties + booking CTA */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                textTransform: "uppercase",
                margin: 0,
                marginBottom: 16,
                letterSpacing: "-0.01em",
              }}
            >
              Specialties
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
              {artist.specialties.map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "8px 14px",
                    border: `2px solid ${BLEED_RED}`,
                    color: BLEED_RED,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                textTransform: "uppercase",
                margin: 0,
                marginBottom: 16,
                letterSpacing: "-0.01em",
              }}
            >
              Book with {artist.name.split(" ")[0]}
            </h2>
            <p style={{ fontSize: 15, opacity: 0.85, margin: 0, marginBottom: 24 }}>
              Free consultation first. {artist.name.split(" ")[0]} will work with you on placement, size, and design before any ink goes down.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link href="/book" className="btn-primary" style={{ fontSize: 14 }}>
                Book a Session
              </Link>
              <a
                href={`tel:${SHOP.phone.tel}`}
                className="btn-secondary"
                style={{ fontSize: 14 }}
              >
                Call {SHOP.phone.display}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD: Person schema for this artist */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${SITE_URL}/artists/${artist.slug}#person`,
            name: artist.name,
            jobTitle: artist.role,
            worksFor: { "@id": `${SITE_URL}#business` },
            url: `${SITE_URL}/artists/${artist.slug}`,
            sameAs: artist.instagram ? [artist.instagram] : undefined,
            knowsAbout: artist.specialties,
            description: artist.bio,
          }),
        }}
      />
    </>
  );
}