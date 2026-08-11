from app.schemas.job_page import JobPage

from app.services.browser.playwright_client import (
    PlaywrightClient,
)


class JobPageExtractor:

    @classmethod
    async def extract(
        cls,
        url: str,
    ) -> JobPage:

        print("\n========================================")
        print("EXTRACTING JOB PAGE")
        print("========================================")
        print(f"URL: {url}")

        client = PlaywrightClient()

        try:

            browser = await client.start()

            page = await browser.new_page()

            await page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=30000,
            )

            try:

                await page.wait_for_load_state(
                    "networkidle",
                    timeout=10000,
                )

            except Exception:

                print(
                    "Network idle timeout reached. "
                    "Continuing with current page."
                )

            page_title = await page.title()

            print(
                f"Page title: {page_title}"
            )

            page_text = await page.locator(
                "body"
            ).inner_text()

            page_text = page_text.strip()

            if not page_text:

                raise ValueError(
                    "No text could be extracted "
                    "from the job page."
                )

            print(
                f"Extracted characters: "
                f"{len(page_text)}"
            )

            return JobPage(
                url=url,
                company=None,
                job_title=page_title,
                job_description=page_text,
            )

        finally:

            await client.close()