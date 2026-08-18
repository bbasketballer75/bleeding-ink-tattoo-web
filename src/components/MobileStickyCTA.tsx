"use client";

/**
 * MobileStickyCTA — fixed bottom bar visible only on mobile.
 *
 * Hidden on desktop (>= 769px). Shows call + book buttons.
 * Auto-hides when scrolling up so it doesn't get in the way.
 * The <nav> element satisfies the WCAG landmark requirement.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { telLink } from "@/lib/utils";
import { SHOP, BLEED_RED, BONE_WHITE } from "@/lib/constants";

export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current < 64) {
        setVisible(true);
      } else if (current > lastScrollY + 8) {
        setVisible(false);
      } else if (current < lastScrollY - 8) {
        setVisible(true);
      }
      setLastScrollY(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav aria-label="Mobile quick actions" className="mobile-sticky-cta" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10, 10, 10, 0.96)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderTop: `2px solid ${BLEED_RED}`, padding: "12px 16px", paddingBottom: "max(12px, env(safe-area-inset-bottom))", display: "flex", gap: 10, transform: visible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.25s ease", boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.4)" }}>
        <a href={telLink()} style={{ flex: "0 0 auto", padding: "12px 16px", background: "transparent", border: `2px solid ${BONE_WHITE}`, color: BONE_WHITE, textDecoration: "none", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }} aria-label={`Call ${SHOP.phone.display}`}>
          <span aria-hidden="true">📞</span> Call
        </a>
        <Link href="/book" style={{ flex: 1, padding: "12px 16px", background: BLEED_RED, color: BONE_WHITE, textDecoration: "none", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
          Book Free Consultation
        </Link>
      </nav>
      <style>{`
        @media (max-width: 768px) {
          main { padding-bottom: 80px !important; }
        }
        @media (min-width: 769px) {
          .mobile-sticky-cta { display: none !important; }
        }
      `}</style>
    </>
  );
}
