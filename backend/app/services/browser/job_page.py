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

            # ---------------------------------
            # Start browser
            # ---------------------------------

            browser = await client.start()

            # ---------------------------------
            # Create page
            # ---------------------------------

            page = await browser.new_page()

            # ---------------------------------
            # Navigate
            # ---------------------------------

            await page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=30000,
            )

            # ---------------------------------
            # Wait for page
            # ---------------------------------

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

            # ---------------------------------
            # Page information
            # ---------------------------------

            page_title = await page.title()

            current_url = page.url

            print(
                f"Page title: {page_title}"
            )

            print(
                f"Current URL: {current_url}"
            )

            # ---------------------------------
            # Extract visible text
            # ---------------------------------

            page_text = await page.locator(
                "body"
            ).inner_text()

            page_text = page_text.strip()

            if not page_text:

                raise ValueError(
                    "No text could be extracted "
                    "from the job page."
                )

            # ---------------------------------
            # Authentication detection
            # ---------------------------------

            title_lower = page_title.lower()
            text_lower = page_text.lower()

            login_indicators = [
                "log in",
                "login",
                "sign in",
                "sign up",
            ]

            is_login_page = any(
                indicator in title_lower
                for indicator in login_indicators
            )

            if is_login_page:

                raise ValueError(
                    "Job page requires authentication. "
                    f"Redirected to: {current_url}"
                )

            # ---------------------------------
            # Basic content validation
            # ---------------------------------

            if len(page_text) < 300:

                raise ValueError(
                    "Job page contains insufficient "
                    "content to extract a job description."
                )

            # ---------------------------------
            # Success
            # ---------------------------------

            print(
                f"Extracted characters: "
                f"{len(page_text)}"
            )

            return JobPage(
                url=url,
                company=None,
                job_title=None,
                job_description=page_text,
            )

        finally:

            await client.close()