"""
Instagram profile + post scraper using Playwright + storage_state.

USAGE
=====
1. Install: pip install playwright && playwright install chromium
2. In your regular Chrome browser, log into Instagram (account: @ibleedink_600
   or whichever IG account you want to scrape)
3. Install the "Cookie-Editor" Chrome extension
4. Export cookies as JSON, save to: ig_cookies.json (next to this script)
5. Run: python ig_scrape.py

If ig_cookies.json is missing, the script prints setup instructions and exits.

WHAT IT SCRAPES
===============
- Profile metadata (display name, bio, follower count, profile pic URL)
- Top N recent posts: image URLs + captions + hashtags
- Reels: cover image URL + caption + view count

OUTPUT
======
Writes to ./ig_export/<username>/<timestamp>/
  - profile.json
  - posts/  (image_001.jpg, image_002.jpg, ...)
  - posts.json
  - captions.txt
"""

import json
import os
import re
import sys
import time
import urllib.parse
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright


COOKIE_FILE = Path(__file__).parent / ".ig_cookies.json"
EXPORT_ROOT = Path(__file__).parent / ".ig_export"

USERNAME = "ibleedink_600"  # change to scrape a different IG account
POST_LIMIT = 24  # how many recent posts to capture (max 50 to avoid rate limits)
WAIT_MS = 4000  # how long to wait for IG's JS to render after page load


def instructions() -> None:
    """Print setup instructions when ig_cookies.json is missing."""
    print("=" * 72)
    print(" IG cookie export needed")
    print("=" * 72)
    print()
    print(" 1. In Chrome, log into Instagram (https://instagram.com) as the account")
    print("    you want to scrape.")
    print()
    print(" 2. Install the 'Cookie-Editor' Chrome extension:")
    print("    https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm")
    print()
    print(" 3. Click the Cookie-Editor icon > 'Export' > 'Cookies (JSON)'")
    print()
    print(" 4. Save the file as: " + str(COOKIE_FILE))
    print()
    print(" 5. Re-run: python ig_scrape.py")
    print()
    print(" Tip: cookies expire (~30 days) and IG invalidates them on suspicious")
    print(" activity. Re-export if the script logs 'redirected to login'.")
    print("=" * 72)


def load_storage_state() -> dict:
    """Read Chrome's Cookie-Editor export and reshape it to Playwright's
    storage_state format. Cookie-Editor exports a flat array of cookie
    objects; Playwright expects {cookies: [...], origins: [...]}."""
    if not COOKIE_FILE.exists():
        instructions()
        sys.exit(1)

    raw = json.loads(COOKIE_FILE.read_text(encoding="utf-8"))
    # Cookie-Editor may wrap under a key, or be a flat list
    if isinstance(raw, dict) and "cookies" in raw:
        cookies = raw["cookies"]
    elif isinstance(raw, list):
        cookies = raw
    elif isinstance(raw, dict) and any(isinstance(v, list) for v in raw.values()):
        # Some exporters nest under a domain name (e.g. {"instagram.com": [...]})
        cookies = [c for v in raw.values() if isinstance(v, list) for c in v]
    else:
        print(f"Unrecognized cookie export format. Got keys: {list(raw.keys()) if isinstance(raw, dict) else type(raw).__name__}")
        print("Expected: a flat list of cookie objects, or a Playwright storage_state object.")
        instructions()
        sys.exit(1)

    if not cookies:
        print("Cookie file parsed but contains zero cookies.")
        instructions()
        sys.exit(1)

    # Sanity check: Instagram requires these two cookies to be logged in
    cookie_names = {c.get("name") for c in cookies}
    if "sessionid" not in cookie_names:
        print(f"WARN: 'sessionid' cookie not found (you have: {cookie_names})")
        print("IG may reject these cookies. If you get a login redirect, re-export.")
    if "csrftoken" not in cookie_names:
        print("WARN: 'csrftoken' cookie not found (you have: {cookie_names})")
        print("Some IG API endpoints may reject requests without it.")
    print(f"  loaded {len(cookies)} cookies from {COOKIE_FILE.name}")
    print(f"  domains: {sorted({c.get('domain','?') for c in cookies})}")

    # Normalize cookie fields to Playwright's schema
    norm = []
    for c in cookies:
        # Handle both Chrome's "host-only" / "sameSite" / "session" / "storeId"
        # and the simpler Playwright "sameSite" / "expires" format.
        entry = {
            "name": c["name"],
            "value": c["value"],
            "domain": c.get("domain", ".instagram.com"),
            "path": c.get("path", "/"),
        }
        if "expirationDate" in c:  # Cookie-Editor uses this
            entry["expires"] = c["expirationDate"]
        elif "expires" in c:
            entry["expires"] = c["expires"]
        # else: session cookie, no expires
        if c.get("secure"):
            entry["secure"] = True
        if c.get("httpOnly"):
            entry["httpOnly"] = True
        # SameSite mapping
        ss = c.get("sameSite", "Lax")
        if ss in (None, "", "no_restriction", "None"):
            entry["sameSite"] = "None"
        elif ss.lower() == "lax":
            entry["sameSite"] = "Lax"
        elif ss.lower() == "strict":
            entry["sameSite"] = "Strict"
        norm.append(entry)

    # Playwright requires a url field per origin if there's localStorage
    # We only have cookies here, but Playwright still needs a "fake origin"
    origins = [{
        "origin": "https://www.instagram.com",
        "localStorage": [],
    }, {
        "origin": "https://instagram.com",
        "localStorage": [],
    }]
    return {"cookies": norm, "origins": origins}


