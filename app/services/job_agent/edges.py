from app.services.job_agent.state import JobAgentState


def route_after_match(state: JobAgentState) -> str:
    """
    Decide what should happen after resume-job matching.
    """

    similarity = state.get("similarity", 0)

    print("\n========== ROUTING AFTER MATCH ==========")
    print(f"Similarity: {similarity}")

    if similarity < 50:
        print("Route: tailor_resume")
        return "tailor_resume"

    print("Route: generate_cover_letter")
    return "generate_cover_letter"