"""Scrape competitor sites directly + extract key data."""
import urllib.request, re, html

def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
    })
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read().decode(errors='ignore'), r.headers
    except Exception as e:
        return None, str(e)

def extract(html_str):
    if not html_str:
        return {}
    title = re.search(r'<title>([^<]+)</title>', html_str)
    desc = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']', html_str, re.IGNORECASE)
    h1s = re.findall(r'<h1[^>]*>([^<]+)</h1>', html_str)
    h2s = re.findall(r'<h2[^>]*>([^<]+)</h2>', html_str)
    nav_links = re.findall(r'<a[^>]*href=["\']([^"\']+)["\']', html_str)
    word_count = len(re.sub(r'<[^>]+>', ' ', html_str).split())
    images = len(re.findall(r'<img', html_str))
    has_instagram = 'instagram' in html_str.lower()
    has_facebook = 'facebook' in html_str.lower()
    has_phone = bool(re.search(r'tel:|>\s*\(?\d{3}\)?\s*\d{3}-\d{4}', html_str))
    has_email = '@' in html_str and 'gmail.com' in html_str.lower() or 'mailto:' in html_str.lower()
    has_booking = any(w in html_str.lower() for w in ['book now', 'appointment', 'schedule', 'consultation', 'booking'])
    has_portfolio = any(w in html_str.lower() for w in ['portfolio', 'gallery', 'our work', 'flashes'])
    has_pricing = bool(re.search(r'\$\d|price|from \$', html_str.lower()))
    has_aftercare = 'aftercare' in html_str.lower()
    has_form = bool(re.search(r'<form|<input\s+type=["\']text', html_str))
    has_faq = bool(re.search(r'(?i)faq|frequently\s+asked|q&a|questions', html_str))
    return {
        'title': title.group(1).strip()[:120] if title else None,
        'description': desc.group(1).strip()[:200] if desc else None,
        'h1s': [h.strip()[:80] for h in h1s[:5]],
        'h2_count': len(h2s),
        'nav_links_count': len(nav_links),
        'word_count': word_count,
        'images': images,
        'has_instagram': has_instagram,
        'has_facebook': has_facebook,
        'has_phone': has_phone,
        'has_email': has_email,
        'has_booking': has_booking,
        'has_portfolio': has_portfolio,
        'has_pricing': has_pricing,
        'has_aftercare': has_aftercare,
        'has_form': has_form,
        'has_faq': has_faq,
    }

sites = [
    ('Bleeding Ink demo', 'https://bleeding-ink-tattoo-web.inquiry-970.workers.dev/'),
    ('Lemon Bomb Tattoo Co', 'https://lemonbombtattooco.square.site/'),
    ('Total Commitment Tattooing', 'https://www.facebook.com/tctattooing/'),
    ('New Breed Tattoos', 'https://www.facebook.com/newbreedstattoos'),
]

import os, json
os.makedirs('C:/Users/bbask/Coding_Projects/bleeding-ink-tattoo-web/research/competitor-analysis', exist_ok=True)

results = {}
for name, url in sites:
    print(f'\n=== {name} ({url}) ===')
    body, _ = fetch(url)
    if not body:
        print('  fetch failed')
        results[name] = {'url': url, 'fetch_failed': True}
        continue
    data = extract(body)
    results[name] = {'url': url, **data}
    for k, v in data.items():
        if isinstance(v, list):
            print(f'  {k}: {len(v)} ({v[:2] if v else "[]"})')
        else:
            print(f'  {k}: {str(v)[:80]}')

with open('C:/Users/bbask/Coding_Projects/bleeding-ink-tattoo-web/research/competitor-analysis/raw.json', 'w') as f:
    json.dump(results, f, indent=2)
print('\n--- saved raw.json ---')
