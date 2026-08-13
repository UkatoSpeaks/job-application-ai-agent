from playwright.async_api import (
    async_playwright,
    Browser,
    Playwright,
)


class PlaywrightClient:

    def __init__(self):
        self.playwright: Playwright | None = None
        self.browser: Browser | None = None

    async def start(self) -> Browser:

        print("\n========== STARTING PLAYWRIGHT ==========")

        self.playwright = (
            await async_playwright().start()
        )

        self.browser = (
            await self.playwright.chromium.launch(
                headless=True
            )
        )

        print("Browser started.")

        return self.browser

    async def close(self):

        print("\n========== CLOSING PLAYWRIGHT ==========")

        if self.browser is not None:
            await self.browser.close()
            self.browser = None

        if self.playwright is not None:
            await self.playwright.stop()
            self.playwright = None

        print("Playwright closed.")