# IG Cookie Refresh Helper

Reduces the friction of refreshing Instagram session cookies from
"60 seconds of clicking + reading the guide" to "open the BAT, click
once, save once".

## What this is

Two thin wrappers around the existing cookie system:

| File | Purpose |
|------|---------|
| `refresh_ig_cookies.bat` | Windows desktop entry point - double-click to run |
| `watch_cookies_and_refresh.ps1` | PowerShell FileSystemWatcher that detects new cookie files |
| `refresh_ig_cookies_README.md` | This file |

The existing scripts (`cookie_refresh.py`, `ig-cookie-health.py`) are unchanged.
The watcher calls them; the BAT invokes the watcher.

## Setup (one-time, 2 minutes)

1. **Install Cookie-Editor** in Chrome (if not already installed):
   - [Cookie-Editor Chrome Web Store](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
   - This is the only extension the workflow requires.

2. **Create a desktop shortcut** to the BAT:
   - Right-click your desktop > New > Shortcut
   - Location: `C:\Users\bbask\Coding_Projects\bleeding-ink-tattoo-web\scripts\refresh_ig_cookies.bat`
   - Name: "Refresh IG Cookies" (or whatever you prefer)
   - Double-click to test.

   Optional: edit the shortcut icon (right-click > Properties > Change Icon)
   to something distinct (e.g. a refresh icon).

## Usage (every ~30 days)

1. **Double-click the desktop shortcut.**
2. **Wait for Chrome to load Instagram** (the script shows a checklist).
3. **Click the Cookie-Editor extension icon** in Chrome's toolbar.
4. **Click Export → Cookies (JSON)**.
5. **Save the file** in `C:\Users\bbausks\Coding_Projects\bleeding-ink-tattoo-web\scripts\cookies\`
   (the browser's save dialog should default to the last folder you saved in;
   navigate to `cookies/` if needed).
6. **Done.** The watcher detects the file, validates it, archives the old
   cookies, activates the new ones, runs a health check, and prints a
   summary. Total time after you click Save: ~3 seconds.

## What if I forgot to log into Instagram first?

The watcher doesn't check - it just validates the JSON shape. If you
exported cookies while NOT logged in, `sessionid` will be missing and
the watcher will tell you. Re-open Chrome, log into Instagram, then
re-export.

## What if Chrome isn't running?

The BAT doesn't auto-launch Chrome (that requires your login session).
It just shows a status table of any Chrome processes. If Chrome isn't
running, start it manually first, log into Instagram, then run the BAT.

## Flags (advanced)

The BAT supports optional flags:

| Flag | Effect |
|------|--------|
| `--with-portfolio` | After activating cookies, also runs `update_portfolio.py` for `@courtney-fetzer`, commits + pushes to bleeding-ink-tattoo-web |
| `--artist=slug` | Which artist to scrape (default: `courtney-fetzer`) |
| `--no-push` | With `--with-portfolio`: commit but don't push (you review + push manually) |

Examples:

```cmd
scripts\refresh_ig_cookies.bat
scripts\refresh_ig_cookies.bat --with-portfolio
scripts\refresh_ig_cookies.bat --with-portfolio --artist=isiah-jackson --no-push
```

## Exit codes (PowerShell watcher)

| Code | Meaning |
|------|---------|
| 0 | Success - cookies activated |
| 1 | Activation failed (check `cookie_refresh.py` output) |
| 2 | Timeout - no new cookie file appeared in 30s |
| 3 | Validation failed - file isn't valid JSON or missing required cookies |
| 4 | Preflight check failed - Python or watcher script missing |

## Files written

- `scripts/.cookie_refresh_status.json` - last run status (overwritten each run)
- `scripts/cookies/archive/YYYY-MM-DD_HHMMSS.json` - the previous cookies (auto-archived)

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Python not found" error | Edit `refresh_ig_cookies.bat`, update the `PYTHON_EXE=` line to your actual Python path |
| Timeout (no file detected) | Make sure you saved the JSON file in `scripts/cookies/` - not in Downloads or elsewhere |
| "missing cookie: sessionid" | You weren't logged into Instagram when you exported. Re-open Chrome, log in, re-export |
| Watcher says "validation failed" with "not valid JSON" | The file is partially written - wait a few seconds and re-export |

## Privacy

The cookie JSON file contains your Instagram session credentials. It is:
- Stored in `scripts/cookies/active.json` (gitignored - never committed)
- Backed up to `archive/YYYY-MM-DD_HHMMSS.json` (also gitignored)
- Never sent anywhere

## Related docs

- `COOKIE-GUIDE.md` - the original step-by-step (still accurate, this just wraps it)
- `ig-cookie-health.py` - the daily cron that alerts when cookies are aging
