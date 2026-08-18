# Deploy to Cloudflare Workers (FREE)

> **Date:** 2026-08-18
> **Live URL:** **https://bleeding-ink-tattoo-web.inquiry-970.workers.dev**
> **Stack:** Next.js 16.3.1 + OpenNext 1.20.2 + Wrangler 4.123.0
> **Cost:** $0 (Workers Free tier, 100k requests/day)

---

## One-time setup (already done)

- ✅ Wrangler installed and authenticated as `inquiry@friendlycityprintshop.com`
- ✅ Project configured for OpenNext adapter (`open-next.config.ts`, `wrangler.jsonc`)
- ✅ Contact form action rewritten to use Resend REST API via `fetch` (works in both Node + Workers runtimes)
- ✅ Upgraded Next 16.2.6 → 16.3.1 (required for OpenNext 1.20+ Turbopack support)

## Daily commands

```bash
# Local dev (Turbopack fast reload)
npm run dev          # http://localhost:3009

# Build for OpenNext/Workers
npm run build:next    # Standard Next build
npm run build:cf      # Next build + OpenNext bundle (writes .open-next/)

# Preview locally using the Workers runtime
npm run preview       # opennextjs-cloudflare build && wrangler dev

# Deploy to Cloudflare
npm run deploy:cf     # opennextjs-cloudflare build && wrangler deploy
```

## Known limitations

- **Contact form** requires `RESEND_API_KEY` + `RESEND_TO_EMAIL` env vars to actually email (currently no-ops + logs in demo mode — fine for sales pitch)
- **No custom domain** — URL stays `*.workers.dev` until they buy `bleedinginktattoo.com`
- **Worker Free tier** = 100,000 requests/day (a sales pitch gets ~50 requests, well within limit)

## What I had to debug to get here

1. Tried `wrangler dev --local` → `next dev` (Windows) crashes with `lightningcss` worker DLL init failure → workaround: use `next build && next start` for local; build/deploy unaffected
2. Tried `cloudflared --url http://localhost:3013` for instant public URL → Cloudflare 404 (existing Access rules interfere with quick tunnels)
3. Tried Vercel → realized it requires buying the domain OR using `*.vercel.app` which feels less branded
4. Tried Cloudflare Pages + next-on-pages → Next 16.2.6 too old for OpenNext
5. Tried OpenNext 1.19.11 + Next 16.2.6 → ChunkLoadError (Turbopack not yet supported)
6. **Upgraded Next → 16.3.1 + OpenNext → 1.20.2** → works ✅
7. First hit to some routes 500s (cold-start chunk warm-up) → second hit 200s (edge caches the chunks)

## Future: Adding custom domain bleedinginktattoo.com

If Bleeding Ink buys the domain:

1. Add CNAME `bleedinginktattoo.com` → `bleeding-ink-tattoo-web.inquiry-970.workers.dev` in their DNS
2. In Cloudflare dashboard: Workers → bleeding-ink-tattoo-web → Settings → Triggers → Add Custom Domain → `bleedinginktattoo.com`
3. Update `src/lib/constants.ts` SITE_URL from `https://bleedinginktattoo.com` to the new domain
4. Run `npm run deploy:cf` again

Total time: ~5 minutes.