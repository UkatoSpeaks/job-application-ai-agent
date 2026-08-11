import asyncio

from app.services.browser.job_page import (
    JobPageExtractor,
)


async def main():

    job = await JobPageExtractor.extract(
        "https://example.com"
    )

    print("\n========== RESULT ==========")

    print(
        f"URL: {job.url}"
    )

    print(
        f"Company: {job.company}"
    )

    print(
        f"Job Title: {job.job_title}"
    )

    print(
        "\nJob Description:"
    )

    print(
        job.job_description[:3000]
    )


if __name__ == "__main__":
    asyncio.run(main())