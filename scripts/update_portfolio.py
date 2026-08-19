#!/usr/bin/env python3
"""
Portfolio updater for bleeding-ink-tattoo-web.

USAGE
=====
    python scripts/update_portfolio.py --artist isiah-jackson
    python scripts/update_portfolio.py --artist isiah-jackson --dry-run
    python scripts/update_portfolio.py --artist isiah-jackson --no-commit
    python scripts/update_portfolio.py --artist isiah-jackson --max-posts 12

What it does:
  1. Load cookies from scripts/cookies/active.json
  2. Run the scraper (scripts/lib/ig_scrape.py)
  3. For each post: dedupe by SHA-256 vs existing images in
     public/images/portfolio/<artist>/
  4. Pick the largest new image per post (proxy for "main" thumbnail)
  5. Copy with descriptive names (<artist>-<shortcode>-<YYYYMMDD>.jpg)
  6. Write a provenance.json with source URL + IG post ID + scrape timestamp
  7. Update src/data/portfolio.ts ONLY with new entries (preserves existing)
  8. Stage new images + portfolio changes (auto-commit if --commit)

By default, this script does NOT commit. Pass --commit to also git-commit.
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

# Allow imports from scripts/lib
SCRIPTS_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPTS_DIR))
from lib.ig_auth import load_cookies, CookieError  # noqa: E402
from lib.ig_scrape import scrape_profile  # noqa: E402

PROJECT_ROOT = SCRIPTS_DIR.parent
COOKIE_PATH = SCRIPTS_DIR / "cookies" / "active.json"
PUBLIC_IMAGES = PROJECT_ROOT / "public" / "images" / "portfolio"
PORTFOLIO_DATA = PROJECT_ROOT / "src" / "data" / "portfolio.ts"

# Image quality thresholds (Phase C.7 filter)
MIN_FILE_BYTES = 50_000        # skip UI thumbnails
PREFERRED_ASPECT_LOW = 0.65    # 3:4 portrait-ish
PREFERRED_ASPECT_HIGH = 0.85

# Mapping of artist slug -> IG username
ARTIST_IG_USERS = {
    "isiah-jackson": "ibleedink_600",
    "courtney-fetzer": "courtneyfetzer",
}


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Update portfolio from IG")
    p.add_argument("--artist", required=True,
                   help=f"Artist slug. One of: {list(ARTIST_IG_USERS.keys())}")
    p.add_argument("--max-posts", type=int, default=24,
                   help="Hard cap on posts to scrape. Default: 24")
    p.add_argument("--cookies-file", type=Path, default=COOKIE_PATH,
                   help="Path to cookie JSON. Default: scripts/cookies/active.json")
    p.add_argument("--dry-run", action="store_true",
                   help="Show what would change without writing anything")
    p.add_argument("--commit", action="store_true",
                   help="Git-commit the new portfolio changes (default: just stage)")
    p.add_argument("--headless", action="store_true", default=True,
                   help="Run headless (default)")
    p.add_argument("--no-headless", dest="headless", action="store_false",
                   help="Show the browser (for debug)")
    return p.parse_args()


def hash_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def pick_main_image(images: dict[str, bytes]) -> tuple[str, bytes] | None:
    """Pick the largest qualifying image from a post.

    Filter: > MIN_FILE_BYTES (skip UI assets).
    Prefer aspect ratio close to 3:4 (portrait, matches portfolio card aspect).
    Falls back to largest by file size.
    """
    candidates = [
        (url, body) for url, body in images.items()
        if len(body) >= MIN_FILE_BYTES
    ]
    if not candidates:
        return None

    # Score each: prefer portrait aspect, then by size
    def score(item):
        url, body = item
        # Try to extract dimensions from URL params
        # Format: .../<w>x<h>/... or _e35_<w>x<h>_
        m = re.search(r"(\d{3,4})x(\d{3,4})", url)
        if m:
            w, h = int(m.group(1)), int(m.group(2))
            aspect = h / w if w else 1
            # Higher score for portrait aspect (~0.75)
            aspect_score = 1 - abs(aspect - 0.75)
        else:
            aspect_score = 0
        return (aspect_score, len(body))

    candidates.sort(key=score, reverse=True)
    return candidates[0]


def load_existing_hashes(artist_dir: Path) -> set[str]:
    """Return SHA-256s of all images already in the artist's portfolio folder."""
    hashes = set()
    if not artist_dir.exists():
        return hashes
    for f in artist_dir.glob("*.jpg"):
        try:
            hashes.add(hash_bytes(f.read_bytes()))
        except Exception:
            pass
    return hashes


def parse_portfolio_ids(portfolio_path: Path) -> set[str]:
    """Return the set of `id:` values already in portfolio.ts."""
    if not portfolio_path.exists():
        return set()
    return set(re.findall(r'id:\s*"([^"]+)"', portfolio_path.read_text(encoding="utf-8")))


def git(*args: str, cwd: Path | None = None) -> tuple[int, str]:
    """Run a git command and return (returncode, stdout)."""
    cwd = cwd or PROJECT_ROOT
    result = subprocess.run(
        ["git", *args],
        cwd=str(cwd),
        capture_output=True,
        text=True,
    )
    return result.returncode, (result.stdout + result.stderr).strip()


