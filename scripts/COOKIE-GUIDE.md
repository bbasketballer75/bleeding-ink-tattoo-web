# IG Cookie Export — Step by Step

**Why:** This site's portfolio uses real photos from Isiah's `@ibleedink_600` Instagram (with his sign-off). IG blocks unauthenticated scraping; the scraper needs a logged-in browser session. Cookies carry that session.

> **TL;DR (the new fast way):**
> 1. Export cookies from Chrome (5 min, full guide below)
> 2. Drop the file in `scripts/cookies/` (any name, e.g. `new_cookies.json`)
> 3. Run `python scripts/cookie_refresh.py` — validates + archives old + activates new (30 seconds)
> 4. Run `python scripts/update_portfolio.py --artist isiah-jackson --commit` to scrape + stage (5 min)
>
> Total: ~6 minutes from "I'm logged out" to "new photos in portfolio". Detailed steps below.

---

## What you need

- A Chrome (or any Chromium-based) browser
- Logged into the Instagram account whose work you want to scrape (e.g. `@ibleedink_600`)
- The "Cookie-Editor" Chrome extension (one-time install, free)

## Step 1: Install Cookie-Editor

1. Open Chrome
2. Go to [Cookie-Editor on Chrome Web Store](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
3. Click **Add to Chrome** → confirm
4. You should see a small cookie/jar icon in your extensions bar (top-right of Chrome)

## Step 2: Log into Instagram

1. In Chrome, go to [instagram.com](https://instagram.com)
2. Log into the account whose work you want to scrape
3. Stay logged in for the next steps

## Step 3: Export cookies

1. While on instagram.com, click the **Cookie-Editor extension icon** (cookie/jar)
2. Click the **Export** button
3. Select **Cookies (JSON)** format (NOT Netscape)
4. Save the file anywhere convenient (e.g. your Desktop). Chrome will name it something like `cookies.json` or `instagram.com_cookies.json`

## Step 4: Drop the file in the right place

1. Move/save the file to:
   ```
   C:/Users/bbask/Coding_Projects/bleeding-ink-tattoo-web/scripts/cookies/
   ```
2. Name it whatever you want — e.g. `new_cookies.json`, `2026-09-15_cookies.json`. The `cookie_refresh.py` script will pick the newest file.

> **Don't worry about overwriting:** the `cookie_refresh.py` script auto-archives the previous `active.json` to `scripts/cookies/archive/<timestamp>.json` before replacing. You'll have a rollback if the new cookies are broken.

## Step 5: Run the refresh script

```bash
cd C:/Users/bbask/Coding_Projects/bleeding-ink-tattoo-web
python scripts/cookie_refresh.py
```

Or explicitly point at the file you just dropped:
```bash
python scripts/cookie_refresh.py --path scripts/cookies/new_cookies.json
```

What this does:
1. Validates the new cookies (checks for required cookies like `sessionid`, `csrftoken`)
2. Computes the age from the latest `expirationDate`
3. Archives the current `active.json` to `archive/<timestamp>.json` (rollback safety)
4. Copies your new file to `active.json`
5. Prints a one-line status: 🟢/🟡/🔴 + days remaining

Example output:
```
source: new_cookies.json
cookie age: 27 days (🟢 OK)
validation: 🟢 11 cookies parsed OK
archived: cookies/archive/2026-08-19_111054.json
activated: cookies/active.json

=== SUMMARY ===
new cookies: new_cookies.json
age: 27 days (🟢 OK)

Next step: python scripts/update_portfolio.py --artist isiah-jackson
```

If validation fails, the script prints what went wrong (e.g. "sessionid cookie missing") and exits with a non-zero code. The old `active.json` is preserved.

## Step 6: Scrape + update portfolio

```bash
python scripts/update_portfolio.py --artist isiah-jackson
```

What this does:
1. Loads the cookies from `active.json`
2. Runs the scraper (Playwright headless, ~3-5 min)
3. Filters for real tattoo photos (≥50KB, portrait aspect preferred)
4. Deduplicates by SHA-256 (no duplicates with existing photos)
5. Copies new images to `public/images/portfolio/isiah/`
6. Updates `src/data/portfolio.ts` with new entries
7. **Stages** the changes in git (doesn't commit automatically)

When done, review the staged changes:
```bash
git status
git diff --cached
```

If it looks good, commit and push:
```bash
git commit -m "chore(portfolio): auto-update from IG scrape"
git push
```

Or use `--commit` flag to commit (but not push):
```bash
python scripts/update_portfolio.py --artist isiah-jackson --commit
```

## Dry-run mode

Want to see what would happen without making changes?

```bash
python scripts/update_portfolio.py --artist isiah-jackson --dry-run
```

This will run the full scrape and tell you:
- How many new images would be added
- What their filenames would be
- Which existing entries would be modified
Without writing any files.

## FAQ

### How often do I need to do this?

- IG cookies typically last **~30 days** before the `sessionid` expires.
- The system will alert you via the daily health check (1mcp cron) when cookies hit 21 days.
- For safety: **refresh monthly** (every 30 days) as a habit.

### What if I forget and the cookies expire?

The scraper will fail with an error message saying "not logged in." Re-export from Chrome (steps above) and run the refresh + update.

### Can I test if my cookies work without running the full scrape?

```bash
python scripts/cookie_refresh.py --path scripts/cookies/active.json --validate-only
```

This validates the JSON, checks for required cookies, and computes the age — no scraping, no archives.

### Where do I get the right IG account?

For this site: log into Isiah Jackson's `@ibleedink_600` account (or the account whose portfolio you want featured). If you don't have the password, ask the account owner to do this 30-second export for you.

### The cookie age says "EXPIRED" but Chrome shows me logged in — what gives?

IG's sessionid cookie is bound to specific browser fingerprint + IP. If you're logging in from a different device or IP than usual, IG may invalidate the cookie within hours even if it was set to expire in 90 days. Just re-export and try again.

### I'm getting 403 "Bad URL hash" errors when downloading images

This used to be a cookie problem but isn't anymore (the scraper uses browser-context fetch via network interception, which bypasses this). If you see it:
1. Check the cookies are loaded: `python scripts/cookie_refresh.py --validate-only`
2. Re-export fresh cookies from Chrome
3. Try `python scripts/update_portfolio.py --no-headless` to see what's happening in the browser

### The scrape completes but I don't see new images

The scraper skips images < 50KB (UI thumbnails) and prefers portrait aspect. Check `scripts/.ig_export/<artist>/<timestamp>/posts/` to see what was captured — the raw output is always preserved.

### Where can I see the daily health alerts?

The `ig-cookie-health-daily` cron (registered with 1mcp) runs daily at 8am. To get Telegram alerts, you'd want to add `deliver='telegram'` when creating the cron (currently set to local — outputs saved but not pushed).

## Architecture (for the curious)

The cookie system has three layers:

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Cookie ingest (one drop-in)                │
│   scripts/cookies/active.json  ← only file you touch│
│   scripts/cookie_refresh.py    ← validates + archives │
├─────────────────────────────────────────────────────┤
│ Layer 2: Scrape runner (manual or scheduled)         │
│   scripts/ig_scrape.py         ← thin CLI             │
│   scripts/update_portfolio.py  ← orchestrator + diff │
│   scripts/lib/                 ← pure helpers         │
├─────────────────────────────────────────────────────┤
│ Layer 3: Health monitoring (cron, daily 8am)        │
│   scripts/ig-cookie-health.py  ← status + alert      │
│   (1mcp cron job: ig-cookie-health-daily)             │
└─────────────────────────────────────────────────────┘
```

For the frictionless workflow: just drop in new cookies + run one command. Everything else is automated.
