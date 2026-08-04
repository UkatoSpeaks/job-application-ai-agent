import re

from app.schemas.resume import ParsedResume
from app.schemas.job_description import JobDescription


class KeywordExtractor:

    STOPWORDS = {
        "and",
        "or",
        "with",
        "using",
        "the",
        "a",
        "an",
        "to",
        "of",
        "for",
        "in",
        "on",
        "at",
        "by",
        "from",
        "is",
        "are",
        "be",
        "as",
        "will",
        "should",
        "have",
        "has",
        "our",
        "your",
        "their",
        "this",
        "that",
        "into",
        "across",
        "through",
    }

    @classmethod
    def extract_resume_keywords(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        keywords = set()

        # -----------------------------
        # Skills
        # -----------------------------
        for skill_list in resume.skills.values():

            for skill in skill_list:
                keywords.add(skill.lower())

        # -----------------------------
        # Experience Tech Stack
        # -----------------------------
        for exp in resume.experience:

            for tech in exp.tech_stack:
                keywords.add(tech.lower())

        # -----------------------------
        # Project Tech Stack
        # -----------------------------
        for project in resume.projects:

            for tech in project.tech_stack:
                keywords.add(tech.lower())

        # -----------------------------
        # Summary
        # -----------------------------
        if resume.summary:

            keywords.update(
                cls.extract_text_keywords(
                    resume.summary
                )
            )

        return keywords

    @classmethod
    def extract_job_keywords(
        cls,
        job: JobDescription,
    ) -> set[str]:

        keywords = set()

        # -----------------------------
        # Required Skills
        # -----------------------------
        for skill in job.required_skills:
            keywords.add(skill.lower())

        # -----------------------------
        # Preferred Skills
        # -----------------------------
        for skill in job.preferred_skills:
            keywords.add(skill.lower())

        # -----------------------------
        # Responsibilities
        # -----------------------------
        for responsibility in job.responsibilities:

            keywords.update(
                cls.extract_text_keywords(
                    responsibility
                )
            )

        # -----------------------------
        # Qualifications
        # -----------------------------
        for qualification in job.qualifications:

            keywords.update(
                cls.extract_text_keywords(
                    qualification
                )
            )

        return keywords

    @classmethod
    def extract_text_keywords(
        cls,
        text: str,
    ) -> set[str]:

        words = re.findall(
            r"[A-Za-z0-9.+#-]+",
            text.lower(),
        )

        return {
            word
            for word in words
            if (
                len(word) > 2
                and word not in cls.STOPWORDS
            )
        }