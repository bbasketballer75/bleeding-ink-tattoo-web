"""Pure async scraping logic for IG profiles + reels/posts.

Used by scripts/ig_scrape.py (CLI) and scripts/update_portfolio.py
(orchestrator). No CLI here, no script writes — just the Playwright logic.

Public API:
    async def scrape_profile(storage_state, username, *, max_posts=24,
                            on_image=None, headless=True,
                            post_callback=None) -> ScrapeResult
"""

from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Awaitable, Callable, Optional

MIN_IMAGE_BYTES = 30_000  # skip UI assets (<30KB)
SCROLL_COUNT_MAX = 6
SCROLL_WAIT_MS = 2500


@dataclass
class PostData:
    """One reel or post we successfully visited."""
    id: str
    kind: str                # "reel" | "post"
    url: str
    caption: str
    images: dict[str, bytes] = field(default_factory=dict)   # url -> body


@dataclass
class ScrapeResult:
    username: str
    profile_pic_url: str = ""
    display_name: str = ""
    posts: list[PostData] = field(default_factory=list)


# --- Profile discovery ----------------------------------------------------------

async def _collect_profile(storage_state: dict, username: str,
                           *, headless: bool, max_posts: int,
                           post_callback: Optional[Callable[[str], Awaitable[None]]] = None,
                           on_image: Optional[Callable[[str, bytes], Awaitable[None]]] = None,
                           ) -> tuple[str, str, list[str]]:
    """Load the profile page, collect post URLs and the profile pic.

    Returns (display_name, profile_pic_url, [post_url, ...]).
    """
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=headless,
            args=["--no-blink-features=AutomationControlled"],
        )
        ctx = await browser.new_context(
            storage_state=storage_state,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )
        page = await ctx.new_page()

        # Pre-create a bucket for profile images
        bucket: dict[str, bytes] = {}

        def on_response(r):
            url = r.url
            if "scontent" in url and ".jpg" in url:
                # We can't await in sync handler, so use page.expose_function
                pass
        # We register an async handler instead
        async def handle(r):
            url = r.url
            if "scontent" in url and ".jpg" in url:
                try:
                    body = await r.body()
                    if len(body) > MIN_IMAGE_BYTES:
                        bucket[url] = body
                        if on_image:
                            await on_image(url, body)
                except Exception:
                    pass
        page.on("response", lambda r: asyncio.create_task(handle(r)))

        url = f"https://www.instagram.com/{username}/"
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)

        # Title + profile pic
        display_name = await page.title()
        og_image_url = ""
        # Extract og:image meta
        meta_html = await page.content()
        m = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', meta_html)
        if m:
            og_image_url = m.group(1)

        # Scroll to load post links
        seen: set[str] = set()
        post_links: list[str] = []
        scroll_count = 0
        # Match both absolute and relative IG post URLs
        url_pattern = re.compile(
            r'(?:https?://(?:www\.)?instagram\.com)?/(?:p|reel|reels)/([A-Za-z0-9_-]+)/?'
        )

        while scroll_count < SCROLL_COUNT_MAX and len(post_links) < max_posts:
            scroll_count += 1
            html = await page.content()
            for shortcode in url_pattern.findall(html):
                # Skip non-target usernames (suggests users, similar accounts)
                # We can't know the username from the regex, but we trust
                # the page content is mostly target posts on a clean profile.
                full = f"https://www.instagram.com/reel/{shortcode}/"
                if full not in seen:
                    seen.add(full)
                    post_links.append(full)
            if len(post_links) >= max_posts:
                break
            # Scroll to load more posts
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(SCROLL_WAIT_MS)

        post_links = post_links[:max_posts]

        # Fire post_callback for each discovered post so callers can
        # stream output during the scrape
        if post_callback:
            for url in post_links:
                try:
                    await post_callback(url)
                except Exception:
                    pass

        # Stash profile pic back to caller via closure
        scrape_result_profile = {
            "display_name": display_name,
            "og_image_url": og_image_url,
            "post_links": post_links,
            "bucket": bucket,
        }
        await ctx.close()
        await browser.close()
        return scrape_result_profile


# --- Per-post image collection --------------------------------------------------

async def _collect_post_images(storage_state: dict, post_url: str,
                              *, headless: bool,
                              on_image: Optional[Callable[[str, bytes], Awaitable[None]]] = None,
                              ) -> PostData:
    """Visit one post, extract caption + collect image bodies via response interception."""
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=headless,
            args=["--no-blink-features=AutomationControlled"],
        )
        ctx = await browser.new_context(
            storage_state=storage_state,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )
        page = await ctx.new_page()

        bucket: dict[str, bytes] = {}

        async def handle(r):
            url = r.url
            if "scontent" in url and ".jpg" in url:
                try:
                    body = await r.body()
                    if len(body) > MIN_IMAGE_BYTES:
                        bucket[url] = body
                        if on_image:
                            await on_image(url, body)
                except Exception:
                    pass
        page.on("response", lambda r: asyncio.create_task(handle(r)))

        await page.goto(post_url, wait_until="domcontentloaded", timeout=20000)
        await page.wait_for_timeout(2500)

        # Scroll to trigger lazy-loaded images
        for _ in range(2):
            await page.evaluate("window.scrollBy(0, 400)")
            await page.wait_for_timeout(800)

        html = await page.content()
        caption = ""
        m = re.search(r'<meta\s+property="og:description"\s+content="([^"]+)"', html)
        if m:
            caption = m.group(1)

        # Extract shortcode
        from urllib.parse import urlparse
        path = urlparse(post_url).path  # /reel/CODE/
        parts = [p for p in path.split("/") if p]
        kind = parts[0] if parts else "unknown"  # reel | p | reels
        shortcode = parts[1] if len(parts) > 1 else "unknown"

        post = PostData(
            id=shortcode,
            kind=kind,
            url=post_url,
            caption=caption,
            images=bucket,
        )

        await ctx.close()
        await browser.close()
        return post


# --- Public API ---------------------------------------------------------------

async def scrape_profile(storage_state: dict, username: str,
                         *, max_posts: int = 24,
                         headless: bool = True,
                         on_image: Optional[Callable[[str, bytes], Awaitable[None]]] = None) -> ScrapeResult:
    """End-to-end: load profile, collect post URLs, visit each, collect images.

    Args:
        storage_state: from scripts.lib.ig_auth.load_cookies()
        username: IG handle (without @)
        max_posts: hard cap (default 24)
        headless: set False to see the browser (for debug)
        on_image: optional async callback (url, body) -> None. Called for
            each intercepted image. Useful for streaming.

    Returns a ScrapeResult with all collected posts.
    """
    profile_data = await _collect_profile(
        storage_state,
        username,
        headless=headless,
        max_posts=max_posts,
        on_image=on_image,
    )
    posts: list[PostData] = []
    for post_url in profile_data["post_links"]:
        post = await _collect_post_images(
            storage_state,
            post_url,
            headless=headless,
            on_image=on_image,
        )
        posts.append(post)

    return ScrapeResult(
        username=username,
        profile_pic_url=profile_data["og_image_url"],
        display_name=profile_data["display_name"],
        posts=posts,
    )


__all__ = [
    "ScrapeResult",
    "PostData",
    "scrape_profile",
    "MIN_IMAGE_BYTES",
]
