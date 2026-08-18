"""Migration v2: convert BLEED_RED inline styles to use accent-on-dark class in dark files."""
import os, re

ROOT = "C:/Users/bbask/Coding_Projects/bleeding-ink-tattoo-web/src"

# These files have dark backgrounds - any color: BLEED_RED inside should
# auto-switch to BLEED_RED_BRIGHT via the .accent-on-dark class + data-theme="dark"
dark_files = {
    "components/Reviews.tsx": True,
    "components/InstagramFeed.tsx": True,
    "components/Footer.tsx": True,
    "components/MobileStickyCTA.tsx": True,
    "app/not-found.tsx": True,
}

# These files have BOTH light and dark sections
mixed_files = {
    "components/Hero.tsx",  # home variant is dark
    "app/page.tsx",         # hero dark, rest light
    "app/book/page.tsx",
    "app/contact/ContactForm.tsx",
}

# Strategy: For pure-dark files, just change `color: BLEED_RED,` to use
# the .accent-on-dark class via inline className.
# The class is already defined in globals.css to use the right color.

def migrate_pure_dark(content):
    # Replace `color: BLEED_RED,` with `className: "accent-on-dark",` AND
    # `color: BLEED_RED_BRIGHT,` with `className: "accent-on-dark",`
    # (we want ALL accent text to use the class so context-aware)
    # We also need to remove duplicate className if it exists

    # For now, simple replace: just the inline color -> className
    out = re.sub(r'color:\s*BLEED_RED(?!_)\s*,?', 'className: "accent-on-dark",', content)
    out = re.sub(r'color:\s*BLEED_RED_BRIGHT\s*,?', 'className: "accent-on-dark",', out)
    # Some occurrences: `style={{ color: BLEED_RED }}` (no trailing comma)
    # Regex above handles it
    return out

def add_data_theme_dark(content):
    """Add data-theme="dark" to the top-level <section> or <div> in JSX.
    Simple heuristic: find first <section in the file and add the attribute.
    For Footer (a <footer>), add to <footer>.
    For InstagramFeed / Reviews (a <section>), add to <section>.
    For NotFound (a <div>), add to <div>.
    """
    # Look for first <section> (most common) - add data-theme to it
    # Use lookahead: <section ... > that doesn't already have data-theme
    pattern = r'(<section)(?![^>]*data-theme=)( [^>]*)?>'
    out = re.sub(pattern, r'\1\2 data-theme="dark">', content, count=1)
    return out

for relpath, is_pure_dark in dark_files.items():
    path = os.path.join(ROOT, relpath.replace('/', os.sep))
    if not os.path.exists(path):
        print(f"missing: {relpath}")
        continue
    with open(path) as f:
        content = f.read()
    original = content
    if is_pure_dark:
        content = migrate_pure_dark(content)
        content = add_data_theme_dark(content)
    with open(path, 'w') as f:
        f.write(content)
    if content != original:
        n_lines = sum(1 for a, b in zip(original.split('\n'), content.split('\n')) if a != b)
        print(f"modified {relpath} ({n_lines} line diffs)")
    else:
        print(f"no change: {relpath}")

print("\n=== post-migration counts ===")
for relpath in dark_files:
    path = os.path.join(ROOT, relpath.replace('/', os.sep))
    if not os.path.exists(path): continue
    with open(path) as f:
        content = f.read()
    bright = content.count('BLEED_RED_BRIGHT')
    red = content.count('BLEED_RED') - bright
    accent = content.count('accent-on-dark')
    data_theme = content.count('data-theme="dark"')
    print(f"{relpath:38} RED:{red:2} BRIGHT:{bright:2} accent:{accent:2} data-theme:{data_theme:2}")