# Bleeding Ink Tattoo — Agent Guide

Marketing + booking website for Bleeding Ink tattoo shop at Johnstown Galleria, 500 Galleria Dr, Johnstown PA 15904. Built with Next.js 16 + React 19 + TypeScript + Tailwind CSS v4. Deployed to `bleedinginktattoo.com`.

## Technology Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.2.6 (App Router) |
| UI Library | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + inline styles |
| Fonts | `next/font/google` — **Anton** (display) + **Inter** (body) + **Permanent Marker** (accents) |
| Linting | ESLint 9 + `eslint-config-next` (core-web-vitals + typescript) |
| Build | Next.js with Turbopack (`TURBOPACK=` explicitly unset in build script) |

## Project Structure

```
src/
├── app/                # Pages and layouts
│   ├── layout.tsx      # Root layout — fonts, metadata, JSON-LD schema
│   ├── page.tsx        # Home page
│   ├── artists/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── portfolio/
│   ├── services/
│   ├── contact/
│   ├── faq/
│   ├── book/           # GlossGenius booking embed
│   ├── globals.css     # Tailwind theme + custom CSS animations & utilities
│   └── not-found.tsx   # 404 page
├── components/         # Shared React components
├── data/               # Artists, portfolio, services, FAQ, business info
├── lib/                # Utilities, server actions
│   ├── constants.ts    # Brand color tokens + strings (single source of truth)
│   └── utils.ts
└── types/              # TypeScript types
public/
├── images/             # Portfolio + studio photos (uploaded post-launch)
└── icons/              # Favicon + app icons
```

Multi-page Next.js app with one server action for the contact form. Static pages are prerendered; interactive bits use client `*Content.tsx` components when needed.

## Build and Development Commands

```bash
npm run dev     # Dev server on localhost:3009
npm run build   # Production build
npm run start   # Serve production build
npm run lint    # ESLint check
```

There are **no tests** in this project. No test runner is installed.

## Known Pitfalls (carry over from jadas-jazz-cafe-web + new discoveries)

- **Tailwind v4 + lightningcss + Windows**: First `next dev` against a fresh project may fail every request with `node process exited with exit code: 0xc0000142` (Turbopack lightningcss worker DLL init failure). Workaround: use `npx next build && npx next start` for local verification instead of `next dev`. Build, deploy, and Vercel all unaffected. (Confirmed 2026-08-17 against this project; jadas-jazz-cafe-web works in dev because the worker was already spawned by a previous session.)

1. **`jsx: "preserve"` is NOT needed** — we use default `"react-jsx"`. Don't change to `"preserve"`.
2. **No `global-error.tsx`** — Next 16 App Router is incompatible.
3. **No `<html>` wrappers in `not-found.tsx`** — only `<div>` content.
4. **`next.config.ts` uses `experimental.turbo`** — keep as is from the copy.
5. **WSL2 SIGBUS** — not relevant, this is Windows native.
6. **Next lint quirks** — `next lint` removed in Next 16, use plain `eslint` (already configured).

## Code Style Guidelines

### Styling Pattern (Critical)

Styles are applied primarily via **inline `style={{}}` objects**, NOT Tailwind utility classes. Tailwind is used only for:
- Global utilities: `scroll-smooth`, `antialiased`, `min-h-full`
- Font family classes: `font-display`, `font-body`, `font-marker`
- Component classes defined in `globals.css`: `btn-primary`, `btn-secondary`, `nav-link`, `drip-divider`, `hero-overlay`

**Do not refactor inline styles to Tailwind utility classes.** Match jadas-jazz-cafe-web pattern.

### Brand Color Constants (single source of truth in `src/lib/constants.ts`)

```ts
export const BLEED_RED  = "#8B0000";  // primary CTAs, accents, blood references
export const INK_BLACK  = "#0A0A0A";  // text, dark sections (nav, footer, hero text)
export const BONE_WHITE = "#F5F1E8";  // page background, light text on dark
export const ASH_GRAY   = "#8A8A8A";  // secondary text, muted accents
export const GOLD       = "#C9A84C";  // optional CTA pop, prices, hover
```

These same colors are registered in `globals.css` under `@theme` as Tailwind v4 CSS variables, but the **source of truth for JS usage** is the constants file. **Deposit amount of $65** also lives here as `DEPOSIT_MIN`.

### Typography

- `font-display` → **Anton** (condensed sans) — hero headlines, section titles, big statements
- `font-body` → **Inter** (sans-serif) — body text, labels, prices, navigation
- `font-marker` → **Permanent Marker** (handwritten) — taglines, memorial footer, accents

