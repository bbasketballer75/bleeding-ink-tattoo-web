"""Self-test the bleeding-ink demo site.

Hits every page + the SEO endpoints. Prints a pass/fail summary.

Usage:
  python scripts/selftest-demo.py
"""
import sys
import urllib.request
import time

URL = "https://bleeding-ink-tattoo-web.inquiry-970.workers.dev"

# (path, must_contain_substring_or_None)
ROUTES = [
    ("/",                  ["Bleeding Ink", "Johnstown"]),
    ("/artists",           ["Isiah Jackson", "Courtney Fetzer"]),
    ("/artists/isiah-jackson", ["Isiah Jackson", "Owner"]),
    ("/services",          ["Tattoo", "Custom"]),
    ("/portfolio",         ["portfolio", "Tattoo"]),
    ("/faq",               ["FAQ", "walk-in", "deposit"]),
    ("/book",              ["consultation", "deposit", "Isiah"]),
    ("/contact",           ["contact", "form", "215"]),
    ("/aftercare",         ["aftercare", "24", "healing"]),
    ("/legal",             ["Privacy", "Terms", "deposit"]),
    ("/sitemap.xml",       ["<urlset", "bleedinginktattoo.com"]),
    ("/robots.txt",        ["User-Agent", "Sitemap"]),
    ("/og-default.svg",    ["<svg"]),
]

def fetch(path):
    req = urllib.request.Request(URL + path, headers={'User-Agent': 'self-test/1.0'})
    try:
        r = urllib.request.urlopen(req, timeout=20)
        return r.status, r.read().decode(errors='replace'), r.headers.get('content-type', '')
    except urllib.error.HTTPError as e:
        return e.code, '', ''
    except Exception as e:
        return 0, f'ERR: {e}', ''

def main():
    start = time.time()
    results = []
    for path, must in ROUTES:
        status, body, ctype = fetch(path)
        ok = status == 200
        if ok and must:
            ok = all(m in body for m in must)
        marker = "PASS" if ok else "FAIL"
        miss = ""
        if ok and must:
            miss = ""  # all good
        elif status == 200 and must:
            miss = " (missing: " + ",".join(m for m in must if m not in body) + ")"
        elif status == 0:
            miss = f" ({body})"
        else:
            miss = f" (HTTP {status})"
        print(f"  [{marker}] {path}{miss}")
        results.append((marker, path))

    # Special check: JSON-LD on home
    status, body, _ = fetch("/")
    if status == 200:
        has_jsonld = '"@type":"TattooParlor"' in body or '"@type": "TattooParlor"' in body or 'TattooParlor' in body
        marker = "PASS" if has_jsonld else "FAIL"
        print(f"  [{marker}] / contains TattooParlor JSON-LD")
        results.append((marker, "/ JSON-LD"))

    # Total
    passed = sum(1 for r, _ in results if r == "PASS")
    elapsed = time.time() - start
    print()
    print(f"=== {passed}/{len(results)} checks passed in {elapsed:.1f}s ===")
    if passed != len(results):
        sys.exit(1)

if __name__ == "__main__":
    main()