# Bleeding Ink Tattoo — Launch Checklist

> Everything that still needs to happen before bleedinginktattoo.com is live.
> Walk through top-to-bottom in order.

---

## Phase 1: Pre-deploy (you, ~30 min)

### 1.1 Buy domain `bleedinginktattoo.com`

Recommended registrar: **Cloudflare Registrar** (cheapest at-cost pricing,
no markup, free WHOIS privacy, free DNS). Alternative: Namecheap.

- [ ] Create Cloudflare account (or sign in)
- [ ] Search `bleedinginktattoo.com` → add to cart (~$12/yr)
- [ ] Complete checkout
- [ ] Set nameservers to Cloudflare's (auto-shown after purchase)
- [ ] Verify domain shows as "Active" in Cloudflare dashboard

### 1.2 Create a Gmail for the shop

Since the shop has no email yet, we'll route the contact form via Resend to
a free Gmail that auto-forwards to Isiah's personal phone SMS, OR Isiah can
just check the Gmail inbox.

Recommended: `bleedinginktattoojohnstown@gmail.com` (or similar).

- [ ] Create Gmail
- [ ] Set up 2FA (required for Resend SMTP)
- [ ] Generate **App Password** at https://myaccount.google.com/apppasswords
  (label it "Bleeding Ink Website")
- [ ] Save the 16-char app password somewhere safe

### 1.3 Create a GlossGenius account (for /book)

Free tier works. ~10 min.

- [ ] Sign up at https://glossgenius.com with the shop's email
- [ ] Add shop profile: name "Bleeding Ink", address, phone, hours
- [ ] Set **deposit to $65** non-refundable
- [ ] List artists (Isiah, Courtney) with their individual hours
- [ ] Get your **booking URL** (something like https://bleedinginktattoo.glossgenius.com or similar)
- [ ] **Send me the booking URL** so I can embed it on /book

---

## Phase 2: Deploy (me, after you give me the booking URL)

Once you have the 3 items above, tell me. I'll:

- [ ] Deploy to Vercel (free tier, custom domain support)
- [ ] Connect `bleedinginktattoo.com` → Vercel via Cloudflare DNS
- [ ] Embed GlossGenius on /book (replaces placeholder)
- [ ] Configure Resend with the Gmail app password for the contact form
- [ ] Verify SSL, OG tags, sitemap, robots.txt

---

## Phase 3: Directory claim (you, ~45 min, parallel)

After the site is deployed:

### 3.1 Critical (do these immediately)
- [ ] **Google Business Profile** — https://business.google.com
  - This is the #1 driver of local tattoo-shop discovery
  - Verify by postcard (5-14 days) — start ASAP
  - Use exact name "Bleeding Ink Tattooing", exact address, exact hours
  - Category: "Tattoo shop" + "Body piercing shop" if applicable
  - Add photos of shop exterior, interior, and the team

- [ ] **Yelp** — https://biz.yelp.com
  - Claim the (currently non-existent) listing
  - Free, takes 1-3 days for claim to process

### 3.2 High-value (do these in week 1)
- [ ] **InkFinder** — https://inkfinder.tattoo/shop-network (free)
- [ ] **TattooShopsNearMe.com** — find their claim form (URL not indexed)
- [ ] **BBB** — https://www.bbb.org (optional; not critical for tattoo shops)

### 3.3 Cross-link (you, ~5 min)
- [ ] Update Instagram `@ibleedink_600` bio link → `https://bleedinginktattoo.com`
- [ ] Update Facebook page About section → add website
- [ ] Update Threads bio → add website

---

## Phase 4: Post-launch (me, ongoing)

- [ ] Monitor Vercel logs for errors
- [ ] Watch Resend delivery for contact form spam
- [ ] (optional) Set up Plausible analytics when the chrome-devtools MCP
      server gets remounted for Lighthouse runs

---

## Estimated timeline

| Phase | Time | Who |
|-------|------|-----|
| Buy domain + create Gmail + GlossGenius | ~30 min | you |
| Deploy + embed booking + configure email | ~45 min | me |
| Directory claims (mostly waiting) | 5-14 days | you (mostly automated) |
| Cross-link socials | ~5 min | you |
| **Total** | **~1.5 hr active, ~2 weeks wall-clock** | |

Once the domain is live + GlossGenius URL in hand, the site will be fully
production-ready and start appearing in local Google searches within a week.