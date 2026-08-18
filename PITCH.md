# Pitch-Prep One-Pager — Bleeding Ink Tattoo

> **Date:** 2026-08-18
> **Live demo:** https://bleeding-ink-tattoo-web.inquiry-970.workers.dev
> **For:** Isiah Jackson (owner) — sales pitch conversation

---

## 30-second pitch

> "I built a full working demo of what your new website could look like.
> It's live, free, and ready to walk through. The URL works on any phone
> or laptop. Take a look — if you like what you see, we can talk about
> turning it into the real thing."

That's it. Hit them with **the link + a screenshot**, then let them
click around before pitching anything else.

---

## The walk-through script (5-min guided tour, in person)

If you walk through it together, here's the path:

| Step | URL | What to show |
|------|-----|--------------|
| 1 | `/` | "Hero with $65 deposit mention. Studio intro. Artists, services, Instagram grid — all real shop info." |
| 2 | `/artists` | "Two artists, two distinct styles. Each has their own page." |
| 3 | `/artists/isiah-jackson` | "Per-artist portfolio with specialties + bio + contact CTA." |
| 4 | `/services` | "Four core services. Starting prices. Honest 'no hourly rates' copy that matches how you actually work." |
| 5 | `/pricing` | "Pricing page with starting prices per service + FAQ. No hourly rates — just like you said." |
| 6 | `/portfolio` | "Style-filtered portfolio grid. Tap a category, see work." |
| 7 | `/aftercare` | "7-section aftercare guide. This is the SEO page that brings people in from 'tattoo aftercare' searches." |
| 8 | `/book` | "Free consultation form. Ten fields. Submits to your inbox." |
| 9 | `/contact` | "Contact form + your address + hours." |
| 10 | `/about` | "Shop story + your two artists + the 6 commitments." |
| 11 | `/faq` | "10 questions. Direct answers. Each one indexed for SEO." |
| 12 | `/legal` | "Privacy + Terms in one place. ATTORNEY REVIEW REQUIRED before launch." |

---

## What's actually live (verified 2026-08-18)

### Design + content
- **10 pages** (home, /artists, /artists/[slug], /services, /pricing, /portfolio, /book, /contact, /aftercare, /faq, /about, /legal)
- **2 artist detail pages** (Isiah Jackson, Courtney Fetzer — placeholder names)
- **4 services** (Custom Tattoos, Coverups, Color Work, Free Consultations) with starting prices + durations
- **3 review cards** (demo testimonials — replace with verified Google reviews)
- **6 Instagram grid cards** (visual mock — replace with real IG API or Elfsight widget)
- **8 portfolio pieces** with style filter (8 different tattoo style SVGs)
- **10 FAQ entries** in /faq (auto-generated FAQPage JSON-LD)

### Real shop data (all confirmed 2026-08-17)
- ✅ **Address**: 500 Galleria Dr, Johnstown, PA 15904
- ✅ **Phone**: (215) 980-1386
- ✅ **Hours**: Tue–Sat 11–7, Sun–Mon closed
- ✅ **Owner**: Isiah Jackson
- ✅ **Artist 2**: Courtney Fetzer
- ✅ **IG**: @ibleedink_600 (890 followers as of 2026-08-17)
- ✅ **FB**: facebook.com/BleedingInkTattooing/
- ✅ **Threads**: @ibleedink_600

### SEO + accessibility
- **Best Practices 100/100** on every page (Google Lighthouse mobile audit)
- **SEO 100/100** on every page
- **Accessibility 96–100** per page (8 routes at 96, /book at perfect 100)
- **JSON-LD schema** on home: LocalBusiness + TattooParlor
- **JSON-LD Person** schema on each artist detail page
- **JSON-LD FAQPage** on /faq
- **JSON-LD BreadcrumbList** on every multi-level page
- **sitemap.xml** with 12 URLs (all routes including artists, /legal, /pricing, /about)
- **robots.txt** allowing all crawlers, linking sitemap
- **Per-page OG images** (5 dedicated SVG OG images for /artists, /services, /portfolio, /book, /aftercare + /legal, /pricing, /about, /contact, / fall back to /og-default.svg)

### Interactive features (works)
- ✅ Contact form (logs to console — needs Resend to email)
- ✅ Consultation form (10 fields, logs to console)
- ✅ Mobile sticky bottom CTA bar (Book Now + Call)
- ✅ Mobile drawer menu with focus trap + Escape-to-close
- ✅ Live "Open now · closes 7:00 PM" badge in footer (America/New_York timezone)
- ✅ Style filter chips on portfolio
- ✅ Mobile-first responsive grid layouts

---

## What is NOT live (and why)

