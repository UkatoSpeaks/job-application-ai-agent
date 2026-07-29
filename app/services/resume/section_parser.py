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
    def parse(cls, text: str) -> dict[str, str]:
        sections = {}

        current_section = "Header"
        sections[current_section] = []

        for line in text.splitlines():

            line = line.strip()

            if not line:
                continue

            normalized = line.lower().rstrip(":")

            if normalized in cls.SECTION_ALIASES:
                current_section = cls.SECTION_ALIASES[normalized]
                sections.setdefault(current_section, [])
                continue

            sections[current_section].append(line)

        return {
            key: "\n".join(value)
            for key, value in sections.items()
        }