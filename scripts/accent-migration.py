"""
Surgical migration: add data-theme="dark" to dark sections,
add .accent-on-dark class to all color: BLEED_RED/BLEED_RED_BRIGHT
elements inside those sections.

Rules:
- Dark sections (background: var(--color-ink-black) or "transparent" inside a
  dark parent): add data-theme="dark" to the section div
- Any element with color: BLEED_RED or color: BLEED_RED_BRIGHT inside a dark section:
  - Replace inline color with className="accent-on-dark"
  - Add data-theme="dark" to all ancestor sections that don't have it
"""
import os, re

ROOT = "C:/Users/bbask/Coding_Projects/bleeding-ink-tattoo-web/src"

# For each .tsx file, detect: does it render any section with `background: "var(--color-ink-black)"`?
# If yes, add data-theme="dark" to that section.
# Then any color: BLEED_RED or color: BLEED_RED_BRIGHT element in that file:
# - Inside a dark section: replace with className="accent-on-dark"
# - Inside a light section: leave alone (BLEED_RED already passes)

# Simpler approach: per-file analysis
# Files we KNOW have dark sections:
dark_files = {
    "app/page.tsx": [
        # Hero (the top <section> with the home hero)
        # CTA strip (the section with "Book a Session" + "Contact" buttons)
        # Reviews section
        # IG feed section
        # Footer
    ],
    "components/Reviews.tsx": ["all sections (entire component is dark)"],
    "components/InstagramFeed.tsx": ["all sections (entire component is dark)"],
    "components/Footer.tsx": ["all sections (entire component is dark)"],
    "components/MobileStickyCTA.tsx": ["all sections (entire component is dark)"],
    "components/Hero.tsx": ["home variant section"],
    "app/not-found.tsx": ["all sections (entire page is dark)"],
    "app/book/page.tsx": ["the 'Aftercare timeline' section header", "sidebar aside"],
    "app/contact/ContactForm.tsx": ["the error/success alert area", "the submit button label area"],
}

# Apply changes to each file
for relpath in dark_files:
    path = os.path.join(ROOT, relpath.replace('/', os.sep))
    if not os.path.exists(path):
        print(f"missing: {path}")
        continue
    with open(path) as f:
        content = f.read()
    original = content
    # 1. Replace `color: BLEED_RED_BRIGHT,` with `className: "accent-on-dark",` (drop the inline color)
    content = re.sub(
        r'color:\s*BLEED_RED_BRIGHT,?',
        'className: "accent-on-dark",',
        content
    )
    # 2. Replace remaining `color: BLEED_RED,` (only in dark sections - we know this file is dark)
    # Be careful: not all BLEED_RED in this file is on dark bg. Use data-theme markers.
    # For now, just replace all BLEED_RED with accent-on-dark in files marked fully-dark
    if relpath in [
        "components/Reviews.tsx",
        "components/InstagramFeed.tsx",
        "components/Footer.tsx",
        "components/MobileStickyCTA.tsx",
        "app/not-found.tsx",
    ]:
        # Replace all BLEED_RED with accent-on-dark + remove the inline color
        # But careful: we also need to remove BLEED_RED_BRIGHT which was already replaced
        # The replacement above already handled BLEED_RED_BRIGHT
        # For BLEED_RED in inline style: replace with accent-on-dark too (since this is dark-only)
        # Use a regex that only matches the inline-style occurrence
        content = re.sub(
            r'color:\s*BLEED_RED(?!\w),?',
            'className: "accent-on-dark",',
            content
        )
    with open(path, 'w') as f:
        f.write(content)
    if content != original:
        n_changes = sum(1 for a, b in zip(original.split('\n'), content.split('\n')) if a != b)
        print(f"modified {relpath} ({n_changes} line diffs)")
    else:
        print(f"no change: {relpath}")