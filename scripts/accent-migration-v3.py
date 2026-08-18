"""Definitive v3: per-file migrate BLEED_RED -> accent-on-dark only in dark files.
Also: add data-theme="dark" to the top-level <section> in each.
"""
import os, re

ROOT = "C:/Users/bbask/Coding_Projects/bleeding-ink-tattoo-web/src"

# Pure dark files: any color: BLEED_RED inside = needs accent-on-dark class
pure_dark = [
    "components/Reviews.tsx",
    "components/InstagramFeed.tsx",
    "components/Footer.tsx",
    "components/MobileStickyCTA.tsx",
    "app/not-found.tsx",
]

# For these, the migration is: any 'color: BLEED_RED,' or 'color: BLEED_RED_BRIGHT,'
# or 'color: BLEED_RED }}' (no comma) -> replace with className
# But we also need to make sure we don't add a duplicate className

for relpath in pure_dark:
    path = os.path.join(ROOT, relpath.replace('/', os.sep))
    with open(path) as f:
        content = f.read()
    original = content
    # Strip the import for cleaner count
    content_no_import = re.sub(
        r'^import\s*\{[^}]*\}\s*from\s*"@/lib/constants";',
        '', content, flags=re.MULTILINE
    )
    # Count actual color: BLEED_RED patterns
    patterns = [
        r'color:\s*BLEED_RED,',         # in object style: color: BLEED_RED,
        r'color:\s*BLEED_RED\s*\}',     # in inline style: color: BLEED_RED }
        r'color:\s*BLEED_RED_BRIGHT,',
        r'color:\s*BLEED_RED_BRIGHT\s*\}',
    ]
    total_red = sum(len(re.findall(p, content_no_import)) for p in patterns)
    if total_red == 0:
        print(f"skip {relpath}: no BLEED_RED color uses")
        continue
    # Replace each pattern: add className: "accent-on-dark",
    # and REMOVE the color line
    # We do this in pairs: match `color: BLEED_RED,` and replace the whole
    # JS object style property with className
    
    # Replace `color: BLEED_RED,` with `className: "accent-on-dark",`
    content = re.sub(r'color:\s*BLEED_RED(?!\w)\s*,', 'className: "accent-on-dark",', content)
    # Same for inline style: `color: BLEED_RED }}` -> `className: "accent-on-dark" }}`
    content = re.sub(r'color:\s*BLEED_RED\s*\}', 'className: "accent-on-dark" }', content)
    # Also for BLEED_RED_BRIGHT (already correct color, but we want class-based)
    content = re.sub(r'color:\s*BLEED_RED_BRIGHT\s*,', 'className: "accent-on-dark",', content)
    content = re.sub(r'color:\s*BLEED_RED_BRIGHT\s*\}', 'className: "accent-on-dark" }', content)
    
    # If a className: already exists in this object, merge
    # For now, assume no className exists - we can fix merge later
    
    # Add data-theme="dark" to top-level section
    if 'data-theme="dark"' not in content:
        # Find first <section> without data-theme
        m = re.search(r'(<section)(?![^>]*data-theme=)([^>]*?)(>)', content)
        if m:
            content = content[:m.end()-1] + ' data-theme="dark"' + content[m.end()-1:]
    with open(path, 'w') as f:
        f.write(content)
    n_changes = sum(1 for a, b in zip(original.split('\n'), content.split('\n')) if a != b)
    print(f"modified {relpath} ({n_changes} line diffs, migrated {total_red} color uses)")

print("\n=== post-migration ===")
for relpath in pure_dark:
    path = os.path.join(ROOT, relpath.replace('/', os.sep))
    with open(path) as f:
        content = f.read()
    content_no_import = re.sub(
        r'^import\s*\{[^}]*\}\s*from\s*"@/lib/constants";', '',
        content, flags=re.MULTILINE
    )
    red = len(re.findall(r'\bBLEED_RED\b', content_no_import))
    bright = content_no_import.count('BLEED_RED_BRIGHT')
    accent = content_no_import.count('accent-on-dark')
    data_theme = content_no_import.count('data-theme="dark"')
    print(f"{relpath:38} RED:{red:2} BRIGHT:{bright:2} accent:{accent:2} data-theme:{data_theme:2}")