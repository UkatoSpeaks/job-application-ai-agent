from typing import TypedDict

from app.schemas.resume import ParsedResume
from app.schemas.job_description import JobDescription
from app.schemas.match import ResumeJobMatch
from app.schemas.tailor import ResumeTailorResponse
from app.schemas.cover_letter import CoverLetterResponse


class JobAgentState(TypedDict, total=False):

    # ---------------------------------
    # Input
    # ---------------------------------

    resume_text: str
    job_description_text: str

    # ---------------------------------
    # Parsed Data
    # ---------------------------------

    resume: ParsedResume
    job_description: JobDescription

    # ---------------------------------
    # Matching
    # ---------------------------------

    match: ResumeJobMatch
    match_score: int
    similarity: int

    # ---------------------------------
    # AI Outputs
    # ---------------------------------

    tailored_resume: ResumeTailorResponse
    cover_letter: CoverLetterResponse

    # ---------------------------------
    # Validation
    # ---------------------------------

    tailored_resume_validated: bool
    cover_letter_validated: bool

    # ---------------------------------
    # Retry Control
    # ---------------------------------

    tailor_retry_count: int
    cover_letter_retry_count: int

    # ---------------------------------
    # Validation Errors
    # ---------------------------------

    tailoring_validation_errors: list[str]
    cover_letter_validation_errors: list[str]