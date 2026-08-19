"""
Instagram profile + post scraper using Playwright + Pattern 3 (network interception).

USAGE
=====
1. Export Chrome cookies from instagram.com using Cookie-Editor extension
   (or any cookie export tool). Save as JSON next to this script:
       scripts/.ig_cookies.json
2. Run: python ig_scrape.py

WHAT IT SCRAPES
===============
- Profile metadata (display name, bio, follower count, profile pic URL)
- Top N recent posts/reels: image URLs + captions + hashtags
- Downloads actual image bytes via Playwright network interception

HOW IT WORKS
============
Pattern 3: Playwright registers a `response` event handler that captures
image bytes AS THE PAGE LOADS THEM. The page's own browser context has the
authenticated fetch stack (cookies + IndexedDB + service worker tokens),
so it can successfully request scontent.cdninstagram.com URLs.
Our script intercepts the responses - never makes its own fetch.

This is the pattern used by community IG scrapers (anassk01/instagram-scraper,
makaraduman/insta-scraper) adapted for Python.

OUTPUT
======
Writes to ./ig_export/<username>/<timestamp>/
  - profile.json
  - posts/  (image_001.jpg, image_002.jpg, ...)
  - posts.json
  - captions.txt
"""
import asyncio
import json
import re
import sys
from datetime import datetime
from pathlib import Path

from playwright.async_api import async_playwright

# ============================================================================
# Configuration
# ============================================================================

COOKIE_FILE = Path(__file__).parent / ".ig_cookies.json"
EXPORT_ROOT = Path(__file__).parent / ".ig_export"
USERNAME = "ibleedink_600"
PROFILE_URL = f"https://www.instagram.com/{USERNAME}/"
MAX_POSTS = 24
MAX_IMAGES_PER_POST = 5
MIN_IMAGE_BYTES = 5000  # skip tiny < 5KB (avatars, emoji)
SCROLL_PAUSE_MS = 2500  # wait between scrolls
POST_WAIT_MS = 3000  # wait after navigating to each post


# ============================================================================
# Helpers
# ============================================================================

def load_storage_state():
    """Convert Cookie-Editor export to Playwright storage_state."""
    if not COOKIE_FILE.exists():
        instructions()
        sys.exit(1)

    raw = json.loads(COOKIE_FILE.read_text(encoding="utf-8"))
    if isinstance(raw, dict) and "cookies" in raw:
        cookies = raw["cookies"]
    elif isinstance(raw, list):
        cookies = raw
    else:
        print(f"Unrecognized cookie export format. Got: {list(raw.keys()) if isinstance(raw, dict) else type(raw).__name__}")
        instructions()
        sys.exit(1)

    if not cookies:
        print("Cookie file parsed but contains zero cookies.")
        instructions()
        sys.exit(1)

    cookie_names = {c.get("name") for c in cookies}
    if "sessionid" not in cookie_names:
        print(f"WARN: 'sessionid' cookie not found (you have: {cookie_names})")
        print("IG may reject these cookies. If you get a login redirect, re-export.")
    if "csrftoken" not in cookie_names:
        print("WARN: 'csrftoken' cookie not found (you have: {cookie_names})")
        print("Some IG API endpoints may reject requests without it.")
    print(f"  loaded {len(cookies)} cookies from {COOKIE_FILE.name}")
    print(f"  domains: {sorted({c.get('domain','?') for c in cookies})}")

    # Normalize to Playwright's schema
    pw_cookies = []
    for c in cookies:
        expires = c.get("expirationDate")
        if isinstance(expires, float):
            expires = int(expires)
        elif expires is None:
            expires = -1  # session cookie
        ss = c.get("sameSite")
        if isinstance(ss, str) and ss.lower() == "lax":
            ss = "Lax"
        elif isinstance(ss, str) and ss.lower() == "strict":
            ss = "Strict"
        else:
            ss = "None"
        pw_cookies.append({
            "name": c["name"],
            "value": c["value"],
            "domain": c.get("domain", ".instagram.com"),
            "path": c.get("path", "/"),
            "expires": expires,
            "httpOnly": c.get("httpOnly", False),
            "secure": c.get("secure", False),
            "sameSite": ss,
        })
    return {"cookies": pw_cookies, "origins": [
        {"origin": "https://www.instagram.com", "localStorage": []},
        {"origin": "https://instagram.com", "localStorage": []},
    ]}


