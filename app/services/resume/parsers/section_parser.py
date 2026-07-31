import re


class SectionParser:

    SECTION_ALIASES = {
        "summary": "Summary",
        "education": "Education",
        "technical skills": "Technical Skills",
        "skills": "Technical Skills",
        "experience": "Experience",
        "work experience": "Experience",
        "projects": "Projects",
        "project": "Projects",
        "certifications": "Certifications",
        "certifications & achievements": "Certifications",
        "achievements": "Certifications",
    }

    @classmethod
    def parse(cls, text: str):

        sections = {}
        current = "Header"
        sections[current] = []

        for raw_line in text.splitlines():

            line = raw_line.strip()

            if not line:
                continue

            normalized = re.sub(r"\s+", " ", line)
            normalized = normalized.strip().lower().rstrip(":")

            if normalized in cls.SECTION_ALIASES:
                current = cls.SECTION_ALIASES[normalized]

                if current not in sections:
                    sections[current] = []

                continue

            sections[current].append(line)

        return {
            k: "\n".join(v)
            for k, v in sections.items()
        }