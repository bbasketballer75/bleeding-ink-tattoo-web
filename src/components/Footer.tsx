/**
 * Footer — site footer with shop info, social links, memorial tagline.
 *
 * Layout: 3 columns on desktop, stacked on mobile.
 * - Left: shop info (address, hours, phone)
 * - Center: social links
 * - Right: quick links
 * Bottom: copyright + LONGLIVEMYBRUDDAS in Permanent Marker
 */

import Link from "next/link";
import { BLEED_RED, BONE_WHITE, INK_BLACK, SHOP } from "@/lib/constants";
import { telLink } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/artists",   label: "Artists" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services",  label: "Services" },
  { href: "/faq",       label: "FAQ" },
  { href: "/contact",   label: "Contact" },
  { href: "/book",      label: "Book a session" },
];

const SOCIAL_LINKS = [
  { href: SHOP.social.instagram, label: "Instagram", short: "IG" },
  { href: SHOP.social.facebook,  label: "Facebook",  short: "FB" },
  { href: SHOP.social.threads,    label: "Threads",   short: "@" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: INK_BLACK,
        color: BONE_WHITE,
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "60px 24px 24px",
        }}
      >
        {/* Top section — 3 columns on desktop, stacked on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 48,
            paddingBottom: 48,
            borderBottom: `1px solid rgba(245, 241, 232, 0.15)`,
          }}
        >
          {/* Shop info */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                textTransform: "uppercase",
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Bleeding <span style={{ color: BLEED_RED }}>Ink</span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>
              <div>{SHOP.address.mall}</div>
              <div>{SHOP.address.street}{SHOP.address.suite ? `, ${SHOP.address.suite}` : ""}</div>
              <div>{SHOP.address.city}, {SHOP.address.state} {SHOP.address.zip}</div>
              <a
                href={telLink()}
                style={{ color: BONE_WHITE, textDecoration: "none", marginTop: 8, fontWeight: 600 }}
              >
                {SHOP.phone.display}
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 16,
                color: BLEED_RED,
              }}
            >
              Hours
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 14, lineHeight: 1.8 }}>
              {SHOP.hours.map((h) => (
                <li key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: 16, opacity: h.hours === "Closed" ? 0.5 : 1 }}>
                  <span>{h.day}</span>
                  <span style={{ fontWeight: h.hours === "Closed" ? 400 : 600 }}>{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 16,
                color: BLEED_RED,
              }}
            >
              Explore
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 14, lineHeight: 2 }}>
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{ color: BONE_WHITE, textDecoration: "none", opacity: 0.85 }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 16,
                color: BLEED_RED,
              }}
            >
              Follow
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 14, lineHeight: 2 }}>
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: BONE_WHITE, textDecoration: "none", opacity: 0.85 }}
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom — copyright + memorial */}
        <div
          style={{
            paddingTop: 24,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          <div>
            © {year} {SHOP.legal}. All rights reserved.
          </div>
          <div
            style={{
              fontFamily: "var(--font-marker)",
              fontSize: 18,
              color: BLEED_RED,
              opacity: 1,
              letterSpacing: "0.02em",
            }}
          >
            {SHOP.memorialTagline}
          </div>
        </div>
      </div>
    </footer>
  );
}