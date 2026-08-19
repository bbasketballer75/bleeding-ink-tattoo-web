# IG Cookie Export — Step by Step

**Why:** This site's portfolio uses real photos from Isiah's `@ibleedink_600` Instagram (with his sign-off). IG blocks unauthenticated scraping; the `ig_scrape.py` script needs your Chrome session cookies to load the profile + recent posts. The cookies are local-only (gitignored).

**Time:** ~3-5 minutes (one-time, or whenever cookies expire).

---

## Step 1 — Log into Instagram in Chrome

1. Open Chrome and go to **https://instagram.com**
2. Log in as the account that can view the @ibleedink_600 profile (if you're the account owner, easiest; if not, any logged-in IG account works for public-profile scraping)

> If Instagram is already open in another tab, just switch to that tab — no need to log in twice.

## Step 2 — Install the Cookie-Editor extension (if you don't have it)

1. Open **https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm**
2. Click **Add to Chrome** → **Add extension**
3. The Cookie-Editor icon (cookie/jar) appears in your extensions bar

> **Alternatives that work the same way:** "EditThisCookie", "Cookie-Editor by compétence-web". Any of them exports a JSON array of cookie objects.

## Step 3 — Open Cookie-Editor + navigate to instagram.com

1. Make sure you're on **https://instagram.com** (or any `instagram.com` page)
2. Click the **Cookie-Editor icon** in your extensions bar
3. The Cookie-Editor panel opens, showing all cookies for the current site

## Step 4 — Export the cookies

1. In Cookie-Editor, click the **Export** button (usually top-right of the panel)
2. Choose format: **Cookies (JSON)** — NOT "Netscape" / "Header String" / etc.
3. A JSON file downloads to your `~/Downloads` folder (usually named something like `cookies-instagram-com.json` or `export.json`)

> **What the JSON looks like:** a flat array of cookie objects, each with `name`, `value`, `domain`, `path`, `expirationDate`, `httpOnly`, `secure`, `sameSite`, `hostOnly`, `storeId`. The script needs `sessionid` and (ideally) `csrftoken` to work.

## Step 5 — Save the file in the project

1. Rename the file to exactly `ig_cookies.json` (case-sensitive)
2. Move it to: **`C:\Users\bbausks\Coding_Projects\bleeding-ink-tattoo-web\scripts\ig_cookies.json`**

> The file is gitignored (`scripts/ig_cookies.json` in `.gitignore`) — it will never be committed by accident.

## Step 6 — Verify the format (optional but recommended)

Open a terminal and run:

```bash
cd "C:\Users\bbausks\Coding_Projects\bleeding-ink-tattoo-web\scripts"
python -c "import json; c=json.load(open('ig_cookies.json')); print(f'{len(c)} cookies'); print('names:', sorted({x[\"name\"] for x in c}))"
```

You should see something like:

```
17 cookies
names: ['csrftoken', 'ds_user_id', 'ig_did', 'mid', 'sessionid', ...]
```

**Required:** `sessionid` and `csrftoken` MUST be in the list. If `sessionid` is missing, re-export — Chrome may have filtered the httpOnly cookies.

## Step 7 — Tell Hermes you're done

Just say "cookies saved" in chat. I'll:
1. Run the scraper (it downloads images + captions to `scripts/.ig_export/`)
2. Sanity-check the results (file sizes, format)
3. Show you a preview
4. Wire the real images into the portfolio data
5. Build + deploy + commit

---

## FAQ

**Q: Will my cookies stay safe?**
Yes — they're stored locally in `scripts/ig_cookies.json`, which is gitignored. The script uses them only to load the IG profile in a headless Chromium instance.

**Q: How long do the cookies last?**
Typically 30-90 days. If the script logs "redirected to login" or "logged out", your cookies expired — just re-export.

**Q: Can I use a different account?**
Yes. Log in as any IG account that can see the target profile, then export that account's cookies.

**Q: I don't have Chrome / prefer Firefox?**
The script expects Cookie-Editor-style JSON (Chrome's format). If you're on Firefox, use "cookies.txt" format from another extension like "Cookie-Editor by compétence-web" (cross-browser) and export as JSON, not as the Netscape cookie file.

**Q: What if Instagram flags my account for automation?**
Low risk for read-only public-profile scraping with normal cookies. If IG prompts you for a captcha on next login, complete it, then re-export cookies. Don't run the scraper more than a few times per hour.
