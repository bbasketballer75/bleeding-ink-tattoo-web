/**
 * Utility helpers. Keep small — bigger utilities go in their own file.
 */
import { SHOP } from "./constants";

/** Build a tel: link for the shop phone */
export function telLink(): string {
  return `tel:${SHOP.phone.tel}`;
}

/** Build a Google Maps embed URL for the shop address */
export function mapsEmbedUrl(): string {
  const addr = `${SHOP.address.street}, ${SHOP.address.city}, ${SHOP.address.state} ${SHOP.address.zip}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(addr)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/** Build a Google Maps link (opens in new tab) for the shop address */
export function mapsLink(): string {
  const addr = `${SHOP.address.street}, ${SHOP.address.city}, ${SHOP.address.state} ${SHOP.address.zip}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
}

/** Slugify a name (for artist detail pages) */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format a deposit amount as USD */
export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

/** Get current shop status: open/closed/closing-soon (returns null if not implementable) */
export function shopStatus(now: Date = new Date()): { open: boolean; label: string } | null {
  const dayIndex = now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + minute / 60;

  // Sun(0), Mon(1): closed
  if (dayIndex === 0 || dayIndex === 1) {
    return { open: false, label: "Closed today" };
  }

  // Tue(2)-Sat(6): 11am - 7pm
  if (time >= 11 && time < 19) {
    const closingIn = 19 - time;
    if (closingIn <= 1) return { open: true, label: `Closing soon (${Math.round(closingIn * 60)} min)` };
    return { open: true, label: "Open now" };
  }
  if (time < 11) return { open: false, label: "Opens at 11 AM" };
  return { open: false, label: "Closed" };
}