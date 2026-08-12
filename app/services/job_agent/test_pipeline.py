import asyncio

from app.services.resume.extractor import (
    ResumeExtractor,
)

from app.services.job_agent.pipeline import (
    JobApplicationPipeline,
)


async def main():

    print(
        "\n========================================"
    )
    print(
        "TESTING JOB APPLICATION PIPELINE"
    )
    print(
        "========================================"
    )

    # ==================================================
    # Resume
    # ==================================================

    resume_path = (
        "uploads/Anurag_Chaudhary_Resume (1).pdf"
    )

    print(
        "\n========== LOADING RESUME =========="
    )

    resume_text = (
        ResumeExtractor.extract_text(
            resume_path
        )
    )

    print(
        f"Resume characters: {len(resume_text)}"
    )

    # ==================================================
    # Job URL
    # ==================================================

    job_url = (
    "https://careers.hcltech.com/"
    "job/Senior-Developer/"
    "141469-en_US"
)

    print(
        "\n========== JOB URL =========="
    )

    print(
        job_url
    )

    # ==================================================
    # Run Pipeline
    # ==================================================

    print(
        "\n========== RUNNING PIPELINE =========="
    )

    result = (
        await JobApplicationPipeline.run(
            resume_text=resume_text,
            job_url=job_url,
        )
    )

    # ==================================================
    # Extract Results
    # ==================================================

    job = result["job"]

    agent_result = result["result"]

    # ==================================================
    # Final Job
    # ==================================================

    print(
        "\n========================================"
    )

    print(
        "FINAL JOB"
    )

    print(
        "========================================"
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

    # ==================================================
    # Responsibilities
    # ==================================================

    print(
        "\nResponsibilities:"
    )

    for responsibility in (
        job.responsibilities
    ):

        print(
            f"- {responsibility}"
        )

    # ==================================================
    # Required Skills
    # ==================================================

    print(
        "\nRequired Skills:"
    )

    for skill in job.required_skills:

        print(
            f"- {skill}"
        )

    # ==================================================
    # Preferred Skills
    # ==================================================

    print(
        "\nPreferred Skills:"
    )

    for skill in job.preferred_skills:

        print(
            f"- {skill}"
        )

    # ==================================================
    # Agent Result
    # ==================================================

    print(
        "\n========================================"
    )

    print(
        "AGENT RESULT"
    )

    print(
        "========================================"
    )

    # ==================================================
    # Match Score
    # ==================================================

    print(
        "\nMatch Score:"
    )

    print(
        agent_result.get(
            "match_score"
        )
    )

    # ==================================================
    # Similarity
    # ==================================================

    print(
        "\nSimilarity:"
    )

    print(
        agent_result.get(
            "similarity"
        )
    )

    # ==================================================
    # Match
    # ==================================================

    match = agent_result.get(
        "match"
    )

    print(
        "\nMatched Skills:"
    )

    if match:

        for skill in match.matched_skills:

            print(
                f"- {skill}"
            )

    else:

        print(
            "No match result."
        )

    # ==================================================
    # Missing Skills
    # ==================================================

    print(
        "\nMissing Skills:"
    )

    if match:

        for skill in match.missing_skills:

            print(
                f"- {skill}"
            )

    else:

        print(
            "No match result."
        )

    # ==================================================
    # Tailored Resume
    # ==================================================

    print(
        "\n========================================"
    )

    print(
        "TAILORED RESUME"
    )

    print(
        "========================================"
    )

    tailored_resume = (
        agent_result.get(
            "tailored_resume"
        )
    )

    print(
        tailored_resume
    )

    # ==================================================
    # Tailored Resume Validation
    # ==================================================

    print(
        "\nTailored Resume Validated:"
    )

    print(
        agent_result.get(
            "tailored_resume_validated"
        )
    )

    # ==================================================
    # Cover Letter
    # ==================================================

    print(
        "\n========================================"
    )

    print(
        "COVER LETTER"
    )

    print(
        "========================================"
    )

    cover_letter = (
        agent_result.get(
            "cover_letter"
        )
    )

    print(
        cover_letter
    )

    # ==================================================
    # Cover Letter Validation
    # ==================================================

    print(
        "\nCover Letter Validated:"
    )

    print(
        agent_result.get(
            "cover_letter_validated"
        )
    )

    # ==================================================
    # Pipeline Complete
    # ==================================================

    print(
        "\n========================================"
    )

    print(
        "PIPELINE TEST COMPLETE"
    )

    print(
        "========================================"
    )


if __name__ == "__main__":

    asyncio.run(
        main()
    )