from app.services.browser.job_page import (
    JobPageExtractor,
)

from app.services.browser.job_page_parser import (
    JobPageParser,
)

from app.services.job_agent.graph import (
    job_agent_graph,
)


class JobApplicationPipeline:

    @classmethod
    async def run(
        cls,
        resume_text: str,
        job_url: str,
    ) -> dict:

        print("\n========================================")
        print("STARTING JOB APPLICATION PIPELINE")
        print("========================================")

        print(
            f"\nJob URL: {job_url}"
        )

        # ==================================================
        # STEP 1 — Extract Job Page
        # ==================================================

        print(
            "\n========== STEP 1: JOB EXTRACTION =========="
        )

        job_page = (
            await JobPageExtractor.extract(
                job_url
            )
        )

        print(
            "\nJob page extracted successfully."
        )

        print(
            f"Characters: "
            f"{len(job_page.job_description)}"
        )

        # ==================================================
        # STEP 2 — Parse Job Description
        # ==================================================

        print(
            "\n========== STEP 2: JOB PARSING =========="
        )

        job = JobPageParser.parse(
            job_page
        )

        print(
            "\nJob parsed successfully."
        )

        # ==================================================
        # STEP 3 — Convert Structured Job
        #         Back To Text For Agent
        # ==================================================

        job_description_text = (
            cls.build_job_description_text(
                job
            )
        )

        # ==================================================
        # STEP 4 — Run LangGraph
        # ==================================================

        print(
            "\n========== STEP 3: RUNNING JOB AGENT =========="
        )

        initial_state = {

            "resume_text": resume_text,

            "job_description_text":
                job_description_text,
        }

        result = (
            await job_agent_graph.ainvoke(
                initial_state
            )
        )

        # ==================================================
        # STEP 5 — Return Result
        # ==================================================

        print(
            "\n========================================"
        )

        print(
            "JOB APPLICATION PIPELINE COMPLETE"
        )

        print(
            "========================================"
        )

        return {
            "job_page": job_page,

            "job": job,

            "result": result,
        }

    # ======================================================
    # Build Job Description Text
    # ======================================================

    @staticmethod
    def build_job_description_text(
        job,
    ) -> str:

        sections = []

        # ------------------------------------------
        # Title
        # ------------------------------------------

        if job.title:

            sections.append(
                f"Job Title: {job.title}"
            )

        # ------------------------------------------
        # Company
        # ------------------------------------------

        if job.company:

            sections.append(
                f"Company: {job.company}"
            )

        # ------------------------------------------
        # Location
        # ------------------------------------------

        if job.location:

            sections.append(
                f"Location: {job.location}"
            )

        # ------------------------------------------
        # Summary
        # ------------------------------------------

        if job.summary:

            sections.append(
                f"Summary:\n{job.summary}"
            )

        # ------------------------------------------
        # Responsibilities
        # ------------------------------------------

        if job.responsibilities:

            responsibilities = "\n".join(
                f"- {item}"
                for item
                in job.responsibilities
            )

            sections.append(
                "Responsibilities:\n"
                + responsibilities
            )

        # ------------------------------------------
        # Required Skills
        # ------------------------------------------

        if job.required_skills:

            required_skills = "\n".join(
                f"- {skill}"
                for skill
                in job.required_skills
            )

            sections.append(
                "Required Skills:\n"
                + required_skills
            )

        # ------------------------------------------
        # Preferred Skills
        # ------------------------------------------

        if job.preferred_skills:

            preferred_skills = "\n".join(
                f"- {skill}"
                for skill
                in job.preferred_skills
            )

            sections.append(
                "Preferred Skills:\n"
                + preferred_skills
            )

        # ------------------------------------------
        # Qualifications
        # ------------------------------------------

        if job.qualifications:

            qualifications = "\n".join(
                f"- {item}"
                for item
                in job.qualifications
            )

            sections.append(
                "Qualifications:\n"
                + qualifications
            )

        # ------------------------------------------
        # Final text
        # ------------------------------------------

        return "\n\n".join(
            sections
        )