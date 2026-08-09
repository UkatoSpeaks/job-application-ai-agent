from app.services.job_agent.state import JobAgentState

from app.services.resume.parser import ResumeParser
from app.services.job_matching.llm_parser import JobDescriptionLLMParser
from app.services.job_matching.matcher import ResumeJobMatcher
from app.services.job_matching.similarity import SimilarityCalculator
from app.services.resume_tailor.tailor import ResumeTailor
from app.services.cover_letter.generator import CoverLetterGenerator


# ==========================================================
# Parse Resume
# ==========================================================

def parse_resume_node(state: JobAgentState) -> dict:

    print("\n========== NODE: PARSE RESUME ==========")

    resume = ResumeParser.parse(
        state["resume_text"]
    )

    print("Resume parsed successfully.")

    return {
        "resume": resume,
    }


# ==========================================================
# Parse Job Description
# ==========================================================

def parse_job_node(state: JobAgentState) -> dict:

    print("\n========== NODE: PARSE JOB ==========")

    job_description = JobDescriptionLLMParser.parse(
        state["job_description_text"]
    )

    print("Job description parsed successfully.")

    return {
        "job_description": job_description,
    }


# ==========================================================
# Match Resume With Job
# ==========================================================

def match_resume_node(state: JobAgentState) -> dict:

    print("\n========== NODE: MATCH RESUME ==========")

    match = ResumeJobMatcher.match(
        state["resume"],
        state["job_description"],
    )

    similarity = SimilarityCalculator.percentage(
        state["resume"],
        state["job_description"],
    )

    match_score = match.match_score

    print(f"Match Score: {match_score}")
    print(f"Similarity: {similarity}")

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

def tailor_resume_node(state: JobAgentState) -> dict:

    print("\n========== NODE: TAILOR RESUME ==========")

    tailored_resume = ResumeTailor.tailor(
        state["resume"],
        state["job_description_text"],
    )

    print("Resume tailored successfully.")

    return {
        "tailored_resume": tailored_resume,
    }


# ==========================================================
# Generate Cover Letter
# ==========================================================

def generate_cover_letter_node(state: JobAgentState) -> dict:

    print("\n========== NODE: GENERATE COVER LETTER ==========")

    cover_letter = CoverLetterGenerator.generate(
        state["resume"],
        state["job_description_text"],
    )

    print("Cover letter generated successfully.")

    return {
        "cover_letter": cover_letter,
    }