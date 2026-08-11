import asyncio

from app.services.browser.job_page import (
    JobPageExtractor,
)

from app.services.browser.job_page_parser import (
    JobPageParser,
)


async def main():

    url = (
        "https://jobs.lever.co/geocomply-2/"
        "4bc3f323-73e1-4338-943c-33653b305e26"
    )

    # =================================
    # Playwright
    # =================================

    job_page = await JobPageExtractor.extract(
        url
    )

    print(
        "\n========== RAW JOB PAGE =========="
    )

    print(
        f"URL: {job_page.url}"
    )

    print(
        f"Page title: {job_page.job_title}"
    )

    print(
        f"Company: {job_page.company}"
    )

    print(
        f"Characters: "
        f"{len(job_page.job_description)}"
    )

    print(
        "\nRaw description:"
    )

    print(
        job_page.job_description[:2000]
    )

    # =================================
    # LLM Parser
    # =================================

    print(
        "\n========== PARSING JOB PAGE =========="
    )

    job = JobPageParser.parse(
        job_page
    )

    print(
        "\n========== FINAL JOB =========="
    )

    print(
        f"Title: {job.title}"
    )

    print(
        f"Company: {job.company}"
    )

    print(
        f"Location: {job.location}"
    )

    print(
        f"Summary: {job.summary}"
    )

    print(
        "\nResponsibilities:"
    )

    for item in job.responsibilities:

        print(
            f"- {item}"
        )

    print(
        "\nRequired Skills:"
    )

    for skill in job.required_skills:

        print(
            f"- {skill}"
        )

    print(
        "\nPreferred Skills:"
    )

    for skill in job.preferred_skills:

        print(
            f"- {skill}"
        )


if __name__ == "__main__":

    asyncio.run(main())