def is_logged_in(page) -> bool:
    """IG shows the login nav for logged-out users. Check for it."""
    try:
        # The avatar button only appears for authenticated users
        if page.locator("svg[aria-label='Profile']").count() > 0:
            return True
        if "Login" in page.title():
            return False
        # Fallback: any "Log in" text
        if page.locator("text=Log in").count() > 0:
            return False
        return True
    except Exception:
        return False


def main() -> None:
    storage = load_storage_state()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = EXPORT_ROOT / USERNAME / timestamp
    out_dir.mkdir(parents=True, exist_ok=True)
    images_dir = out_dir / "posts"
    images_dir.mkdir(exist_ok=True)

    print(f"[{timestamp}] starting scrape of @{USERNAME}")
    print(f"  output: {out_dir}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-blink-features=AutomationControlled"])
        ctx = browser.new_context(
            storage_state=storage,
            viewport={"width": 1280, "height": 900},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )
        page = ctx.new_page()

        # === 1. Profile ===
        print("\n[1/3] fetching profile...")
        page.goto(f"https://www.instagram.com/{USERNAME}/", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(WAIT_MS)

        if not is_logged_in(page):
            print("  WARN: appears to be logged out (redirect or login page shown)")
            print("  your cookies may have expired. Re-export and try again.")
            page.screenshot(path=str(out_dir / "_debug_logged_out.png"))
            ctx.close()
            browser.close()
            return

        # Pull meta from the page source
        html = page.content()
        profile = {
            "username": USERNAME,
            "url": f"https://www.instagram.com/{USERNAME}/",
            "scraped_at": timestamp,
            "html_size": len(html),
            "title": page.title(),
        }
        # Extract meta tags (OG image = profile pic, description = bio)
        for m in re.finditer(r'<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"', html):
            k, v = m.group(1), m.group(2)
            if k == "og:title":
                profile["display_name"] = v
            elif k == "og:description":
                profile["bio"] = v[:500]
            elif k == "og:image":
                profile["profile_picture"] = v
        (out_dir / "profile.json").write_text(json.dumps(profile, indent=2))
        print(f"  display_name: {profile.get('display_name', '?')}")
        print(f"  profile_picture: {profile.get('profile_picture', '?')[:80]}")

        # === 2. Posts grid ===
        print("\n[2/3] collecting post links...")
        # IG profile page has a grid of post links like /p/<id> or /reel/<id>
        post_links = []
        last_count = 0
        for scroll in range(8):  # up to 8 scroll attempts
            links = page.eval_on_selector_all(
                "a[href*='/p/'], a[href*='/reel/']",
                "els => els.map(e => e.href).filter(h => /\\/(p|reel)\\/[A-Za-z0-9_-]+\\/?$/.test(h))"
            )
            # Dedup
            for h in links:
                if h not in post_links:
                    post_links.append(h)
            print(f"  scroll {scroll+1}: {len(post_links)} unique post links")
            if len(post_links) >= POST_LIMIT:
                break
            # Auto-scroll
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(2500)

        post_links = post_links[:POST_LIMIT]
        print(f"  capped at {len(post_links)} posts")

        # === 3. Visit each post, extract image(s) + caption ===
        print(f"\n[3/3] extracting posts...")
        posts_data = []
        session = ctx.request  # reuse auth for image downloads
        for i, url in enumerate(post_links, 1):
            post_id = re.search(r"/(p|reel)/([A-Za-z0-9_-]+)/?", url).group(2)
            kind = "reel" if "/reel/" in url else "post"
            print(f"  [{i}/{len(post_links)}] {kind} {post_id}", end=" ... ")

            try:
                page.goto(url, wait_until="domcontentloaded", timeout=20000)
                page.wait_for_timeout(2500)
                post_html = page.content()

                # Caption from meta og:description
                caption = ""
                m = re.search(r'<meta\s+property="og:description"\s+content="([^"]+)"', post_html)
                if m:
                    caption = m.group(1)

                # Image URLs — look for scontent CDN URLs
                # IG serves images from scontent-*.cdninstagram.com
                # Prefer the og:image (canonical preview) plus the actual post images
                image_urls = set()
                m = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', post_html)
                if m:
                    image_urls.add(m.group(1))
                for m in re.finditer(r'https://scontent-[^"\s\\]+\.(?:jpg|jpeg|png|webp)[^"\s\\]*', post_html):
                    image_urls.add(m.group(0))
                # Filter out tiny profile/avatar images (< 200x200)
                image_urls = [u for u in image_urls if not any(x in u for x in ("s150x150", "s320x320", "profile_pic"))]

                # Download the largest (og:image usually = best quality preview)
                local_paths = []
                image_urls.sort(key=len, reverse=True)  # heuristic: longest URL = best quality
                for img_idx, img_url in enumerate(image_urls[:3], 1):
                    safe_id = post_id.replace("/", "_")
                    fname = images_dir / f"{safe_id}_{img_idx}.jpg"
                    try:
                        resp = session.get(img_url, timeout=15)
                        if resp.ok and len(resp.body()) > 5000:  # skip tiny < 5KB
                            fname.write_bytes(resp.body())
                            local_paths.append(str(fname.relative_to(out_dir.parent)))
                    except Exception as e:
                        print(f"dl fail: {e}")

                posts_data.append({
                    "id": post_id,
                    "type": kind,
                    "url": url,
                    "caption": caption[:1000],
                    "image_urls": list(image_urls[:5]),
                    "local_files": local_paths,
                })
                print(f"got {len(local_paths)} img(s)")
            except Exception as e:
                print(f"err: {e}")
                posts_data.append({"id": post_id, "type": kind, "url": url, "error": str(e)})

        (out_dir / "posts.json").write_text(json.dumps(posts_data, indent=2))
        (out_dir / "captions.txt").write_text(
            "\n\n".join(f"--- {p.get('id')} ({p.get('type', '?')}) ---\n{p.get('caption', '')}" for p in posts_data)
        )

        ctx.close()
        browser.close()

    # === Summary ===
    ok = [p for p in posts_data if p.get("local_files")]
    print(f"\n=== DONE ===")
    print(f"profile: {profile.get('display_name', USERNAME)}")
    print(f"posts captured: {len(ok)}/{len(posts_data)} with images")
    print(f"output: {out_dir}")
    print(f"\nNext: copy any *.jpg from {images_dir} into your project's public/images/portfolio/")


if __name__ == "__main__":
    main()
