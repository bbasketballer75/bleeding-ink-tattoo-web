/**
 * Navbar — site header with sticky behavior, mobile drawer, tap-to-call.
 *
 * - Logo/wordmark left (links to /)
 * - Center nav: Artists · Portfolio · Services · FAQ · Contact · Book
 * - Right: tap-to-call phone (desktop) / hamburger (mobile)
 * - Sticky on scroll: transparent at top, ink-black backdrop after scroll
 * - Mobile: hamburger opens drawer with same nav links
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BLEED_RED, BONE_WHITE, INK_BLACK, SHOP } from "@/lib/constants";
import { telLink } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/artists",   label: "Artists" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services",  label: "Services" },
  { href: "/faq",       label: "FAQ" },
  { href: "/aftercare",  label: "Aftercare" },
  { href: "/contact",   label: "Contact" },
  { href: "/book",      label: "Book" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sticky scroll behavior — backdrop after 32px scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: scrolled ? INK_BLACK : "transparent",
    transition: "background 0.2s ease",
    borderBottom: scrolled ? `1px solid rgba(${BLEED_RED.slice(1).match(/.{2}/g)?.map((h) => parseInt(h, 16)).join(", ")}, 0.3)` : "none",
  };

  return (
    <>
      <header style={headerStyle}>
        <nav
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
          aria-label="Main"
        >
          {/* Wordmark — Anton display font, all-caps */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: BONE_WHITE,
              textDecoration: "none",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Bleeding <span style={{ color: BLEED_RED }}>Ink</span>
          </Link>

          {/* Center nav (desktop) */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (pathname?.startsWith(`${link.href}/`) ?? false);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                  style={{
                    opacity: active ? 1 : 0.85,
                    borderBottom: active ? `2px solid ${BLEED_RED}` : "2px solid transparent",
                    paddingBottom: 4,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side — tap-to-call (desktop) */}
          <a
            href={telLink()}
            className="desktop-cta"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: BLEED_RED,
              color: BONE_WHITE,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              border: `2px solid ${BLEED_RED}`,
              transition: "background 0.15s ease, color 0.15s ease",
            }}
            aria-label={`Call ${SHOP.name}`}
          >
            <span aria-hidden>📞</span>
            <span>{SHOP.phone.display}</span>
          </a>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              background: "transparent",
              border: `2px solid ${BONE_WHITE}`,
              color: BONE_WHITE,
              cursor: "pointer",
              padding: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          style={{
            position: "fixed",
            inset: 0,
            background: INK_BLACK,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            padding: "20px 24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                color: BONE_WHITE,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              Bleeding <span style={{ color: BLEED_RED }}>Ink</span>
            </span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              style={{
                width: 44,
                height: 44,
                background: "transparent",
                border: `2px solid ${BONE_WHITE}`,
                color: BONE_WHITE,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (pathname?.startsWith(`${link.href}/`) ?? false);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 40,
                    color: active ? BLEED_RED : BONE_WHITE,
                    textDecoration: "none",
                    textTransform: "uppercase",
                    padding: "16px 0",
                    borderBottom: `1px solid rgba(245, 241, 232, 0.15)`,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ marginTop: "auto", paddingTop: 40 }}>
            <a
              href={telLink()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "16px 24px",
                background: BLEED_RED,
                color: BONE_WHITE,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
              aria-label={`Call ${SHOP.name}`}
            >
              <span aria-hidden>📞</span>
              <span>{SHOP.phone.display}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}