def main() -> int:
    args = parse_args()

    if args.artist not in ARTIST_IG_USERS:
        print(f"!! unknown artist: {args.artist}")
        print(f"   valid options: {list(ARTIST_IG_USERS.keys())}")
        return 1
    username = ARTIST_IG_USERS[args.artist]

    # Load cookies
    try:
        storage_state = load_cookies(args.cookies_file)
    except CookieError as e:
        print(f"!! {e}")
        return 1
    print(f"loaded {len(storage_state['cookies'])} cookies")

    # Setup dirs
    artist_dir = PUBLIC_IMAGES / args.artist
    artist_dir.mkdir(parents=True, exist_ok=True)
    existing_hashes = load_existing_hashes(artist_dir)
    print(f"existing images: {len(existing_hashes)} (in {artist_dir.relative_to(PROJECT_ROOT)})")

    # Run scrape
    print(f"\nscraping @{username} (max {args.max_posts} posts)...")
    try:
        result = asyncio.run(scrape_profile(
            storage_state,
            username,
            max_posts=args.max_posts,
            headless=args.headless,
        ))
    except Exception as e:
        print(f"!! scrape failed: {e}")
        return 1

    # For each post: dedupe + pick main image
    new_images: list[tuple[str, Path]] = []   # (shortcode, image_path)
    provenance: list[dict] = []
    today = datetime.now(timezone.utc).strftime("%Y%m%d")

    for post in result.posts:
        picked = pick_main_image(post.images)
        if not picked:
            continue
        url, body = picked
        h = hash_bytes(body)
        if h in existing_hashes:
            continue
        existing_hashes.add(h)
        # Filename: isiah-jackson-DZ9OR_mtltO-20260819.jpg
        fname = artist_dir / f"{args.artist}-{post.id}-{today}.jpg"
        if not args.dry_run:
            fname.write_bytes(body)
        new_images.append((post.id, fname))
        provenance.append({
            "post_id": post.id,
            "post_url": post.url,
            "source_image_url": url,
            "sha256": h,
            "size_bytes": len(body),
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "local_path": str(fname.relative_to(PROJECT_ROOT)),
        })

    # Summary
    print(f"\n=== SUMMARY ===")
    print(f"posts scraped: {len(result.posts)}")
    print(f"new images to add: {len(new_images)}")
    for post_id, path in new_images:
        print(f"  + {path.relative_to(PROJECT_ROOT)} ({post_id})")

    if not new_images:
        print(f"\nportfolio is up-to-date. nothing to do.")
        return 0

    # Write provenance
    if not args.dry_run:
        prov_path = artist_dir / "provenance.json"
        existing_prov = []
        if prov_path.exists():
            try:
                existing_prov = json.loads(prov_path.read_text())
            except Exception:
                pass
        existing_prov.extend(provenance)
        prov_path.write_text(json.dumps(existing_prov, indent=2))
        print(f"updated provenance: {prov_path.relative_to(PROJECT_ROOT)}")

    # Update src/data/portfolio.ts — add new entries with imageUrl
    if not args.dry_run:
        existing_ids = parse_portfolio_ids(PORTFOLIO_DATA)
        new_entries = []
        for post_id, path in new_images:
            entry_id = f"isiah-{post_id.lower()}"
            if entry_id in existing_ids:
                continue
            # Look up caption from scraped post
            caption = ""
            for post in result.posts:
                if post.id == post_id:
                    caption = post.caption[:200]
                    break
            new_entries.append({
                "id": entry_id,
                "title": f"Isiah — {post_id}",
                "style": "Blackwork",  # default; refine manually later
                "artist": args.artist,
                "description": caption or f"From IG post {post_id} (auto-imported).",
                "placement": "Various",
                "sizeInches": "various",
                "imageUrl": f"/images/portfolio/{args.artist}/{path.name}",
                "svgStyle": "rose",
                "accent": "#8B0000",
            })
        if new_entries:
            # Append to portfolio.ts as TS object literals (simplest, valid)
            append_block = "\n\n// --- Auto-imported from IG scrape " + today + " ---\n"
            for e in new_entries:
                # Convert to TS syntax (quoted keys)
                lines = ["  {"]
                for k, v in e.items():
                    if isinstance(v, str):
                        lines.append(f'    {k}: "{v}",')
                    else:
                        lines.append(f'    {k}: {v},')
                lines.append("  },")
                append_block += "\n".join(lines) + "\n"
            existing = PORTFOLIO_DATA.read_text(encoding="utf-8")
            # Insert before the closing "];"
            new_content = existing.replace("];", append_block + "];", 1)
            PORTFOLIO_DATA.write_text(new_content, encoding="utf-8")
            print(f"updated portfolio data: {PORTFOLIO_DATA.relative_to(PROJECT_ROOT)}")

    if args.dry_run:
        print(f"\ndry-run: no files written, no git operations performed")
        return 0

    # Git stage + optionally commit
    print(f"\nstaging git changes...")
    rc, out = git("add", "public/images/portfolio/")
    print(f"  git add public: {out}")
    rc, out = git("add", "src/data/portfolio.ts")
    print(f"  git add portfolio.ts: {out}")

    rc, status = git("status", "--short")
    if not status:
        print(f"  nothing to stage (already up-to-date)")
        return 0

    if args.commit:
        commit_msg = (
            f"chore(portfolio): auto-update from IG scrape ({today})\n\n"
            f"- {len(new_images)} new images\n"
            f"- artist: {args.artist}\n"
            f"- cookie age: see scripts/cookies/active.json"
        )
        rc, out = git("commit", "-m", commit_msg)
        print(f"  git commit: {out}")
        print(f"\n(auto-commit done. you can review with `git show HEAD` then push.)")
    else:
        print(f"\nstaged but NOT committed. review with `git status` then:")
        print(f"  git commit -m 'chore(portfolio): auto-update from IG scrape'")

    return 0


if __name__ == "__main__":
    sys.exit(main())
