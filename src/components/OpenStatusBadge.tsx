"use client";

/**
 * OpenStatusBadge — small "Open now · 7:00 PM" or "Closed · opens tomorrow" badge
 * rendered next to the address block on / and the footer.
 *
 * - Computes current Johnstown, PA time (EDT/EST, America/New_York)
 * - Reads SHOP.hours from constants; matches day-of-week + parses the open/close range
 * - Updates every minute so it stays accurate without a server roundtrip
 */

import { useEffect, useState } from "react";
import { SHOP, BONE_WHITE } from "@/lib/constants";

interface ParsedRange {
  open: number; // minutes since midnight
  close: number;
}

function parseRange(range: string | undefined): ParsedRange | null {
  if (!range || range.toLowerCase() === "closed") return null;
  const match = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–\-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  const sh = match[1];
  const sm = match[2];
  const sp = match[3];
  const eh = match[4];
  const em = match[5];
  const ep = match[6];
  if (!sh || !sm || !sp || !eh || !em || !ep) return null;
  const toMin = (h: string, m: string, p: string) => {
    let hh = parseInt(h, 10);
    if (p.toUpperCase() === "PM" && hh !== 12) hh += 12;
    if (p.toUpperCase() === "AM" && hh === 12) hh = 0;
    return hh * 60 + parseInt(m, 10);
  };
  return { open: toMin(sh, sm, sp), close: toMin(eh, em, ep) };
}

function getNowInNY(): { day: number; min: number } {
  const nyStr = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const ny = new Date(nyStr);
  return { day: ny.getDay(), min: ny.getHours() * 60 + ny.getMinutes() };
}

function formatShort(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hh12 = h % 12 === 0 ? 12 : h % 12;
  return `${hh12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function OpenStatusBadge() {
  const [state, setState] = useState<{ open: boolean; text: string }>({
    open: false,
    text: "Loading…",
  });

  useEffect(() => {
    const compute = () => {
      const { day, min } = getNowInNY();
      const today = SHOP.hours[day];
      const todayHours = today ? parseRange(today.hours) : null;

      if (!today || !todayHours) {
        setState({
          open: false,
          text: today ? `Closed · ${today.day}` : "Closed",
        });
        return;
      }

      if (min >= todayHours.open && min < todayHours.close) {
        const closeH = Math.floor(todayHours.close / 60);
        const closeM = todayHours.close % 60;
        const ampm = closeH >= 12 ? "PM" : "AM";
        const hh12 = closeH % 12 === 0 ? 12 : closeH % 12;
        setState({
          open: true,
          text: `Open now · closes ${hh12}:${closeM.toString().padStart(2, "0")} ${ampm}`,
        });
        return;
      }

      // Closed right now. Find next open day.
      for (let i = 1; i <= 7; i++) {
        const nextDay = (day + i) % 7;
        const next = SHOP.hours[nextDay];
        if (!next) continue;
        const nextRange = parseRange(next.hours);
        if (nextRange) {
          const dayLabel = i === 1 ? "tomorrow" : next.day;
          setState({
            open: false,
            text: `Closed · opens ${dayLabel} ${formatShort(nextRange.open)}`,
          });
          return;
        }
      }
      setState({ open: false, text: "Closed" });
    };

    compute();
    const id = window.setInterval(compute, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const bg = state.open ? "#2E7D32" : "#666";
  return (
    <span
      aria-live="polite"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        background: bg,
        color: BONE_WHITE,
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        borderRadius: 2,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 7,
          height: 7,
          background: BONE_WHITE,
          borderRadius: 4,
          display: "inline-block",
        }}
      />
      {state.text}
    </span>
  );
}
