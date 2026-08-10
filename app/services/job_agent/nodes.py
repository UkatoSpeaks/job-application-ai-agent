from app.services.job_agent.state import JobAgentState

from app.services.job_matching.grounding import (
    GroundingValidator,
)

from app.services.resume.parser import ResumeParser

from app.services.job_matching.llm_parser import (
    JobDescriptionLLMParser,
)

from app.services.job_matching.matcher import (
    ResumeJobMatcher,
)

from app.services.job_matching.similarity import (
    SimilarityCalculator,
)

from app.services.resume_tailor.tailor import (
    ResumeTailor,
)

from app.services.cover_letter.generator import (
    CoverLetterGenerator,
)


# ==========================================================
# Parse Resume
# ==========================================================

def parse_resume_node(
    state: JobAgentState,
) -> dict:

    print(
        "\n========== NODE: PARSE RESUME =========="
    )

    resume = ResumeParser.parse(
        state["resume_text"]
    )

    print(
        "Resume parsed successfully."
    )

    return {
        "resume": resume,
    }


# ==========================================================
# Parse Job Description
# ==========================================================

def parse_job_node(
    state: JobAgentState,
) -> dict:

    print(
        "\n========== NODE: PARSE JOB =========="
    )

    job_description = (
        JobDescriptionLLMParser.parse(
            state["job_description_text"]
        )
    )

    print(
        "Job description parsed successfully."
    )

    return {
        "job_description": job_description,
    }


# ==========================================================
# Match Resume With Job
# ==========================================================

def match_resume_node(
    state: JobAgentState,
) -> dict:

    print(
        "\n========== NODE: MATCH RESUME =========="
    )

    match = ResumeJobMatcher.match(
        state["resume"],
        state["job_description"],
    )

    similarity = (
        SimilarityCalculator.percentage(
            state["resume"],
            state["job_description"],
        )
    )

    match_score = match.match_score

    print(
        f"Match Score: {match_score}"
    )

    print(
        f"Similarity: {similarity}"
    )

    print("\nMatched Skills:")
    print(match.matched_skills)

    print("\nMissing Skills:")
    print(match.missing_skills)

    return {
        "match": match,
        "match_score": match_score,
        "similarity": similarity,
    }


# ==========================================================
# Tailor Resume
# ==========================================================

def tailor_resume_node(
    state: JobAgentState,
) -> dict:

    print(
        "\n========== NODE: TAILOR RESUME =========="
    )

    # ------------------------------------------
    # Existing retry count
    # ------------------------------------------

    retry_count = state.get(
        "tailor_retry_count",
        0,
    )

    print(
        f"Tailor attempt: {retry_count + 1}"
    )

    # ------------------------------------------
    # Generate
    # ------------------------------------------

    tailored_resume = (
        ResumeTailor.tailor(
            state["resume"],
            state["job_description_text"],
        )
    )

    # ------------------------------------------
    # Validate
    # ------------------------------------------

    print(
        "\nValidating tailored resume..."
    )

    validated_resume = (
        GroundingValidator.validate_tailored_resume(
            state["resume"],
            tailored_resume,
        )
    )

    # ------------------------------------------
    # Determine validation status
    # ------------------------------------------

    validation_errors = []

    # ------------------------------------------
    # Improved Skills
    # ------------------------------------------

    original_skills = {
        skill.lower().strip()
        for skills in state["resume"].skills.values()
        for skill in skills
    }

    invalid_skills = [
        skill
        for skill in tailored_resume.improved_skills
        if skill.lower().strip()
        not in original_skills
    ]

    if invalid_skills:

        validation_errors.append(
            "Unsupported skills: "
            + ", ".join(invalid_skills)
        )

    # ------------------------------------------
    # Project Titles
    # ------------------------------------------

    project_titles = {
        project.title.lower().strip()
        for project in state["resume"].projects
        if project.title
    }

    invalid_projects = [
        project.title
        for project in tailored_resume.project_improvements
        if project.title.lower().strip()
        not in project_titles
    ]

    if invalid_projects:

        validation_errors.append(
            "Unsupported projects: "
            + ", ".join(invalid_projects)
        )

    # ------------------------------------------
    # Companies
    # ------------------------------------------

    company_names = {
        experience.company.lower().strip()
        for experience in state["resume"].experience
        if experience.company
    }

    invalid_companies = [
        experience.company
        for experience
        in tailored_resume.experience_improvements
        if experience.company.lower().strip()
        not in company_names
    ]

    if invalid_companies:

        validation_errors.append(
            "Unsupported companies: "
            + ", ".join(invalid_companies)
        )

    # ------------------------------------------
    # Validation Result
    # ------------------------------------------

    validated = not validation_errors

    print(
        f"Tailored Resume Validated: {validated}"
    )

    if validation_errors:

        print(
            "\n========== TAILORING ERRORS =========="
        )

        for error in validation_errors:
            print(f"- {error}")

        print(
            "======================================"
        )

    else:

        print(
            "No structural grounding errors found."
        )

    # ------------------------------------------
    # Increment Retry Counter
    # ------------------------------------------

    next_retry_count = retry_count

    if not validated:
        next_retry_count += 1

    return {
        "tailored_resume": validated_resume,

        "tailored_resume_validated": validated,

        "tailor_retry_count": next_retry_count,

        "tailoring_validation_errors": (
            validation_errors
        ),
    }


# ==========================================================
# Generate Cover Letter
# ==========================================================

def generate_cover_letter_node(
    state: JobAgentState,
) -> dict:

    print(
        "\n========== NODE: GENERATE COVER LETTER =========="
    )

    # ------------------------------------------
    # Existing retry count
    # ------------------------------------------

    retry_count = state.get(
        "cover_letter_retry_count",
        0,
    )

    print(
        f"Cover letter attempt: {retry_count + 1}"
    )

    # ------------------------------------------
    # Previous validation feedback
    # ------------------------------------------

    validation_errors = state.get(
        "cover_letter_validation_errors",
        [],
    )

    validation_feedback = "\n".join(
        validation_errors
    )

    if validation_feedback:

        print(
            "\n========== PREVIOUS VALIDATION FEEDBACK =========="
        )

        for error in validation_errors:
            print(f"- {error}")

        print(
            "===================================================="
        )

    # ------------------------------------------
    # Generate
    # ------------------------------------------

    cover_letter = (
        CoverLetterGenerator.generate(
            state["resume"],
            state["job_description_text"],
            validation_feedback=validation_feedback,
        )
    )

    # ------------------------------------------
    # Validate
    # ------------------------------------------

    print(
        "\nValidating cover letter..."
    )

    (
        validated_cover_letter,
        validation_errors,
    ) = GroundingValidator.validate_cover_letter(
        state["resume"],
        cover_letter,
    )

    validated = not validation_errors

    # ------------------------------------------
    # Print Validation Result
    # ------------------------------------------

    print(
        f"Cover Letter Validated: {validated}"
    )

    if validation_errors:

        print(
            "\n========== COVER LETTER ERRORS =========="
        )

        for error in validation_errors:
            print(f"- {error}")

        print(
            "========================================="
        )

    else:

        print(
            "No grounding errors found."
        )

    # ------------------------------------------
    # Retry Counter
    # ------------------------------------------

    next_retry_count = retry_count

    if not validated:
        next_retry_count += 1

    # ------------------------------------------
    # Return State
    # ------------------------------------------

    return {
        "cover_letter": validated_cover_letter,

        "cover_letter_validated": validated,

        "cover_letter_retry_count": (
            next_retry_count
        ),

        "cover_letter_validation_errors": (
            validation_errors
        ),
    }