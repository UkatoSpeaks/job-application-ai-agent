from app.services.job_agent.state import JobAgentState
from app.services.job_agent.state import JobAgentState


# ==========================================================
# After Resume-JD Match
# ==========================================================

def route_after_match(state: JobAgentState) -> str:
    """
    Decide what should happen after resume-job matching.

    Match score < 70:
        Tailor the resume first.

    Match score >= 70:
        Skip tailoring and generate the cover letter.
    """

    match_score = state.get("match_score", 0)

    print("\n========== ROUTING AFTER MATCH ==========")
    print(f"Match Score: {match_score}")

    if match_score < 70:
        print("Route: tailor_resume")
        return "tailor_resume"

    print("Route: generate_cover_letter")
    return "generate_cover_letter"


# ==========================================================
# After Resume Tailoring
# ==========================================================

def route_after_tailoring(
    state: JobAgentState,
) -> str:
    """
    Decide whether to retry resume tailoring or continue
    to cover-letter generation.
    """

    validated = state.get(
        "tailored_resume_validated",
        False,
    )

    retry_count = state.get(
        "tailor_retry_count",
        0,
    )

    max_retries = 2

    print("\n========== ROUTING AFTER TAILORING ==========")
    print(f"Validated: {validated}")
    print(f"Retry Count: {retry_count}")

    # ---------------------------------
    # Valid output
    # ---------------------------------

    if validated:
        print("Route: generate_cover_letter")
        return "generate_cover_letter"

    # ---------------------------------
    # Retry
    # ---------------------------------

    if retry_count < max_retries:
        print("Route: retry_tailor_resume")
        return "retry_tailor_resume"

    # ---------------------------------
    # Maximum retries reached
    # ---------------------------------

    print("Maximum tailor retries reached.")
    print("Route: generate_cover_letter")

    return "generate_cover_letter"


# ==========================================================
# After Cover Letter Generation
# ==========================================================

def route_after_cover_letter(
    state: JobAgentState,
) -> str:
    """
    Decide whether to retry cover-letter generation or
    finish the graph.
    """

    validated = state.get(
        "cover_letter_validated",
        False,
    )

    retry_count = state.get(
        "cover_letter_retry_count",
        0,
    )

    max_retries = 2

    print("\n========== ROUTING AFTER COVER LETTER ==========")
    print(f"Validated: {validated}")
    print(f"Retry Count: {retry_count}")

    # ---------------------------------
    # Valid output
    # ---------------------------------

    if validated:
        print("Route: END")
        return "end"

    # ---------------------------------
    # Retry
    # ---------------------------------

    if retry_count < max_retries:
        print("Route: retry_cover_letter")
        return "retry_cover_letter"

    # ---------------------------------
    # Maximum retries reached
    # ---------------------------------

    print("Maximum cover-letter retries reached.")
    print("Route: END")

    return "end"





def route_after_resume(
    state: JobAgentState,
) -> str:
    """
    Decide how the job description should
    enter the agent.
    """

    print(
        "\n========== ROUTING JOB INPUT =========="
    )

    job_url = state.get(
        "job_url"
    )

    job_description_text = state.get(
        "job_description_text"
    )

    if job_url:

        print(
            f"Job URL detected: {job_url}"
        )

        print(
            "Route: extract_job_page"
        )

        return "extract_job_page"

    if job_description_text:

        print(
            "Manual job description detected."
        )

        print(
            "Route: parse_job"
        )

        return "parse_job"

    raise ValueError(
        "No job input provided. "
        "Provide either job_url or "
        "job_description_text."
    )