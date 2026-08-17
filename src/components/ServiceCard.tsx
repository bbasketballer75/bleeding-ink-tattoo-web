/**
 * ServiceCard — service tile for /services.
 */

import Link from "next/link";
import { BLEED_RED } from "@/lib/constants";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div
      style={{
        background: "var(--color-bone-white)",
        color: "var(--color-ink-black)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        border: "1px solid rgba(10, 10, 10, 0.08)",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          margin: 0,
          lineHeight: 1,
        }}
      >
        {service.name}
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
        {service.longDescription ?? service.shortDescription}
      </p>
      <div style={{ marginTop: "auto" }}>
        <Link
          href="/contact"
          style={{
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: BLEED_RED,
            textDecoration: "none",
          }}
        >
          Get a quote →
        </Link>
      </div>
    </div>
  );
}