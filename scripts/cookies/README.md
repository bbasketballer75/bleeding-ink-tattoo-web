# IG Cookie Workspace

This directory holds Instagram session cookies for scraping
[@ibleedink_600](https://instagram.com/ibleedink_600) (and future artists).

## Files

| File | Purpose | Committed? |
|------|---------|-----------|
| `active.json` | Current working cookies (the only file you edit) | ❌ gitignored |
| `archive/<timestamp>.json` | Old cookie sets, auto-archived when you rotate | � gitignored |
| `README.md` | This file | ✅ |

## How to refresh cookies (when IG logs you out)

**Total time: ~30 seconds.** No script edits needed.

1. Open Chrome → log into instagram.com (the account whose work you want to scrape)
2. Install the [Cookie-Editor Chrome extension](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
3. Click the Cookie-Editor icon (cookie/jar icon in extensions bar)
4. Click **Export** → **Cookies (JSON)** → save anywhere (e.g., Desktop)
5. Move the saved file to this directory (`scripts/cookies/`) — name it whatever you want, e.g., `new_cookies.json`
6. Run the refresh script:

```bash
python scripts/cookie_refresh.py --path scripts/cookies/new_cookies.json
```

What it does:
- Validates the new cookie JSON (right keys, has sessionid/csrftoken)
- Computes cookie age from the latest expirationDate
- **Archives the old** `active.json` to `archive/<timestamp>.json` (so you have a rollback if needed)
- **Replaces** `active.json` with the new set
- Prints a one-line status (🟢 / 🟡 / 🔴 + days remaining)

After refresh, your next scrape (manual or cron) uses the new cookies.

## Auto-validation

The script checks for:
- ✅ Required cookies: `sessionid`, `csrftoken`, `ds_user_id`
- ✅ Cookie file is valid JSON
- ✅ Reasonable age (>0 days, <90 days)

If validation fails, the script prints what went wrong and exits with a non-zero code. **The old `active.json` is preserved** so you can debug.

## Cookie lifespan (what to expect)

IG cookies typically last **~30 days** before the `sessionid` expires. The system will alert you when cookies are 21 days old (🟡) and when they're 30+ days old (🔴).

If you notice the scraper failing or no images showing up:
1. Open the Telegram alerts (already configured via 1mcp cron)
2. Re-export cookies (steps above)
3. Re-run the scrape

## Rollback (if new cookies are broken)

```bash
# Pick the most recent archived cookie set
ls scripts/cookies/archive/
cp scripts/cookies/archive/2026-XX-XX_HHMMSS.json scripts/cookies/active.json
```

## Why not just keep cookies in env vars / git?

- **Env vars:** Would require restarting the scraping environment on every cookie refresh — friction.
- **Git:** Even with `.gitignore`, accidentally committing credentials is one of the top 5 causes of token leaks. The `archive/` directory gives you a local-only history without that risk.