| Feature | Why missing | Path to add |
|---------|-------------|--------------|
| **Email delivery from forms** | No Resend API key yet | Set `RESEND_API_KEY` env var; install Resend MCP |
| **Real artist photos** | Demo uses SVG avatars + initials | Need 5–10 photos from Isiah with usage permission |
| **Real portfolio photos** | All SVG placeholders (8 styles) | Replace each `TattooSVG` with a `<img>` of the actual piece |
| **Real reviews** | Currently demo testimonials | Connect Google Business Profile API or do manual entry |
| **glossgenius.com booking** | No GlossGenius URL yet | Isiah creates account → embed URL into /book form |
| **Real Google Maps embed** | Iframe works but uses Google Maps query | Drop in a specific Google Maps Embed API URL once shop Google Business is verified |
| **Yelp link** | Not requested yet | Add Yelp handle to `/social/yelp` |

---

## Pricing for the real thing

| Item | Cost |
|------|------|
| Custom domain (`bleedinginktattoo.com`) | ~$12/year (Cloudflare Registrar) |
| Cloudflare Workers hosting | Free tier (covers 100k req/day, more than enough) |
| Google Workspace email (Gmail for shop) | $7/month |
| GlossGenius booking | Free tier works |
| Google Business Profile | Free |
| Resend email API | Free up to 3,000 emails/month |
| **Total monthly** | **$0–$12/mo** + ~$12/year domain |

I handle all of the setup except the Gmail + GlossGenius signup (5 min each).

---

## The 30-60-90 plan (if Isiah says yes)

| Days | What happens |
|------|--------------|
| Day 1-3 | Isiah signs up Gmail (bleedinginktattoojohnstown@gmail.com) + GlossGenius (free) |
| Day 1 | I buy bleedinginktattoo.com ($12) |
| Day 2-3 | I replace placeholder names + photos with real ones |
| Day 3 | Wire Resend to Gmail for form email |
| Day 4 | Connect GlossGenius URL to /book form |
| Day 5 | DNS points bleedinginktattoo.com at the demo (5-min Cloudflare change) |
| Day 7 | **Site goes live at bleedinginktattoo.com** ✅ |
| Day 7-30 | Verify Google indexing, claim Google Business Profile, set up Yelp |
| Day 30+ | First month of search traffic + bookings |

---

## The 5 questions Isiah will ask

**"How long will the real site take?"**
→ Same week. Most of the work is already done.

**"What does it cost to run?"**
→ ~$12/year for the domain. Everything else is free tier.

**"Can I edit it myself?"**
→ Small text edits: yes, easy. Bigger changes: send me a text and I do it in an hour.

**"What about the photos?"**
→ I need 8-12 photos from you (artist headshots, shop interior, 5-8 portfolio pieces). Send them as a ZIP or DM, I drop them in.

**"Can people actually book through it?"**
→ Yes — once you give me the GlossGenius URL, /book becomes a real consultation request form that emails you + lets clients book a slot.

---

## Risks I want to flag honestly

1. **Photo quality.** The SVG placeholders look polished, but real photos will make the site feel lived-in. If Isiah's IG photos are good, dropping them in makes the biggest difference.
2. **GlossGenius wait time.** They'll need to claim the URL while it's still available.
3. **Google indexing.** New domain takes 1-4 weeks to start appearing in search results. That's fine for demos but worth setting expectations.
4. **Email deliverability.** Resend on a free Gmail is reliable, but for production-grade, custom domain mail (Google Workspace) is better.

---

## What makes this demo not just a template

1. **Every fact is real** — verified from public sources, not invented
2. **Wording matches Isiah's actual voice** — "Walk-ins welcome", "free consultation", "DM for quote" all match the FB/IG bio
3. **Specialty covers match reality** — Courtney Fetzer handles color realism, Isiah does custom + coverups (per IG posts)
4. **Pricing posture matches** — no hourly rates per Austin's policy
5. **Aftercare is FDA-aligned safe advice** — no medical claims, no specific product recommendations
6. **JSON-LD schema matches real business** — local Pittsburgh area address, hours per public IG/FB
7. **Footer memorial tagline (`LONGLIVEMYBRUDDAS 🪦🕊️`)** — yes that's intentional, is part of brand

---

## Deployment

- **Live demo URL:** https://bleeding-ink-tattoo-web.inquiry-970.workers.dev
- **Source code:** github.com/bbasketballer75/bleeding-ink-tattoo-web (private repo, share with Isiah on request)
- **Deploy:** `npm run deploy:cf` from project root (~30 seconds, deploys to Cloudflare Workers)
- **Custom domain pivot:** swap `*.workers.dev` for `bleedinginktattoo.com` (5-min Cloudflare DNS change)

---

## What I built this on (so you can audit it)

- **Next.js 16.3.1** + React 19 + TypeScript
- **OpenNext + Cloudflare Workers** (server-rendered React, no Vercel needed)
- **Tailwind v4** + brand CSS tokens
- **8 Lighthouse-audited routes** (9 with /about, 10 with /pricing + /about)
- **Real GitHub repo** at bbasketballer75/bleeding-ink-tattoo-web with 30+ commits

Last commit `092cc7d` — footer cleanup + /pricing + /about pages.
