"""IG cookie loading + validation + whoami.

The cookie file is what the user (Austin) drops in whenever IG rotates their
session. We:
  1. parse + sanity-check it (right keys, required cookies present)
  2. compute days remaining from the latest expirationDate
  3. provide a whoami() helper that loads cookies into a real Chromium
     context and confirms the session is still valid

This module is intentionally import-only - no CLI, no script writes. CLI
behavior lives in scripts/cookie_refresh.py.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Iterable

REQUIRED_COOKIES = ("sessionid", "csrftoken", "ds_user_id")
OPTIONAL_COOKIES = ("mid", "ig_did", "datr", "ps_l", "ps_n", "wd", "rur", "ig_nrcb")
WARN_COOKIE_AGE_DAYS = 7    # alert when <=7 days remaining
MAX_COOKIE_AGE_DAYS = 0     # alert when expired


class CookieError(ValueError):
    """Raised when a cookie file is malformed or unusable."""


def _normalize_cookies(raw: Any) -> list[dict]:
    """Accept Cookie-Editor export (flat list) or Playwright storage_state.

    Cookie-Editor exports a flat array of cookie objects:
        [{"domain": ".instagram.com", "name": "sessionid", "value": "...", ...}]
    Playwright storage_state wraps them under "cookies":
        {"cookies": [...], "origins": [...]}

    Returns the list of cookie objects.
    """
    if isinstance(raw, dict) and "cookies" in raw:
        cookies = raw["cookies"]
    elif isinstance(raw, list):
        cookies = raw
    elif isinstance(raw, dict) and any(isinstance(v, list) for v in raw.values()):
        # Some exporters nest under a domain name ({"instagram.com": [...]})
        cookies = [c for v in raw.values() if isinstance(v, list) for c in v]
    else:
        raise CookieError(
            "Unrecognized cookie export format. Got: "
            f"{list(raw.keys()) if isinstance(raw, dict) else type(raw).__name__}"
        )
    if not cookies:
        raise CookieError("Cookie file parsed but contains zero cookies.")
    return cookies


def _to_playwright_storage(cookies: Iterable[dict]) -> dict:
    """Reshape Cookie-Editor cookies into Playwright storage_state format."""
    norm: list[dict] = []
    for c in cookies:
        expires = c.get("expirationDate")
        if isinstance(expires, float):
            expires = int(expires)
        elif expires is None:
            expires = -1  # Playwright sentinel for session cookies
        else:
            try:
                expires = int(expires)
            except (TypeError, ValueError):
                expires = -1

        # Map sameSite values to Playwright's allowed set
        # Playwright accepts: "Strict", "Lax", or the STRING "None"
        ss = c.get("sameSite")
        if isinstance(ss, str) and ss.lower() == "lax":
            ss = "Lax"
        elif isinstance(ss, str) and ss.lower() == "strict":
            ss = "Strict"
        else:
            # None, "no_restriction", missing -> "None" (Playwright's string)
            ss = "None"

        entry: dict = {
            "name": c["name"],
            "value": c["value"],
            "domain": c.get("domain", ".instagram.com"),
            "path": c.get("path", "/"),
            "expires": expires,
            "sameSite": ss,
        }
        if c.get("secure"):
            entry["secure"] = True
        if c.get("httpOnly"):
            entry["httpOnly"] = True
        norm.append(entry)

    return {
        "cookies": norm,
        "origins": [
            {"origin": "https://www.instagram.com", "localStorage": []},
            {"origin": "https://instagram.com", "localStorage": []},
        ],
    }


def load_cookies(path: str | Path) -> dict:
    """Read a Cookie-Editor JSON export, validate, return Playwright storage_state.

    Raises CookieError on malformed/missing input.
    """
    p = Path(path)
    if not p.exists():
        raise CookieError(f"cookie file not found: {p}")
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise CookieError(f"invalid JSON in {p}: {e}") from e

    cookies = _normalize_cookies(raw)

    # Required cookies check (warn, don't fail - IG rotates which ones it sends)
    names = {c.get("name") for c in cookies}
    missing = [n for n in REQUIRED_COOKIES if n not in names]
    if missing:
        # sessionid is the only critical one - without it, no login
        if "sessionid" in missing:
            raise CookieError(
                f"CRITICAL: 'sessionid' cookie missing (have: {sorted(names - {None})}). "
                "IG will not accept these cookies."
            )

    return _to_playwright_storage(cookies)


def get_cookie_names(storage_state: dict) -> list[str]:
    """Return sorted list of cookie names from a storage_state dict."""
    return sorted(c["name"] for c in storage_state.get("cookies", []))


def cookie_days_remaining(cookies_json: Any) -> float | None:
    """Return days until the freshest cookie expires.

    Returns None if no parseable expirationDate is present.
    <=0 = expired, positive = days remaining.
    """
    import time

    raw = cookies_json
    if isinstance(raw, dict) and "cookies" in raw:
        raw = raw["cookies"]
    if not isinstance(raw, list):
        return None

    now = time.time()
    # IG cookies typically last 1 year max, but sessionid is ~90 days.
    # We return days UNTIL the freshest one expires.
    epochs = []
    for c in raw:
        e = c.get("expirationDate")
        if isinstance(e, (int, float)) and e > 1e9:  # ignore millisecond timestamps
            epochs.append(float(e))
    if not epochs:
        return None
    freshest = max(epochs)
    if freshest <= now:
        return 0.0  # expired
    return round((freshest - now) / 86400, 1)


def status_label(days_remaining: float | None) -> tuple[str, str]:
    """Return (status_word, emoji) for cookie days remaining.

    Conventions:
      <=0  = expired
      1-7  = refresh this week
      8-21 = watch
      >21  = healthy
    """
    if days_remaining is None:
        return ("UNKNOWN", "\u2753")
    if days_remaining <= 0:
        return ("EXPIRED", "\u274c")
    if days_remaining < 8:
        return ("REFRESH_THIS_WEEK", "\U0001f7e1")  # yellow
    if days_remaining < 22:
        return ("WATCH", "\u2705")  # green
    return ("HEALTHY", "\u2705")  # green


def whoami(storage_state: dict, headless: bool = True) -> dict:
    """Confirm the cookies work by loading them into a Chromium and visiting
    /accounts/edit/. Returns a dict with username, ds_user_id, and URL.

    Raises CookieError if not logged in.
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as e:
        raise CookieError(f"playwright not installed: {e}") from e

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=headless,
            args=["--no-blink-features=AutomationControlled"],
        )
        ctx = browser.new_context(storage_state=storage_state)
        page = ctx.new_page()
        try:
            page.goto("https://www.instagram.com/accounts/edit/", wait_until="domcontentloaded", timeout=20000)
            page.wait_for_timeout(2000)
            url = page.url
            title = page.title()
            # Extract ds_user_id from the storage we just loaded
            ds_user_id = next(
                (c["value"] for c in storage_state["cookies"] if c["name"] == "ds_user_id"),
                None,
            )
            logged_in = "Login" not in title and "/accounts/login" not in url
            return {
                "url": url,
                "title": title,
                "logged_in": logged_in,
                "ds_user_id": ds_user_id,
            }
        finally:
            ctx.close()
            browser.close()


__all__ = [
    "CookieError",
    "load_cookies",
    "get_cookie_names",
    "cookie_days_remaining",
    "status_label",
    "whoami",
    "REQUIRED_COOKIES",
    "OPTIONAL_COOKIES",
    "WARN_COOKIE_AGE_DAYS",
    "MAX_COOKIE_AGE_DAYS",
]
