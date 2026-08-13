from app.schemas.resume import ParsedResume
from app.schemas.job_description import JobDescription

from app.services.job_matching.keyword_extractor import (
    KeywordExtractor,
)
from app.services.job_matching.matcher import ResumeJobMatcher


class SimilarityCalculator:

    @classmethod
    def calculate(
        cls,
        resume: ParsedResume,
        job: JobDescription,
    ) -> float:

        # ---------------------------------
        # Extract Keywords
        # ---------------------------------

        resume_keywords = (
            KeywordExtractor.extract_resume_keywords(
                resume
            )
        )

        job_keywords = (
            KeywordExtractor.extract_job_keywords(
                job
            )
        )

        # ---------------------------------
        # Normalize Keywords
        # ---------------------------------

        resume_keywords = {
            ResumeJobMatcher.normalize_skill(
                keyword
            )
            for keyword in resume_keywords
        }

        job_keywords = {
            ResumeJobMatcher.normalize_skill(
                keyword
            )
            for keyword in job_keywords
        }

        # ---------------------------------
        # Empty Job
        # ---------------------------------

        if not job_keywords:
            return 0.0

        # ---------------------------------
        # Calculate Similarity
        # ---------------------------------

        matched = resume_keywords.intersection(
            job_keywords
        )

        similarity = (
            len(matched) / len(job_keywords)
        )

        return round(similarity, 2)

    @classmethod
    def percentage(
        cls,
        resume: ParsedResume,
        job: JobDescription,
    ) -> int:

        return round(
            cls.calculate(
                resume,
                job,
            ) * 100
        )