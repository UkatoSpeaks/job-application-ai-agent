from app.schemas.job_description import JobDescription
from app.schemas.job_page import JobPage

from app.services.job_matching.llm_parser import (
    JobDescriptionLLMParser,
)


class JobPageParser:

    @classmethod
    def parse(
        cls,
        job_page: JobPage,
    ) -> JobDescription:

        print("\n========================================")
        print("PARSING EXTRACTED JOB PAGE")
        print("========================================")

        if not job_page.job_description.strip():

            raise ValueError(
                "Job page contains no description text."
            )

        print(
            f"Raw text length: "
            f"{len(job_page.job_description)}"
        )

        job = JobDescriptionLLMParser.parse(
            job_page.job_description
        )

        print("\n========== STRUCTURED JOB ==========")

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
            "===================================="
        )

        return job