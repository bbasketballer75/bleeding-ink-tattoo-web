"""Reusable helpers for the bleeding-ink-tattoo-web IG scraper.

Each module is a thin wrapper around third-party APIs that the scripts in
`scripts/` use. Kept tiny on purpose — the orchestration lives in the
scripts themselves so the import graph is shallow.

Import from anywhere:
    from scripts.lib.ig_auth import load_cookies, whoami
"""

__all__ = ["ig_auth", "ig_scrape"]
