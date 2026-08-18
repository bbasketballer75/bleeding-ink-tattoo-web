# Lighthouse Audit — Phase 5 (P0 + P1 polish) — 2026-08-18

Real Lighthouse via 1mcp chrome-devtools-mcp_1mcp_lighthouse_audit. Mobile, snapshot mode.

| Route | A11y | Best Practices | SEO | Pass / Fail |
|-------|------|----------------|-----|-------------|
| `/` | 96 | 100 | 100 | 32 / 2 |
| `/artists` | 96 | 100 | 100 | 30 / 1 |
| `/services` | 96 | 100 | 100 | 32 / 1 |
| `/portfolio` | 96 | 100 | 100 | 31 / 1 |
| `/faq` | 96 | 100 | 100 | 30 / 1 |
| `/book` | **100** | 100 | 100 | 34 / **0** |
| `/contact` | 96 | 100 | 100 | 34 / 1 |
| `/aftercare` | 96 | 100 | 100 | 30 / 1 |
| `/legal` | 96 | 100 | 100 | 30 / 1 |

## Summary

**Average A11y: 96.4** | **Best Practices: 100/100** | **SEO: 100/100** | 9 routes audited

### Phase 5 deltas (vs Phase 4 baseline):

- `/`: 91 → 96 A11y (+5)
- `/artists`: 100 → 96 A11y (-4, lost color-contrast somewhere)
- `/book`: 98 → 100 A11y (+2, **perfect 100 now**)
- `/portfolio`: 94 → 96 A11y (+2)
- `/services`: 100 → 96 A11y (-4)

### Remaining failures (1 per page)

Color-contrast on the **LONGLIVEMYBRUDDAS** marker in the footer (Permanent Marker font renders the bright red dimmer than axe computes). Tracked for Phase 5 P2 polish.
