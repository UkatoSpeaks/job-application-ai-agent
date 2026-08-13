import asyncio

from app.services.job_agent.graph import (
    job_agent_graph,
)

from app.services.resume.extractor import (
    ResumeExtractor,
)

from app.services.browser.job_page import (
    JobPageExtractor,
)

from app.services.browser.job_page_parser import (
    JobPageParser,
)


# ==========================================================
# Convert Structured Job → Text
# ==========================================================

def build_job_description_text(job) -> str:

    sections = []

    # ------------------------------------------
    # Basic Information
    # ------------------------------------------

    if job.title:
        sections.append(
            f"Job Title: {job.title}"
        )

    if job.company:
        sections.append(
            f"Company: {job.company}"
        )

    if job.location:
        sections.append(
            f"Location: {job.location}"
        )

    # ------------------------------------------
    # Summary
    # ------------------------------------------

    if job.summary:
        sections.append(
            f"\nSummary:\n{job.summary}"
        )

    # ------------------------------------------
    # Responsibilities
    # ------------------------------------------

    if job.responsibilities:

        responsibilities = "\n".join(
            f"- {item}"
            for item in job.responsibilities
        )

        sections.append(
            "\nResponsibilities:\n"
            + responsibilities
        )

    # ------------------------------------------
    # Required Skills
    # ------------------------------------------

    if job.required_skills:

        required_skills = "\n".join(
            f"- {skill}"
            for skill in job.required_skills
        )

        sections.append(
            "\nRequired Skills:\n"
            + required_skills
        )

    # ------------------------------------------
    # Preferred Skills
    # ------------------------------------------

    if job.preferred_skills:

        preferred_skills = "\n".join(
            f"- {skill}"
            for skill in job.preferred_skills
        )

        sections.append(
            "\nPreferred Skills:\n"
            + preferred_skills
        )

    # ------------------------------------------
    # Qualifications
    # ------------------------------------------

    if job.qualifications:

        qualifications = "\n".join(
            f"- {qualification}"
            for qualification in job.qualifications
        )

        sections.append(
            "\nQualifications:\n"
            + qualifications
        )

    return "\n".join(sections)


# ==========================================================
# Main
# ==========================================================

async def main():

    print(
        "\n========================================"
    )
    print(
        "STARTING JOB APPLICATION AGENT"
    )
    print(
        "========================================"
    )

    # ======================================================
    # Resume
    # ======================================================

    print(
        "\n========== EXTRACTING RESUME =========="
    )

    resume_path = (
        "uploads/Anurag_Chaudhary_Resume (1).pdf"
    )

    resume_text = ResumeExtractor.extract_text(
        resume_path
    )

    print(
        f"Resume characters: {len(resume_text)}"
    )

    # ======================================================
    # Job URL
    # ======================================================

    job_url = (
        "https://jobs.lever.co/geocomply-2/"
        "4bc3f323-73e1-4338-943c-33653b305e26"
    )

    print(
        "\n========== JOB URL =========="
    )

    print(job_url)

    # ======================================================
    # Playwright
    # ======================================================

    print(
        "\n========== EXTRACTING JOB PAGE =========="
    )

    job_page = await JobPageExtractor.extract(
        job_url
    )

    print(
        "\n========== JOB PAGE EXTRACTED =========="
    )

    print(
        f"URL: {job_page.url}"
    )

    print(
        f"Title: {job_page.job_title}"
    )

    print(
        f"Characters: "
        f"{len(job_page.job_description)}"
    )

    # ======================================================
    # Parse Job Page
    # ======================================================

    print(
        "\n========== PARSING JOB PAGE =========="
    )

    job = JobPageParser.parse(
        job_page
    )

    print(
        "\n========== STRUCTURED JOB =========="
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

    # ======================================================
    # Convert JobDescription → Text
    # ======================================================

    job_description_text = (
        build_job_description_text(
            job
        )
    )

    print(
        "\n========== JOB DESCRIPTION FOR AGENT =========="
    )

    print(
        job_description_text
    )

    # ======================================================
    # Initial LangGraph State
    # ======================================================

    initial_state = {

        "resume_text": resume_text,

        "job_description_text": (
            job_description_text
        ),
    }

    # ======================================================
    # Run Job Agent Graph
    # ======================================================

    print(
        "\n========================================"
    )

    print(
        "RUNNING JOB AGENT GRAPH"
    )

    print(
        "========================================"
    )

    result = job_agent_graph.invoke(
        initial_state
    )

    # ======================================================
    # Results
    # ======================================================

    print(
        "\n========================================"
    )

    print(
        "GRAPH EXECUTION COMPLETE"
    )

    print(
        "========================================"
    )

    # ------------------------------------------
    # Similarity
    # ------------------------------------------

    print(
        "\nSimilarity:"
    )

    print(
        result.get("similarity")
    )

    # ------------------------------------------
    # Match
    # ------------------------------------------

    print(
        "\nMatch:"
    )

    print(
        result.get("match")
    )

    # ------------------------------------------
    # Tailored Resume
    # ------------------------------------------

    print(
        "\nTailored Resume:"
    )

    print(
        result.get("tailored_resume")
    )

    # ------------------------------------------
    # Cover Letter
    # ------------------------------------------

    print(
        "\nCover Letter:"
    )

    print(
        result.get("cover_letter")
    )

    # ------------------------------------------
    # Validation
    # ------------------------------------------

    print(
        "\nTailored Resume Validated:"
    )

    print(
        result.get(
            "tailored_resume_validated"
        )
    )

    print(
        "\nCover Letter Validated:"
    )

    print(
        result.get(
            "cover_letter_validated"
        )
    )

    print(
        "\n========================================"
    )


# ==========================================================
# Entry Point
# ==========================================================

if __name__ == "__main__":

    asyncio.run(
        main()
    )