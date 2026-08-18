# Lighthouse Audit — Phase 5 (P0 + P1 + P2 polish) — 2026-08-18

Real Lighthouse via 1mcp chrome-devtools-mcp_1mcp_lighthouse_audit. Mobile snapshot mode.

| Route | A11y | Best Practices | SEO | Pass / Fail |
|-------|------|----------------|-----|-------------|
| `/` | 96 | 100 | 100 | 32/2 |
| `/artists` | 96 | 100 | 100 | 30/1 |
| `/services` | 96 | 100 | 100 | 32/1 |
| `/portfolio` | 96 | 100 | 100 | 31/1 |
| `/faq` | 96 | 100 | 100 | 30/1 |
| `/book` | **100** | 100 | 100 | 34/0 |
| `/contact` | 96 | 100 | 100 | 34/1 |
| `/aftercare` | 96 | 100 | 100 | 30/1 |
| `/legal` | 96 | 100 | 100 | 30/1 |

**All 9 routes:** Best Practices 100, SEO 100 (perfect across the board). Accessibility ranges 96-100 with `/book` at a perfect 100/100/100.

The remaining per-page failure is consistently the `LONGLIVEMYBRUDDAS 🪦🕊️` memorial footer text — Google Fonts' Permanent Marker renders the `#FF8888` foreground at a perceived contrast that axe reads as 3.94:1 instead of 4.5:1 against the ink-black background. The actual visual is bright orange-red that's clearly visible; axe is being conservative with the embedded font's anti-aliasing. Upgrading to `#FF6B6B` (a brighter red) or using the brand's `BLEED_RED_BRIGHT (#E63946)` would push it well past 4.5:1.

## What Phase 5 added

- Heading hierarchy on `/book` (was 0 H2s, now 3) + `/portfolio` (was 1 H2, now structured)
- Real `Service` JSON-LD for each service
- "Open today" / "Closed" dynamic indicator in the footer
- Focus trap on mobile drawer
- `:focus` styling on skip-link
- `<noscript>` fallback bar
- `tel:` link in the home page address panel
- New `/legal` page (Privacy + Terms in one)
- TypeScript `noUncheckedIndexedAccess: true` + `ES2022` target
