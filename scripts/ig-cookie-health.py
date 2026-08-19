#!/usr/bin/env python3
"""
Daily IG cookie health check for bleeding-ink-tattoo-web.

Reads scripts/cookies/active.json, reports:
  - Cookie age (days until sessionid expires)
  - Validity (is the cookie JSON still well-formed)
  - Last successful scrape timestamp (from scripts/.ig_export/)

Intended to run daily via Hermes cron. Exit code reflects severity:
  0  - healthy (cookies > 21 days remaining, no recent errors)
  1  - warning (cookies 0-21 days remaining, or no scrape in 14+ days)
  2  - critical (cookies expired or missing)

Designed to be called by cron and routed to Telegram via 1mcp canary infra.
"""

from __future__ import annotations

import json
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
)

COOKIE_PATH = SCRIPTS_DIR / "cookies" / "active.json"
EXPORT_ROOT = SCRIPTS_DIR / ".ig_export"
PROVENANCE_ROOT = SCRIPTS_DIR.parent / "public" / "images" / "portfolio"


def last_scrape_age_days() -> float | None:
    """Return age in days of the most recent scrape output, or None if no scrape ever."""
    if not EXPORT_ROOT.exists():
        return None
    timestamps = []
    for artist_dir in EXPORT_ROOT.iterdir():
        if not artist_dir.is_dir():
            continue
        for stamp_dir in artist_dir.iterdir():
            if stamp_dir.is_dir() and stamp_dir.name[:8].isdigit():
                timestamps.append(stamp_dir.stat().st_mtime)
    if not timestamps:
        return None
    latest = max(timestamps)
    age_sec = datetime.now().timestamp() - latest
    return round(age_sec / 86400, 1)


def main() -> int:
    if not COOKIE_PATH.exists():
        print("CRITICAL: no active cookies at scripts/cookies/active.json")
        print("  action: export cookies from Chrome Cookie-Editor, save there, "
              "then run scripts/cookie_refresh.py")
        return 2

    # Load + compute age
    try:
        storage = load_cookies(COOKIE_PATH)
        cookie_count = len(storage["cookies"])
    except CookieError as e:
        print(f"CRITICAL: cookie file is malformed: {e}")
        return 2

    raw = json.loads(COOKIE_PATH.read_text())
    age = cookie_days_remaining(raw)
    status, emoji = status_label(age)

    scrape_age = last_scrape_age_days()
    print(f"=== IG cookie health ({datetime.now().strftime('%Y-%m-%d %H:%M')}) ===")
    print(f"cookies: {cookie_count} loaded, age {age} days ({emoji} {status})")
    print(f"last scrape: {scrape_age} days ago" if scrape_age is not None else "last scrape: never")

    # Decide severity
    if age is None:
        print(f"WARN: could not compute cookie age")
        return 1
    if age <= 0:
        print(f"CRITICAL: cookies are expired")
        return 2
    if age <= 21:
        print(f"WARN: cookies expire in {int(age)} days — refresh soon")
        return 1
    if scrape_age is not None and scrape_age > 14:
        print(f"WARN: portfolio may be stale (no scrape in {int(scrape_age)} days)")
        return 1
    print(f"OK: all systems normal")
    return 0


if __name__ == "__main__":
    sys.exit(main())
