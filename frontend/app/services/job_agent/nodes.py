from app.services.job_agent.state import JobAgentState

from app.services.browser.job_page import (
    JobPageExtractor,
)

from app.services.job_matching.llm_parser import (
    JobDescriptionLLMParser,
)

from app.services.resume.parser import (
    ResumeParser,
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

from app.services.job_matching.grounding import (
    GroundingValidator,
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
# Extract Job Page
# ==========================================================

async def extract_job_page_node(
    state: JobAgentState,
) -> dict:

    print(
        "\n========== NODE: EXTRACT JOB PAGE =========="
    )

    job_url = state.get("job_url")

    if not job_url:
        raise ValueError(
            "job_url is required for "
            "browser-based job extraction."
        )

    print(
        f"Job URL: {job_url}"
    )

    job_page = await JobPageExtractor.extract(
        job_url
    )

    print(
        "\nJob page extracted successfully."
    )

    print(
        f"Page URL: {job_page.url}"
    )

    print(
        f"Characters: "
        f"{len(job_page.job_description)}"
    )

    return {
        "job_page": job_page,
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

    # ------------------------------------------
    # Determine job input
    # ------------------------------------------

    job_description_text = state.get(
        "job_description_text"
    )

    job_page = state.get(
        "job_page"
    )

    # ------------------------------------------
    # Job URL flow
    # ------------------------------------------

    if job_page:

        print(
            "Using job description extracted "
            "from browser."
        )

        job_description_text = (
            job_page.job_description
        )

    # ------------------------------------------
    # Validate input
    # ------------------------------------------

    if not job_description_text:

        raise ValueError(
            "No job description available."
        )

    # ------------------------------------------
    # Parse with LLM
    # ------------------------------------------

    job_description = (
        JobDescriptionLLMParser.parse(
            job_description_text
        )
    )

    print(
        "\nJob description parsed successfully."
    )

    print(
        f"Title: {job_description.title}"
    )

    print(
        f"Company: {job_description.company}"
    )

    print(
        f"Location: {job_description.location}"
    )

    return {
        "job_description": job_description,

        # Keep the extracted/manual text in state.
        "job_description_text": (
            job_description_text
        ),
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

    # ------------------------------------------
    # Resume ↔ Job Match
    # ------------------------------------------

    match = ResumeJobMatcher.match(
        state["resume"],
        state["job_description"],
    )

    # ------------------------------------------
    # Semantic Similarity
    # ------------------------------------------

    similarity = (
        SimilarityCalculator.percentage(
            state["resume"],
            state["job_description"],
        )
    )

    match_score = match.match_score

    # ------------------------------------------
    # Print Match Results
    # ------------------------------------------

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

    # ------------------------------------------
    # Keyword Results
    #
    # Your current ResumeJobMatch schema does
    # not appear to expose these fields.
    #
    # Therefore use hasattr() so the graph
    # doesn't crash if they aren't present.
    # ------------------------------------------

    if hasattr(match, "matched_keywords"):

        print("\nMatched Keywords:")
        print(match.matched_keywords)

    else:

        print(
            "\nMatched Keywords:"
        )
        print(
            "Not available in ResumeJobMatch schema."
        )

    if hasattr(match, "missing_keywords"):

        print("\nMissing Keywords:")
        print(match.missing_keywords)

    else:

        print(
            "\nMissing Keywords:"
        )
        print(
            "Not available in ResumeJobMatch schema."
        )

    # ------------------------------------------
    # Return State
    # ------------------------------------------

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
    # Retry count
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

    tailored_resume = ResumeTailor.tailor(
        state["resume"],
        state["job_description_text"],
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

    print(
        "Tailored resume validation completed."
    )

    # ------------------------------------------
    # Validation
    # ------------------------------------------

    validation_errors = []

    # ------------------------------------------
    # Resume skills
    #
    # Use GroundingValidator.get_resume_skills()
    # so skills from:
    #
    # 1. Resume skills
    # 2. Experience tech stack
    # 3. Project tech stack
    #
    # are all recognized.
    # ------------------------------------------

    original_skills = (
        GroundingValidator.get_resume_skills(
            state["resume"]
        )
    )

    invalid_skills = [
        skill
        for skill in validated_resume.improved_skills
        if GroundingValidator.normalize(
            skill
        ) not in original_skills
    ]

    if invalid_skills:

        validation_errors.append(
            "Unsupported skills: "
            + ", ".join(invalid_skills)
        )

    # ------------------------------------------
    # Project validation
    # ------------------------------------------

    project_titles = (
        GroundingValidator.get_project_titles(
            state["resume"]
        )
    )

    invalid_projects = [
        project.title
        for project
        in validated_resume.project_improvements
        if GroundingValidator.normalize(
            project.title
        ) not in project_titles
    ]

    if invalid_projects:

        validation_errors.append(
            "Unsupported projects: "
            + ", ".join(invalid_projects)
        )

    # ------------------------------------------
    # Company validation
    # ------------------------------------------

    company_names = (
        GroundingValidator.get_companies(
            state["resume"]
        )
    )

    invalid_companies = [
        experience.company
        for experience
        in validated_resume.experience_improvements
        if GroundingValidator.normalize(
            experience.company
        ) not in company_names
    ]

    if invalid_companies:

        validation_errors.append(
            "Unsupported companies: "
            + ", ".join(invalid_companies)
        )

    # ------------------------------------------
    # Validation result
    # ------------------------------------------

    validated = not validation_errors

    print(
        f"Tailored Resume Validated: {validated}"
    )

    if validation_errors:

        print(
            "\nValidation Errors:"
        )

        for error in validation_errors:

            print(
                f"- {error}"
            )

    else:

        print(
            "No structural grounding errors found."
        )

    # ------------------------------------------
    # Retry count
    # ------------------------------------------

    next_retry_count = retry_count

    if not validated:

        next_retry_count += 1

    return {
        "tailored_resume": validated_resume,

        "tailored_resume_validated": (
            validated
        ),

        "tailor_retry_count": (
            next_retry_count
        ),

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
    # Retry count
    # ------------------------------------------

    retry_count = state.get(
        "cover_letter_retry_count",
        0,
    )

    print(
        f"Cover letter attempt: {retry_count + 1}"
    )

    # ------------------------------------------
    # Generate
    # ------------------------------------------

    cover_letter = (
        CoverLetterGenerator.generate(
            state["resume"],
            state["job_description_text"],
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
    # Print validation result
    # ------------------------------------------

    print(
        f"Cover Letter Validated: {validated}"
    )

    if validation_errors:

        print(
            "\n========== COVER LETTER ERRORS =========="
        )

        for error in validation_errors:

            print(
                f"- {error}"
            )

        print(
            "========================================="
        )

    else:

        print(
            "No grounding errors found."
        )

    # ------------------------------------------
    # Retry count
    # ------------------------------------------

    next_retry_count = retry_count

    if not validated:

        next_retry_count += 1

    return {
        "cover_letter": validated_cover_letter,

        "cover_letter_validated": (
            validated
        ),

        "cover_letter_retry_count": (
            next_retry_count
        ),

        "cover_letter_validation_errors": (
            validation_errors
        ),
    }