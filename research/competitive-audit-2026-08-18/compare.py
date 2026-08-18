import asyncio, json
from playwright.async_api import async_playwright
CDN = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js"
DEMO = "https://bleeding-ink-tattoo-web.inquiry-970.workers.dev/?cb=final"
COMP = "https://lemonbombtattooco.square.site/"

async def audit(label, url):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={'width': 390, 'height': 844})  # iPhone 13
        page = await ctx.new_page()
        try:
            await page.goto(url, wait_until='networkidle', timeout=30000)
            await page.wait_for_timeout(3000)
            await page.add_script_tag(url=CDN)
            results = await page.evaluate('axe.run()')
        except Exception as e:
            print(f"  {label}: failed - {e}")
            await browser.close()
            return
        await browser.close()
        violations = results['violations']
        print(f"\n=== {label} ({url}) ===")
        print(f"  total violations: {len(violations)}")
        counts = {}
        for v in violations:
            counts[v['impact']] = counts.get(v['impact'], 0) + 1
        for impact, count in counts.items():
            print(f"    {impact}: {count}")
        print(f"  IDs: {sorted(v['id'] for v in violations)}")

async def main():
    await audit('Bleeding Ink DEMO', DEMO)
    await audit('Lemon Bomb Tattoo (real Johnstown competitor)', COMP)

asyncio.run(main())
