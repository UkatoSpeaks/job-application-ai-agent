import re

from app.schemas.resume import ParsedResume
from app.schemas.job_description import JobDescription
from app.services.job_matching.constants import TECH_KEYWORDS


class KeywordExtractor:

    # ==========================================================
    # Normalization
    # ==========================================================

    @staticmethod
    def normalize(text: str) -> str:

        text = text.lower().strip()

        text = text.replace("reactjs", "react")
        text = text.replace("node.js", "node")
        text = text.replace("express.js", "express")
        text = text.replace("rest apis", "rest api")
        text = text.replace("restful apis", "rest api")
        text = text.replace("restful api", "rest api")

        return re.sub(
            r"[^\w.+#-]",
            " ",
            text,
        )

    # ==========================================================
    # Resume Keywords
    # ==========================================================

    @classmethod
    def extract_resume_keywords(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        keywords = set()

        # ------------------------------------------
        # Skills
        # ------------------------------------------

        for skills in resume.skills.values():

            for skill in skills:

                keywords.add(
                    cls.normalize(skill)
                )

        # ------------------------------------------
        # Experience
        # ------------------------------------------

        for exp in resume.experience:

            for tech in exp.tech_stack:

                keywords.add(
                    cls.normalize(tech)
                )

            for line in exp.responsibilities:

                keywords.update(
                    cls.extract_text_keywords(line)
                )

        # ------------------------------------------
        # Projects
        # ------------------------------------------

        for project in resume.projects:

            for tech in project.tech_stack:

                keywords.add(
                    cls.normalize(tech)
                )

            for line in project.description:

                keywords.update(
                    cls.extract_text_keywords(line)
                )

        # ------------------------------------------
        # Certifications
        # ------------------------------------------

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

        # ------------------------------------------
        # Summary
        # ------------------------------------------

        if resume.summary:

            keywords.update(
                cls.extract_text_keywords(
                    resume.summary
                )
            )

        return keywords

    # ==========================================================
    # Job Keywords
    # ==========================================================

    @classmethod
    def extract_job_keywords(
        cls,
        job: JobDescription,
    ) -> set[str]:

        keywords = set()

        # ------------------------------------------
        # Required Skills
        # ------------------------------------------

        for skill in job.required_skills:

            keywords.update(
                cls.extract_text_keywords(skill)
            )

        # ------------------------------------------
        # Preferred Skills
        # ------------------------------------------

        for skill in job.preferred_skills:

            keywords.update(
                cls.extract_text_keywords(skill)
            )

        # ------------------------------------------
        # Responsibilities
        # ------------------------------------------

        for responsibility in job.responsibilities:

            keywords.update(
                cls.extract_text_keywords(
                    responsibility
                )
            )

        # ------------------------------------------
        # Qualifications
        # ------------------------------------------

        for qualification in job.qualifications:

            keywords.update(
                cls.extract_text_keywords(
                    qualification
                )
            )

        return keywords

    # ==========================================================
    # Extract Technical Keywords
    # ==========================================================

    @classmethod
    def extract_text_keywords(
        cls,
        text: str,
    ) -> set[str]:

        normalized = cls.normalize(text)

        found = set()

        for keyword in TECH_KEYWORDS:

            normalized_keyword = cls.normalize(
                keyword
            )

            # --------------------------------------
            # Word/phrase boundary matching
            # --------------------------------------

            pattern = (
                r"(?<!\w)"
                + re.escape(normalized_keyword)
                + r"(?!\w)"
            )

            if re.search(
                pattern,
                normalized,
            ):

                found.add(
                    normalized_keyword
                )

        return found