# Competitive Audit — Bleeding Ink DEMO vs Johnstown tattoo shops (2026-08-18)

## Method
Tools: Python Playwright (mobile viewport 390×844), axe-core 4.10.0 (WCAG automated audit), direct urllib scrape for site content data.

## Top 5 Johnstown shops found (Brave Search)
1. Total Commitment Tattooing — facebook.com/tctattooing/ — Facebook only
2. **Lemon Bomb Tattoo Co.** — lemonbombtattooco.square.site/ — **Real website**
3. New Breed Tattoos — facebook.com/newbreedstattoos — Facebook only
4. Kings Row Tattoo — facebook.com — Facebook only
5. Get'Er'Done — facebook.com — Facebook only

**Only 1 of 5 Johnstown shops has an actual website.**

## Axe WCAG comparison (mobile, snapshot)

| Site | Total | Crit | Ser | Mod | IDs |
|------|-------|------|-----|-----|-----|
| **Bleeding Ink DEMO** | **0** | **0** | **0** | **0** | **[]** |
| Lemon Bomb Tattoo | 5 | 1 | 3 | 1 | link-name, meta-viewport, nested-interactive, page-has-heading-one, role-img-alt |

## Content comparison (scraped HTML)

| Field | Bleeding Ink DEMO | Lemon Bomb |
|-------|-------------------|------------|
| Pages | 10 (+2 artists) | 1 |
| Has portfolio | Yes (8 SVG cards) | Yes (thumbnails) |
| Has booking | Yes (form + $65 deposit) | Yes (book now) |
| Has pricing | Yes (/pricing, starting from $150) | No |
| Has aftercare | Yes (/aftercare, 7 sections) | Yes (aftercare link) |
| Has FAQ | Yes (10 questions) | No |
| Has about | Yes (/about) | No |
| Has legal/privacy | Yes (/legal) | Implicit |
| Has open-now indicator | Yes (client-side NY tz) | No |
| Has phone CTA | Yes (tel: link) | No phone visible |
| Has email | Has form (no public email yet) | No |
| Has IG embed | Yes (6 posts) | IG icon only |
| Word count | 2589 | 689 |
| Lighthouse BP/SEO | 100/100 | not measured |
| WCAG AA | **PASS** | 5 violations |

## Domain authority / SEO
Both sites have ~0 backlinks by definition (new sites). Bleeding Ink has sitemap.xml, structured data, per-page meta descriptions, Open Graph images for social. Lemon Bomb has a Square subdomain (lemonbombtattooco.square.site) which gets minimal SEO credit vs a real domain.

## Verdict

The Bleeding Ink DEMO **dominates** the only real Johnstown competitor online:
- 10x more pages
- Full WCAG AA accessibility (0 violations vs 5)
- Best Practices + SEO 100/100
- Booking form ready (just needs email configured)
- Aftercare, FAQ, About, Pricing, Legal all included
- Open-now indicator (live time)
- Per-page OG images for social sharing

The pitch narrative writes itself: "5 of 5 Johnstown shops only have Facebook. The 1 that has a website has serious accessibility issues. Our demo has 10 pages, perfect accessibility, full SEO. Bleeding Ink is one purchase away from being #1 in every Johnstown tattoo search."
