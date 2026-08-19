#!/usr/bin/env python3
"""
Daily IG cookie health check for bleeding-ink-tattoo-web.

Thin wrapper around the project-agnostic scrape library. Reads
scripts/cookies/active.json, reports cookie age + last-scrape freshness.

Exits non-zero if cookies are EXPIRED or if no active cookies are present.
"""

from __future__ import annotations
import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, "C:/Users/bbask/Hermes-Workspace/scripts")

from scrape.providers.cookies import (  # noqa: E402
    load_cookies, CookieError,
    cookie_days_remaining, status_label,
)


COOKIES_PATH = Path(__file__).resolve().parent / "cookies" / "active.json"
LAST_SCRAPE_LOG = Path(__file__).resolve().parent / "cookies" / ".last_scrape"


def main():
    print(f"=== IG cookie health ({datetime.now().isoformat(timespec='seconds')}) ===")

    if not COOKIES_PATH.exists():
        print(f"CRITICAL: no active cookies at {COOKIES_PATH}")
        print(f"  action: export cookies from Chrome Cookie-Editor, save there, "
              f"then run scripts/cookie_refresh.py")
        return 2

    try:
        storage = load_cookies(COOKIES_PATH)
    except CookieError as e:
        print(f"CRITICAL: active cookies are corrupt: {e}")
        return 2

    cookies = storage["cookies"]
    days = cookie_days_remaining(cookies)
    status, emoji = status_label(days)
    print(f"cookies: {len(cookies)} loaded, days remaining: {days} ({emoji} {status})")

    if LAST_SCRAPE_LOG.exists():
        try:
            mtime = datetime.fromtimestamp(LAST_SCRAPE_LOG.stat().st_mtime)
            age_days = (datetime.now() - mtime).total_seconds() / 86400
            print(f"last scrape: {age_days:.1f} days ago ({mtime.isoformat()})")
            if age_days > 14:
                print(f"  stale (>14d). Consider re-running update_portfolio.py")
        except Exception:
            pass
    else:
        print("last scrape: never (no .last_scrape file)")

    # Decide exit code
    if days is not None and days <= 0:
        print("\n!! cookies are EXPIRED. Refresh from Chrome.")
        return 2
    if status in ("REFRESH_THIS_WEEK", "WATCH"):
        print(f"\n!! {status} - cookies expire soon. Plan a refresh.")
        return 1
    print("\nOK: all systems normal")
    return 0


if __name__ == "__main__":
    sys.exit(main())
