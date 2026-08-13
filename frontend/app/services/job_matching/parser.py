import re

from app.schemas.job_description import JobDescription
from app.services.job_matching.keyword_extractor import KeywordExtractor


class JobDescriptionParser:

    RESPONSIBILITY_HEADERS = [
        "responsibilities",
        "job responsibilities",
        "key responsibilities",
        "what you'll do",
        "what you will do",
    ]

    REQUIREMENT_HEADERS = [
        "requirements",
        "required qualifications",
        "minimum qualifications",
        "basic qualifications",
        "qualifications",
    ]

    PREFERRED_HEADERS = [
        "preferred qualifications",
        "preferred skills",
        "nice to have",
        "good to have",
    ]

    @classmethod
    def parse(cls, text: str) -> JobDescription:

        if not text.strip():
            return JobDescription()

        job = JobDescription()

        # --------------------------------
        # Normalize newlines
        # --------------------------------

        text = text.replace("\r", "\n")

        # Put headings on their own line
        headings = (
            cls.RESPONSIBILITY_HEADERS
            + cls.REQUIREMENT_HEADERS
            + cls.PREFERRED_HEADERS
        )

        for heading in headings:
            text = re.sub(
                rf"(?i)\s*{re.escape(heading)}\s*:",
                f"\n{heading.title()}:\n",
                text,
            )

        # Every bullet gets its own line
        text = re.sub(
            r"\s*-\s*",
            "\n- ",
            text,
        )

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        if lines:
            job.title = lines[0]

        current = None

        for line in lines:

            lower = line.lower().rstrip(":")

            if lower in cls.RESPONSIBILITY_HEADERS:
                current = "responsibilities"
                continue

            if lower in cls.REQUIREMENT_HEADERS:
                current = "requirements"
                continue

            if lower in cls.PREFERRED_HEADERS:
                current = "preferred"
                continue

            if line.startswith("-"):

                bullet = line[1:].strip()

                if current == "responsibilities":
                    job.responsibilities.append(bullet)

                elif current == "requirements":
                    job.qualifications.append(bullet)

                elif current == "preferred":
                    job.preferred_skills.append(bullet)

                continue

            if current == "responsibilities" and job.responsibilities:
                job.responsibilities[-1] += " " + line

            elif current == "requirements" and job.qualifications:
                job.qualifications[-1] += " " + line

            elif current == "preferred" and job.preferred_skills:
                job.preferred_skills[-1] += " " + line

        job.summary = ""

        blob = "\n".join(
            job.qualifications
            + job.preferred_skills
            + job.responsibilities
        )

        job.required_skills = sorted(
            KeywordExtractor.extract_text_keywords(blob)
        )

        return job