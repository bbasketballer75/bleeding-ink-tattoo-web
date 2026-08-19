#!/usr/bin/env python3
"""
Cookie refresh utility for bleeding-ink-tattoo-web.

Validates a new IG cookie export, archives the current active.json, and
replaces active.json with the new cookies. Print a one-line status.

USAGE
=====
    python scripts/cookie_refresh.py
    python scripts/cookie_refresh.py --path /path/to/new_cookies.json
    python scripts/cookie_refresh.py --validate-only
    python scripts/cookie_refresh.py --dry-run

Exit codes:
    0  - success
    1  - invalid cookie file (parse error, missing sessionid, etc.)
    2  - cookie already expired
    3  - active.json not found (nothing to archive)
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from datetime import datetime
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPTS_DIR))
from lib.ig_auth import (  # noqa: E402
    load_cookies,
    cookie_days_remaining,
    status_label,
    CookieError,
    WARN_COOKIE_AGE_DAYS,
    MAX_COOKIE_AGE_DAYS,
)

COOKIES_DIR = SCRIPTS_DIR / "cookies"
ACTIVE = COOKIES_DIR / "active.json"
ARCHIVE = COOKIES_DIR / "archive"


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Refresh the active IG cookies")
    p.add_argument("--path", type=Path, default=None,
                   help="Path to new cookie JSON. If omitted, uses the most recent "
                        "file in scripts/cookies/ that isn't active.json")
    p.add_argument("--validate-only", action="store_true",
                   help="Just validate the new cookies, don't replace anything")
    p.add_argument("--dry-run", action="store_true",
                   help="Show what would happen without making changes")
    return p.parse_args()


def find_newest_cookie_file() -> Path:
    """Pick the newest .json file in cookies/ that isn't active.json."""
    candidates = [
        p for p in COOKIES_DIR.glob("*.json")
        if p.name != "active.json" and p.is_file()
    ]
    if not candidates:
        raise FileNotFoundError(
            f"no new cookie file found in {COOKIES_DIR}. "
            "Drop the exported cookies JSON here and re-run."
        )
    return max(candidates, key=lambda p: p.stat().st_mtime)


def archive_active() -> Path | None:
    """Move active.json into archive/<timestamp>.json. Returns the new path."""
    if not ACTIVE.exists():
        return None
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    dest = ARCHIVE / f"{stamp}.json"
    shutil.move(str(ACTIVE), str(dest))
    return dest


def main() -> int:
    args = parse_args()

    # Find the source file
    if args.path:
        src = args.path
    else:
        try:
            src = find_newest_cookie_file()
        except FileNotFoundError as e:
            print(f"!! {e}")
            return 1

    if not src.exists():
        print(f"!! file not found: {src}")
        return 1
    print(f"source: {src}")

    # Read raw JSON to compute age (load_cookies requires Playwright but we don't need it for validation)
    try:
        raw = json.loads(src.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"!! invalid JSON in {src}: {e}")
        return 1

    age = cookie_days_remaining(raw)
    status, emoji = status_label(age)
    print(f"cookie age: {age} days ({emoji} {status})")

    # Validate (uses lib.ig_auth.load_cookies for the full check)
    try:
        storage = load_cookies(src)
    except CookieError as e:
        print(f"!! {e}")
        return 1
    cookie_count = len(storage["cookies"])
    print(f"validation: {emoji} {cookie_count} cookies parsed OK")

    if age is not None and age <= 0:
        print(f"!! cookies are ALREADY EXPIRED (age: {age} days). "
              "Re-export from a logged-in Chrome session.")
        return 2

    if args.validate_only:
        print(f"validate-only: cookies look good. Run without --validate-only to activate.")
        return 0

    # Archive current active.json (if any)
    if ACTIVE.exists():
        if args.dry_run:
            print(f"dry-run: would archive {ACTIVE} -> archive/<timestamp>.json")
        else:
            archived = archive_active()
            print(f"archived: {archived.relative_to(SCRIPTS_DIR)}")
    else:
        print(f"no existing active.json to archive")

    # Move new cookies into place
    if args.dry_run:
        print(f"dry-run: would activate {src} -> {ACTIVE}")
    else:
        shutil.copy2(str(src), str(ACTIVE))
        print(f"activated: {ACTIVE.relative_to(SCRIPTS_DIR)}")

    # Summary
    print(f"\n=== SUMMARY ===")
    print(f"new cookies: {src.name}")
    print(f"age: {age} days ({emoji} {status})")
    if age is not None and age <= WARN_COOKIE_AGE_DAYS:
        next_warn = "today" if age <= MAX_COOKIE_AGE_DAYS else f"in {int(age)} days"
        print(f"alert: refresh {next_warn} (or sooner)")
    print(f"\nNext step: python scripts/update_portfolio.py --artist isiah-jackson")
    return 0


if __name__ == "__main__":
    sys.exit(main())
