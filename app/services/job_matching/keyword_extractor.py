import re

from app.schemas.resume import ParsedResume
from app.schemas.job_description import JobDescription
from app.services.job_matching.constants import TECH_KEYWORDS


class KeywordExtractor:

    @staticmethod
    def normalize(text: str) -> str:
        return re.sub(r"[^\w.+#-]", " ", text.lower())

    @classmethod
    def extract_resume_keywords(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        keywords = set()

        # Resume skills
        for skills in resume.skills.values():
            for skill in skills:
                keywords.add(skill.lower())

        # Experience tech stack
        for exp in resume.experience:
            for tech in exp.tech_stack:
                keywords.add(tech.lower())

        # Project tech stack
        for project in resume.projects:
            for tech in project.tech_stack:
                keywords.add(tech.lower())

        # Summary
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

        blob = "\n".join(
            job.qualifications
            + job.preferred_skills
            + job.responsibilities
        )

        return cls.extract_text_keywords(blob)

    @classmethod
    def extract_text_keywords(
        cls,
        text: str,
    ) -> set[str]:

        normalized = cls.normalize(text)

        found = set()

        for keyword in TECH_KEYWORDS:

            if keyword in normalized:
                found.add(keyword)

        return found