#!/usr/bin/env python3
"""
Cookie refresh utility for bleeding-ink-tattoo-web.

Validates a new IG cookie export, archives the current active.json, and
replaces active.json with the new cookies. Prints a status summary.

This is a project-specific wrapper around the project-agnostic
`scrape.providers.cookies` library.
"""

from __future__ import annotations
import argparse
import shutil
import sys
from datetime import datetime
from pathlib import Path

# Make the library importable
SCRAPE_LIB = Path(__file__).resolve().parents[2] / "hermes-workspace" / "scripts"
SCRAPE_LIB_ALT = Path("C:/Users/bbask/Hermes-Workspace/scripts")
if SCRAPE_LIB_ALT.exists():
    sys.path.insert(0, str(SCRAPE_LIB_ALT))

from scrape.providers.cookies import (  # noqa: E402
    load_cookies, summarize, CookieError,
    cookie_days_remaining, status_label,
)


COOKIES_DIR = Path(__file__).resolve().parent / "cookies"
ACTIVE = COOKIES_DIR / "active.json"
ARCHIVE = COOKIES_DIR / "archive"


def find_newest_unactivated() -> Path | None:
    """Find the most recently modified file in cookies/ that ISN'T active.json or in archive/."""
    candidates = []
    for p in COOKIES_DIR.glob("*.json"):
        if p.name == "active.json":
            continue
        if p.parent.name == "archive":
            continue
        candidates.append(p)
    if not candidates:
        return None
    return max(candidates, key=lambda p: p.stat().st_mtime)


def main():
    ap = argparse.ArgumentParser(description="Refresh the active IG cookies.")
    ap.add_argument("--path", help="Path to new cookie JSON. If omitted, uses the most "
                                  "recent file in cookies/ that isn't active.json.")
    ap.add_argument("--validate-only", action="store_true",
                    help="Just validate the new cookies, don't replace anything.")
    ap.add_argument("--dry-run", action="store_true",
                    help="Show what would happen without making changes.")
    args = ap.parse_args()

    # Locate source
    src = Path(args.path).resolve() if args.path else find_newest_unactivated()
    if src is None or not src.exists():
        print(f"!! no new cookie file found in {COOKIES_DIR}. "
              "Drop the exported cookies JSON here and re-run.")
        return 1

    # Validate (raises CookieError if bad)
    print(f"source: {src}")
    try:
        storage = load_cookies(src)
    except CookieError as e:
        print(f"!! invalid cookie file: {e}")
        return 1

    cookies = storage["cookies"]
    days = cookie_days_remaining(cookies)
    status, emoji = status_label(days)
    print(f"validation: {emoji} {len(cookies)} cookies parsed OK")
    print(f"days remaining: {days} ({emoji} {status})")
    if days is not None and days <= 0:
        print(f"!! cookies are EXPIRED. Don't bother activating; re-export.")

    # Show what would happen
    if ACTIVE.exists():
        try:
            existing = summarize(ACTIVE)
            print(f"\ncurrent active.json: {existing['count']} cookies, "
                  f"{existing['days_remaining']} days remaining "
                  f"({existing['emoji']} {existing['status']})")
        except CookieError as e:
            print(f"\n!! existing active.json is corrupt: {e}")

    if args.validate_only:
        print("\nvalidate-only: cookies look good. Run without --validate-only to activate.")
        return 0

    if args.dry_run:
        print(f"\ndry-run: would activate {src} -> {ACTIVE}")
        return 0

    # Archive existing active.json
    if ACTIVE.exists():
        ARCHIVE.mkdir(exist_ok=True)
        ts = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        archived = ARCHIVE / f"{ts}.json"
        shutil.copy2(ACTIVE, archived)
        print(f"archived: {archived}")

    # Activate new cookies
    shutil.copy2(src, ACTIVE)
    print(f"activated: {ACTIVE}")

    # Summary
    print(f"\n=== SUMMARY ===")
    print(f"new cookies: {src.name}")
    print(f"days remaining: {days} ({emoji} {status})")
    if days is not None and days <= 7:
        print(f"alert: refresh in {int(days)} days (or sooner)")
    print(f"\nNext step: python scripts/update_portfolio.py --artist isiah-jackson")
    return 0


if __name__ == "__main__":
    sys.exit(main())
