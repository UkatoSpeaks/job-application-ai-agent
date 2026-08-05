from app.schemas.resume import ParsedResume
from app.schemas.job_description import JobDescription

from app.services.job_matching.keyword_extractor import (
    KeywordExtractor,
)


class SimilarityCalculator:

    @classmethod
    def calculate(
        cls,
        resume: ParsedResume,
        job: JobDescription,
    ) -> float:

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

        if not resume_keywords or not job_keywords:
            return 0.0

        intersection = (
            resume_keywords.intersection(
                job_keywords
            )
        )

        union = (
            resume_keywords.union(
                job_keywords
            )
        )

        similarity = (
            len(intersection) / len(union)
        )

        return round(similarity, 2)

    @classmethod
    def percentage(
        cls,
        resume: ParsedResume,
        job: JobDescription,
    ) -> int:

        return int(
            cls.calculate(
                resume,
                job,
            ) * 100
        )