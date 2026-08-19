#!/usr/bin/env python3
"""
Instagram scraper for bleeding-ink-tattoo-web (CLI).

USAGE
=====
    python scripts/ig_scrape.py
    python scripts/ig_scrape.py --username courtneyfetzer --max-posts 12
    python scripts/ig_scrape.py --cookies-file path/to/cookies.json

Cookies are loaded from (in order):
    1. --cookies-file argument (if given)
    2. scripts/cookies/active.json

Outputs go to scripts/.ig_export/<username>/<timestamp>/ with
posts.json, captions.txt, profile.json, and a posts/ directory of images.

This is a thin CLI. All real work is in scripts/lib/.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import datetime
from pathlib import Path

# Allow imports from scripts/lib when run from project root
SCRIPTS_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPTS_DIR))
from lib.ig_auth import load_cookies, CookieError  # noqa: E402
from lib.ig_scrape import scrape_profile, MIN_IMAGE_BYTES  # noqa: E402

DEFAULT_COOKIE_PATH = SCRIPTS_DIR / "cookies" / "active.json"
DEFAULT_EXPORT_ROOT = SCRIPTS_DIR / ".ig_export"


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="IG scraper for bleeding-ink-tattoo-web")
    p.add_argument("--username", default="ibleedink_600",
                   help="IG handle (without @). Default: ibleedink_600")
    p.add_argument("--cookies-file", type=Path, default=None,
                   help=f"Path to cookie JSON. Default: {DEFAULT_COOKIE_PATH}")
    p.add_argument("--max-posts", type=int, default=24,
                   help="Hard cap on posts to visit. Default: 24")
    p.add_argument("--output-dir", type=Path, default=DEFAULT_EXPORT_ROOT,
                   help="Where to write the export. Default: scripts/.ig_export/")
    p.add_argument("--headless", action="store_true", default=True,
                   help="Run headless (default). Pass --no-headless to see the browser.")
    p.add_argument("--no-headless", dest="headless", action="store_false",
                   help="Disable headless mode (for debugging)")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    cookie_path = args.cookies_file or DEFAULT_COOKIE_PATH

    # Load + validate cookies
    try:
        storage_state = load_cookies(cookie_path)
    except CookieError as e:
        print(f"!! {e}")
        return 1
    cookie_count = len(storage_state["cookies"])
    print(f"loaded {cookie_count} cookies from {cookie_path.name}")

    # Setup output dir
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = args.output_dir / args.username / timestamp
    images_dir = out_dir / "posts"
    images_dir.mkdir(parents=True, exist_ok=True)
    print(f"[{timestamp}] starting scrape of @{args.username}")
    print(f"  output: {out_dir}")

    # Counters for streaming output
    total_images = 0

    async def on_image(url: str, body: bytes) -> None:
        nonlocal total_images
        total_images += 1

    # Run the scrape
    try:
        result = asyncio.run(scrape_profile(
            storage_state,
            args.username,
            max_posts=args.max_posts,
            headless=args.headless,
            on_image=on_image,
        ))
    except Exception as e:
        print(f"!! scrape failed: {e}")
        return 1

    # Persist per-post data
    posts_data = []
    for post in result.posts:
        local_files = []
        for url, body in post.images.items():
            # Derive filename from URL hash (collision-safe, deterministic)
            import hashlib
            h = hashlib.md5(url.encode()).hexdigest()[:8]
            fname = images_dir / f"{post.id}_{h}.jpg"
            fname.write_bytes(body)
            local_files.append(str(fname.relative_to(out_dir.parent)))
        posts_data.append({
            "id": post.id,
            "type": post.kind,
            "url": post.url,
            "caption": post.caption[:1000],
            "image_count": len(post.images),
            "local_files": local_files,
        })

    # Write outputs
    (out_dir / "posts.json").write_text(json.dumps(posts_data, indent=2))
    (out_dir / "captions.txt").write_text(
        "\n\n".join(f"--- {p['id']} ({p['type']}) ---\n{p['caption']}" for p in posts_data)
    )
    profile_json = {
        "username": result.username,
        "display_name": result.display_name,
        "profile_pic_url": result.profile_pic_url,
        "scraped_at": timestamp,
    }
    (out_dir / "profile.json").write_text(json.dumps(profile_json, indent=2))

    # Summary
    ok = sum(1 for p in posts_data if p["image_count"] > 0)
    print(f"\n=== DONE ===")
    print(f"profile: {result.display_name}")
    print(f"posts visited: {len(posts_data)}")
    print(f"posts with images: {ok}/{len(posts_data)}")
    print(f"total images captured: {total_images}")
    print(f"output: {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
