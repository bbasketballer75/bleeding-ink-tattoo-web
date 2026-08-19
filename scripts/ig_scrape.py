#!/usr/bin/env python3
"""
ig_scrape.py - thin backward-compatible wrapper.

Older versions of bleeding-ink-tattoo-web's IG scrape workflow expected
this file to exist at scripts/ig_scrape.py with a specific CLI. That logic
moved to scripts/update_portfolio.py (which is what `cookie_refresh.py`
prints as the "next step").

This thin shim calls the new orchestrator with the matching flags so any
cron job or scheduled task pointing at ig_scrape.py keeps working.

USAGE (legacy)
=============
  python scripts/ig_scrape.py    # equivalent to update_portfolio.py
"""

from __future__ import annotations
import sys
from pathlib import Path

# Delegate to the new orchestrator
sys.path.insert(0, str(Path(__file__).resolve().parent))
import update_portfolio  # noqa: E402


if __name__ == "__main__":
    # Map legacy flags to new ones. Currently no flags = use defaults.
    sys.argv = [sys.argv[0], "--artist", "isiah-jackson", "--dry-run"]
    sys.exit(update_portfolio.main())
