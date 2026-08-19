#!/usr/bin/env python3
"""
Portfolio updater for bleeding-ink-tattoo-web (thin wrapper).

Uses the project-agnostic scrape library for the actual browser automation,
then applies IG-specific data mapping (reel URL -> portfolio piece).

USAGE
=====
    python scripts/update_portfolio.py --artist isiah-jackson
    python scripts/update_portfolio.py --artist isiah-jackson --dry-run
    python scripts/update_portfolio.py --artist isiah-jackson --cookies cookies/x.json
    python scripts/update_portfolio.py --artist isiah-jackson --no-headless
"""

from __future__ import annotations
import argparse
import asyncio
import json
import re
import sys
from datetime import datetime
from pathlib import Path

# Make the library importable
sys.path.insert(0, "C:/Users/bbask/Hermes-Workspace/scripts")

from scrape.models import ScrapeResult, ImageRef  # noqa: E402


PROJECT = Path(__file__).resolve().parents[1]
DATA_FILE = PROJECT / "src" / "data" / "portfolio.ts"
IMAGES_DIR = PROJECT / "public" / "images" / "portfolio"

# Artist slug -> {IG username, portfolio directory name}
ARTISTS = {
    "isiah-jackson":   {"username": "ibleedink_600",   "slug": "isiah"},
    "courtney-fetzer": {"username": "courtneyfetzer", "slug": "courtney"},
}


def slugify(text: str, max_len: int = 50) -> str:
    s = re.sub(r"[^a-zA-Z0-9._-]+", "-", text).strip("-").lower()
    return s[:max_len] or "untitled"


def extract_reel_links(html: str) -> list[str]:
    """Pull post links from IG profile HTML (relative or absolute)."""
    out = []
    for shortcode in re.findall(r"/(?:p|reel|reels)/([A-Za-z0-9_-]+)", html):
        full = f"https://www.instagram.com/reel/{shortcode}/"
        if full not in out:
            out.append(full)
    return out


def parse_posts_data(html: str, post_links: list[str]) -> list[dict]:
    """
    Minimal post parser - extracts (shortcode, og:description) per link.

    IG serves each post's metadata in the HTML response. For reels, the
    og:description is the caption. We don't try to parse full JSON here.
    """
    posts = []
    for url in post_links:
        m = re.search(r"/(?:p|reel|reels)/([A-Za-z0-9_-]+)", url)
        if not m:
            continue
        shortcode = m.group(1)
        # caption appears in og:description meta tag (one per page)
        desc_match = re.search(
            r'<meta\s+property="og:description"\s+content="([^"]+)"', html
        )
        caption = desc_match.group(1) if desc_match else ""
        posts.append({"id": shortcode, "type": "reel" if "/reel" in url else "post",
                       "url": url, "caption": caption[:500]})
    return posts


def pick_main_image(posts_data: list[dict]) -> dict[str, list[ImageRef]]:
    """
    Decide which image(s) per post should make it into the portfolio.

    For each post: use the post's og:image if present, else pick the largest
    captured image by size. We don't try to deduplicate per-post images because
    IG's lazy-load captures many thumbnails; the og:image is the canonical pick.
    """
    selected = {}
    for p in posts_data:
        # No og:image from posts_data (would need per-post fetch); placeholder
        selected[p["id"]] = []  # populated from captured bytes during scrape
    return selected


# ============================================================================
# Thin scrape runner using the library
# ============================================================================

