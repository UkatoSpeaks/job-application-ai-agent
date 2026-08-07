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

        # ----------------------------
        # Resume Skills
        # ----------------------------
        for skills in resume.skills.values():
            for skill in skills:
                keywords.add(skill.lower())

        # ----------------------------
        # Experience
        # ----------------------------
        for exp in resume.experience:

            for tech in exp.tech_stack:
                keywords.add(tech.lower())

            for line in exp.responsibilities:
                keywords.update(
                    cls.extract_text_keywords(line)
                )

        # ----------------------------
        # Projects
        # ----------------------------
        for project in resume.projects:

            for tech in project.tech_stack:
                keywords.add(tech.lower())

            for line in project.description:
                keywords.update(
                    cls.extract_text_keywords(line)
                )

        # ----------------------------
        # Certifications
        # ----------------------------
        for cert in resume.certifications:

            if cert.title:
                keywords.update(
                    cls.extract_text_keywords(
                        cert.title
                    )
                )

            for line in cert.description:
                keywords.update(
                    cls.extract_text_keywords(line)
                )

        # ----------------------------
        # Summary
        # ----------------------------
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