All three are loaded in `layout.tsx` via `next/font/google` and exposed as CSS variables.

### Component Organization

Shared components live in `src/components/`. Page-specific interactive content lives in `src/app/<page>/*Content.tsx` client components, while `page.tsx` files remain server components that export metadata.

Components to build (in order):
- `Navbar`, `Footer`, `Button`, `Hero`
- `SectionHeader`, `PageWrapper`
- `FormInput`, `FormTextarea`, `ContactForm` (client)
- `ArtistCard`, `PortfolioGrid` (client, filterable)
- `FAQAccordion` (client)
- `MapEmbed` (server, Google Maps iframe)

### Responsive Design

Responsive overrides handled in inline `<style>{`...`}</style>` blocks at the bottom of `page.tsx` files. Breakpoint: `768px`. Mobile-first throughout — Instagram bio link is the primary traffic source.

## Pages

| Page | Route | Key Content |
|------|-------|-------------|
| Home | `/` | Hero, featured work, artist callouts, coverup specialty, final CTA |
| Artists | `/artists` | Grid of all artists |
| Artist detail | `/artists/[slug]` | Hero photo, bio, specialties, IG grid, "Book" CTA |
| Portfolio | `/portfolio` | Style-filtered grid with lightbox |
| Services | `/services` | What we do, deposit ($65), walk-ins, age policy, aftercare |
| Contact | `/contact` | Address, hours, phone, map embed, contact form |
| FAQ | `/faq` | Accordion with permalinks for shareability |
| Book | `/book` | GlossGenius embed for booking + deposits |

Each page has a server `page.tsx` exporting metadata and a client `*Content.tsx` when interactivity is required.

## Content Data

All editable content lives in `src/data/`:
- `business.ts` — name, phone, address, hours, email, socials, URLs
- `artists.ts` — array of artist objects (slug, name, bio, specialties, IG, photo)
- `portfolio.ts` — array of portfolio items (placeholder until Isiah uploads)
- `services.ts` — services offered, deposit, walk-ins policy
- `faq.ts` — array of {question, answer} pairs

**Business info (confirmed 2026-08-17):**
- Name: Bleeding Ink Tattooing
- Owner: Isiah Jackson
- Address: 500 Galleria Dr, Johnstown PA 15904 (in Johnstown Galleria)
- Phone: (215) 980-1386
- Hours: Closed Sun & Mon · Tue–Sat 11:00 AM – 7:00 PM
- Deposit: $65 minimum, non-refundable
- IG: https://www.instagram.com/ibleedink_600/
- FB: https://www.facebook.com/BleedingInkTattooing/
- Email: none yet (contact form route TBD)

**Artist roster v1:**
- Isiah Jackson (owner, head artist) — bio TBD
- Courtney Fetzer (apprentice, started Jun 19 2026) — bio TBD

## Metadata & SEO

`layout.tsx` contains comprehensive metadata:
- OpenGraph + Twitter card tags
- JSON-LD `LocalBusiness` + `TattooParlor` schema (Schema.org)
- Robots directives (`index: true, follow: true`)
- Canonical base URL: `https://bleedinginktattoo.com`

Each page exports its own metadata via `generateMetadata()` or static `metadata` export.

## Deployment

- **Target**: Next.js full-stack app (server actions enabled for contact form)
- **Platform**: Vercel (free tier, instant deploys)
- **Environment variables** required for form submissions (see `.env.example`)
- **Backend**: Resend email API for contact form

## Environment Variables

Copy `.env.example` to `.env.local` and fill in. See file for details.

For production, verify `bleedinginktattoo.com` in Resend and update `RESEND_FROM_EMAIL` to a branded address like `Bleeding Ink <hello@bleedinginktattoo.com>`.

## Security Considerations

- No auth, sessions, cookies, or sensitive data handling
- Form submissions use server actions; Resend API key never reaches the client
- External links use `target="_blank"` with `rel="noopener noreferrer"`
- Google Maps embed uses standard `referrerPolicy="no-referrer-when-downgrade"`
- Keep dependencies up to date (`next`, `react`, `react-dom`, `resend`)

## Important Conventions for Agents

1. **Preserve the inline-style pattern.** Do not migrate styles to Tailwind utilities.
2. **Keep business data in `src/data/`.** When updating prices, hours, or info, update both data files and any hardcoded values in JSX.
3. **Update metadata** in page files and `layout.tsx` when business info changes.
4. **Test on mobile** after any layout changes — IG traffic is mobile-first.
5. **Single source of truth**: deposit amount ($65) lives ONLY in `src/lib/constants.ts` as `DEPOSIT_MIN`. Never hardcode.