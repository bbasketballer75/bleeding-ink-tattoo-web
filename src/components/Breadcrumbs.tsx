/**
 * Breadcrumbs — server component with BreadcrumbList JSON-LD.
 *
 * Pass an array of {label, href} items; the last is current (no link).
 * Renders semantic <nav aria-label="Breadcrumb"> + structured data.
 */

import Link from "next/link";
import { BLEED_RED, BONE_WHITE, SHOP, SITE_URL } from "@/lib/constants";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        padding: "16px 24px",
        maxWidth: 1280,
        margin: "0 auto",
        fontSize: 13,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          listStyle: "none",
          margin: 0,
          padding: 0,
          color: "rgba(245, 241, 232, 0.6)",
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {!isLast ? (
                <>
                  <Link
                    href={item.href}
                    style={{
                      color: BONE_WHITE,
                      textDecoration: "none",
                      opacity: 0.7,
                    }}
                  >
                    {item.label}
                  </Link>
                  <span aria-hidden style={{ opacity: 0.4 }}>›</span>
                </>
              ) : (
                <span style={{ color: BLEED_RED, fontWeight: 700 }} aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}