async def scrape_artist(username: str, *, max_posts: int, cookies_path: Path | None,
                        headless: bool = True, artist_slug: str) -> dict:
    """
    Use the playwright provider to scrape IG profile + post pages.
    Returns: {profile_meta, posts_data, captured_images}
    """
    from scrape.providers.playwright import fetch
    from scrape.providers.cookies import load_cookies, CookieError

    storage = None
    if cookies_path is not None:
        try:
            storage = load_cookies(cookies_path, require_sessionid=True)
        except CookieError as e:
            return {"error": str(e)}

    profile_url = f"https://www.instagram.com/{username}/"
    print(f"\nscraping @{username} (max {max_posts} posts)...")

    # Use the library's fetch() which already does:
    #   - load profile (with scroll to load all posts)
    #   - capture all images via network interception
    #   - extract captions from og:description meta
    #
    # We do an additional pass: open each post link to capture the og:image.
    # That pass uses our own playwright context (sharing the storage_state).
    from playwright.async_api import async_playwright

    captured = {}  # shortcode -> {url -> bytes}
    posts = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=headless,
            args=["--no-blink-features=AutomationControlled"],
        )
        ctx_args = {"user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
        if storage:
            ctx_args["storage_state"] = storage
        ctx = await browser.new_context(**ctx_args)

        # 1. Profile pass
        page = await ctx.new_page()
        profile_html = ""
        async def handle(r):
            url = r.url
            if "scontent" in url and ".jpg" in url:
                try:
                    body = await r.body()
                    if len(body) > 30_000:
                        # No shortcode context - just stash all
                        captured.setdefault("__profile__", {})[url] = body
                except Exception:
                    pass
        page.on("response", lambda r: asyncio.create_task(handle(r)))
        try:
            await page.goto(profile_url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(2000)
            for _ in range(3):
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await page.wait_for_timeout(1500)
            profile_html = await page.content()
            post_links = extract_reel_links(profile_html)
            post_links = post_links[:max_posts]
            print(f"  found {len(post_links)} posts")
        except Exception as e:
            print(f"  !! profile fetch failed: {e}")
            await browser.close()
            return {"error": str(e)}

        # 2. Per-post pass: capture og:image
        for url in post_links:
            shortcode = url.rstrip("/").split("/")[-1]
            try:
                async def handle_post(r, sc=shortcode):
                    url2 = r.url
                    if "scontent" in url2 and ".jpg" in url2:
                        try:
                            body = await r.body()
                            if len(body) > 30_000:
                                captured.setdefault(sc, {})[url2] = body
                        except Exception:
                            pass
                page.on("response", lambda r, sc=shortcode: asyncio.create_task(handle_post(r, sc)))
                await page.goto(url, wait_until="domcontentloaded", timeout=20000)
                await page.wait_for_timeout(2500)
                page.remove_listener("response", handle_post)
            except Exception as e:
                print(f"  !! {shortcode} failed: {e}")

        await browser.close()

    posts_data = parse_posts_data(profile_html, post_links)
    return {"profile_html": profile_html, "posts": posts_data, "captured": captured}


def main():
    ap = argparse.ArgumentParser(description="Update portfolio from IG")
    ap.add_argument("--artist", required=True, choices=list(ARTISTS),
                    help="Artist slug")
    ap.add_argument("--max-posts", type=int, default=24)
    ap.add_argument("--cookies", help="Cookie JSON path (default: scripts/cookies/active.json)")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--commit", action="store_true",
                    help="Git-commit the new portfolio changes (default: just stage)")
    ap.add_argument("--headless", action="store_true", default=True)
    ap.add_argument("--no-headless", dest="headless", action="store_false")
    args = ap.parse_args()

    if args.artist not in ARTISTS:
        print(f"!! unknown artist: {args.artist}\n   valid: {list(ARTISTS)}")
        return 1

    artist = ARTISTS[args.artist]
    cookies_path = Path(args.cookies).resolve() if args.cookies else \
        (PROJECT / "scripts" / "cookies" / "active.json")

    if not cookies_path.exists():
        print(f"!! no cookies at {cookies_path}. Export from Chrome first.")
        return 1

    result = asyncio.run(scrape_artist(
        artist["username"],
        max_posts=args.max_posts,
        cookies_path=cookies_path,
        headless=args.headless,
        artist_slug=artist["slug"],
    ))
    if "error" in result:
        print(f"!! scrape failed: {result['error']}")
        return 1

    posts = result["posts"]
    captured = result["captured"]
    print(f"\nposts scraped: {len(posts)}")
    print(f"unique images captured: {sum(len(v) for v in captured.values())}")

    # Filter to "real" images (>= 100KB)
    REAL_MIN = 100_000
    real_images = {}
    for sc, by_url in captured.items():
        big = [(u, b) for u, b in by_url.items() if len(b) >= REAL_MIN]
        if big:
            # Pick the LARGEST image per post (most likely the canonical frame)
            best = max(big, key=lambda kv: len(kv[1]))
            real_images[sc] = best

    print(f"posts with at least one >=100KB image: {len(real_images)}")
    if args.dry_run:
        print("\ndry-run: would add these images to public/images/portfolio/")
        for sc, (url, body) in list(real_images.items())[:5]:
            print(f"  - {sc}: {url[:60]} ({len(body)} bytes)")
        if len(real_images) > 5:
            print(f"  ... +{len(real_images)-5} more")
        return 0

    # Write images + update portfolio data
    img_dir = IMAGES_DIR / artist["slug"]
    img_dir.mkdir(parents=True, exist_ok=True)
    new_entries = []
    for sc, (url, body) in real_images.items():
        filename = f"{artist['slug']}-{sc}-{datetime.now().strftime('%Y%m%d')}.jpg"
        path = img_dir / filename
        path.write_bytes(body)
        new_entries.append({"id": sc, "filename": filename, "size": len(body)})

    print(f"\nwritten {len(new_entries)} images to {img_dir}/")

    # Patch portfolio data file (lightweight, project-specific mapping)
    if DATA_FILE.exists():
        text = DATA_FILE.read_text(encoding="utf-8")
        added = 0
        for entry in new_entries:
            # Add a stub piece if not already present
            piece_id = f"ig-{entry['id']}"
            if piece_id not in text:
                insertion = (
                    f"  {{\n"
                    f"    id: \"{piece_id}\",\n"
                    f"    title: \"Untitled Reel\",\n"
                    f"    style: \"Blackwork\",\n"
                    f"    artist: \"{args.artist}\",\n"
                    f"    description: \"Auto-imported from IG @{artist['username']} on "
                    f"{datetime.now().strftime('%Y-%m-%d')}.\",\n"
                    f"    placement: \"Forearm\",\n"
                    f"    sizeInches: \"5x7\",\n"
                    f"    imageUrl: \"/images/portfolio/{artist['slug']}/{entry['filename']}\",\n"
                    f"    svgStyle: \"skull\",\n"
                    f"    accent: \"#8B0000\",\n"
                    f"  }},\n"
                )
                # Insert before the closing ];
                text = text.replace("\n];", insertion + "\n];", 1)
                added += 1
        if added:
            DATA_FILE.write_text(text, encoding="utf-8")
            print(f"updated {DATA_FILE.name}: added {added} portfolio entries")

    # Git stage
    if args.commit:
        import subprocess
        subprocess.run(["git", "add", "."], cwd=PROJECT)
        subprocess.run(["git", "commit", "-m",
                        f"feat(portfolio): auto-add {len(new_entries)} IG photos ({args.artist})"],
                       cwd=PROJECT)
        print("committed")
    else:
        print("\nNext: review changes + commit when ready:")
        print(f"  cd {PROJECT}")
        print(f"  git add . && git commit -m 'feat(portfolio): add {len(new_entries)} IG photos'")
    return 0


if __name__ == "__main__":
    sys.exit(main())
