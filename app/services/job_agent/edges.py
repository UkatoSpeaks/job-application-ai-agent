from app.services.job_agent.state import JobAgentState


def route_after_match(state: JobAgentState) -> str:
    """
    Decide what should happen after resume-job matching.

    Routing is based on the weighted match score:
        < 40  -> tailor resume
        40-70 -> tailor resume
        > 70  -> generate cover letter
    """

    match_score = state.get("match_score", 0)

    print("\n========== ROUTING AFTER MATCH ==========")
    print(f"Match Score: {match_score}")

    if match_score < 70:
        print("Route: tailor_resume")
        return "tailor_resume"

    print("Route: generate_cover_letter")
    return "generate_cover_letter"