def instructions():
    print("=" * 72)
    print(" IG cookie export needed")
    print("=" * 72)
    print()
    print(" 1. In Chrome, log into Instagram (https://instagram.com)")
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


async def is_logged_in(page) -> bool:
    """Check if IG recognizes us as logged in."""
    try:
        # If 'Log in' is visible OR title is 'Login', we're NOT logged in
        title = await page.title()
        if "Log in" in title or "Login" in title:
            return False
        # Check the URL didn't redirect to /accounts/login/
        if "/accounts/login" in page.url:
            return False
        # Count visible Log in buttons (more reliable than title for SPA)
        try:
            log_in_count = await page.locator("text=Log in").count()
            if log_in_count > 0:
                return False
        except Exception:
            pass
        # Check for the avatar/profile button (only present when logged in)
        try:
            avatar_count = await page.locator("svg[aria-label='Profile']").count()
            if avatar_count > 0:
                return True
        except Exception:
            pass
        # Fallback: assume logged in if no clear sign-out indicators
        return True
    except Exception:
        return False


# ============================================================================
# Main scraper
# ============================================================================

async def main():
    storage = load_storage_state()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = EXPORT_ROOT / USERNAME / timestamp
    out_dir.mkdir(parents=True, exist_ok=True)
    images_dir = out_dir / "posts"
    images_dir.mkdir(exist_ok=True)

    print(f"\n[{timestamp}] starting scrape of @{USERNAME}")
    print(f"  output: {out_dir}")

    # Shared dict to accumulate images across all posts
    # Each post keeps its OWN images dict so we can attribute files correctly
    image_buckets: dict[str, dict[str, bytes]] = {}  # post_id -> {url -> body}

    def make_response_handler(post_id: str):
        async def handle_response(response):
            url = response.url
            if "scontent" not in url or ".jpg" not in url:
                return
            try:
                body = await response.body()
                if len(body) > MIN_IMAGE_BYTES:
                    image_buckets.setdefault(post_id, {})[url] = body
                    print(f"    [intercept] {url[:70]}... ({len(body)} bytes)")
            except Exception as e:
                pass  # silent fail - just keep what we get
        return handle_response

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-blink-features=AutomationControlled"],
        )
        context = await browser.new_context(
            storage_state=storage,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )

        # === 1. Fetch profile ===
        print("\n[1/3] fetching profile...")
        page = await context.new_page()
        # Register global response handler for profile images (og:image etc)
        async def handle_profile_response(r):
            url = r.url
            if "scontent" not in url or ".jpg" not in url:
                return
            try:
                body = await r.body()
                if len(body) > MIN_IMAGE_BYTES:
                    image_buckets.setdefault("__profile__", {})[url] = body
            except Exception:
                pass
        page.on("response", lambda r: asyncio.create_task(handle_profile_response(r)))

        await page.goto(PROFILE_URL, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)

        # Save HTML for debug (always save first run)
        debug_html = out_dir / "profile_debug.html"
        debug_html.write_text(await page.content(), encoding="utf-8")

        if not is_logged_in(page):
            print("  !! not logged in - cookies expired/invalid")
            await browser.close()
            sys.exit(1)

        html = await page.content()
        # Display name from title or og:title
        m = re.search(r'<meta\s+property="og:title"\s+content="([^"]+)"', html)
        display_name = m.group(1) if m else USERNAME
        # Bio from description
        m = re.search(r'<meta\s+property="og:description"\s+content="([^"]+)"', html)
        description = m.group(1) if m else ""
        # Profile pic URL
        m = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', html)
        profile_pic = m.group(1) if m else ""

        profile = {
            "username": USERNAME,
            "display_name": display_name,
            "description": description,
            "profile_pic_url": profile_pic,
        }
        (out_dir / "profile.json").write_text(json.dumps(profile, indent=2))
        print(f"  display_name: {display_name}")
        print(f"  profile_pic: {profile_pic[:80]}...")

        # === 2. Collect post links ===
        print("\n[2/3] collecting post links...")
        post_links = []
        seen = set()
        scroll_count = 0
        max_scrolls = 5
        while scroll_count < max_scrolls and len(post_links) < MAX_POSTS:
            scroll_count += 1
            html = await page.content()
            # Match both absolute (https://www.instagram.com/reel/...) and
            # relative (/reel/...) URLs from the embedded JSON
            for url in re.findall(r'(?:https?://(?:www\.)?instagram\.com)?/(?:p|reel|reels)/([A-Za-z0-9_-]+)/?', html):
                # Reconstruct as absolute; filter out non-target usernames
                if 'edinkoffical' in url or 'toronto' in url:
                    continue
                full = f"https://www.instagram.com/reel/{url}/"
                if full not in seen:
                    seen.add(full)
                    post_links.append(full)
            print(f"  scroll {scroll_count}: {len(post_links)} unique post links")
            if len(post_links) >= MAX_POSTS:
                break
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(SCROLL_PAUSE_MS)

        post_links = post_links[:MAX_POSTS]
        print(f"  capped at {len(post_links)} posts")

        # === 3. Visit each post + intercept image responses ===
        print(f"\n[3/3] extracting {len(post_links)} posts (image interception)...")
        posts_data = []
        for i, url in enumerate(post_links, 1):
            post_match = re.search(r"/(p|reel)/([A-Za-z0-9_-]+)/?", url)
            if not post_match:
                continue
            post_id = post_match.group(2)
            kind = "reel" if "/reel/" in url else "post"
            print(f"  [{i}/{len(post_links)}] {kind} {post_id} ... ", end="", flush=True)

            # Register response handler for THIS post
            handler = make_response_handler(post_id)
            page.on("response", lambda r, h=handler: asyncio.create_task(h(r)))

            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=20000)
                await page.wait_for_timeout(POST_WAIT_MS)

                html = await page.content()
                # Caption
                m = re.search(r'<meta\ss+property="og:description"\s+content="([^"]+)"', html)
                caption = m.group(1) if m else ""
                # Post permalink
                permalink_m = re.search(r'<meta\ss+property="og:url"\s+content="([^"]+)"', html)
                permalink = permalink_m.group(1) if permalink_m else url

                # Scroll within post to trigger lazy images
                for _ in range(3):
                    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    await page.wait_for_timeout(800)

                # Pull this post's images
                post_images = image_buckets.get(post_id, {})
                saved = 0
                local_paths = []
                for img_url, body in list(post_images.items())[:MAX_IMAGES_PER_POST]:
                    # Clean URL to use as filename
                    fname_idx = post_id + "_" + str(saved).zfill(3)
                    fname = images_dir / f"{fname_idx}.jpg"
                    fname.write_bytes(body)
                    rel = fname.relative_to(EXPORT_ROOT)
                    local_paths.append(str(rel))
                    saved += 1

                posts_data.append({
                    "id": post_id,
                    "type": kind,
                    "url": permalink,
                    "caption": caption[:1000],
                    "image_count": len(post_images),
                    "local_files": local_paths,
                })
                print(f"got {saved} img(s) (captured {len(post_images)} total)")
            except Exception as e:
                print(f"err: {e}")
                posts_data.append({"id": post_id, "type": kind, "url": url, "error": str(e)})

        # === Write outputs ===
        (out_dir / "posts.json").write_text(json.dumps(posts_data, indent=2))
        (out_dir / "captions.txt").write_text(
            "\n\n".join(f"--- {p.get('id')} ({p.get('type', '?')}) ---\n{p.get('caption', '')}" for p in posts_data)
        )

        # Copy profile images (og:image was captured at step 1)
        profile_images = image_buckets.get("__profile__", {})
        for img_url, body in list(profile_images.items())[:3]:
            fname = images_dir / f"profile_{re.sub(r'[^A-Za-z0-9_-]', '_', img_url[:30])}.jpg"
            fname.write_bytes(body)

        await browser.close()

    # === Summary ===
    total_imgs = sum(len(v) for v in image_buckets.values())
    posts_with_imgs = [p for p in posts_data if p.get("local_files")]
    print(f"\n=== DONE ===")
    print(f"profile: {profile.get('display_name', USERNAME)}")
    print(f"posts visited: {len(posts_data)}")
    print(f"posts with images: {len(posts_with_imgs)}/{len(posts_data)}")
    print(f"total images intercepted: {total_imgs}")
    print(f"output: {out_dir}")
    print(f"\nNext: hand-pick 6-8 best from {images_dir} and copy to public/images/portfolio/isiah/")


if __name__ == "__main__":
    asyncio.run(main())
