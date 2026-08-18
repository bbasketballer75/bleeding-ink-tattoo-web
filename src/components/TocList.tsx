"use client";

/**
 * TOC — client-side hover effects on the table of contents links.
 * Pulled out of /aftercare/page.tsx to keep that page server-rendered.
 */

interface TocLink {
  href: string;
  number: string;
  label: string;
}

export default function TocList({ links }: { links: TocLink[] }) {
  return (
    <ol
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 8,
      }}
    >
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            style={{
              display: "block",
              padding: "8px 12px",
              fontSize: 14,
              color: "var(--color-bone-white)",
              textDecoration: "none",
              borderLeft: "3px solid var(--color-bleed-red)",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(139, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span style={{ opacity: 0.5, marginRight: 8 }}>{link.number}</span>
            {link.label}
          </a>
        </li>
      ))}
    </ol>
  );
}