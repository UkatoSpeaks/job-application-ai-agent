import re


class SectionParser:

    SECTION_ALIASES = {
        "summary": [
            "summary",
            "professional summary",
            "profile",
            "career objective",
            "objective",
            "about me",
        ],

        "education": [
            "education",
            "academic background",
            "academic qualifications",
            "education & training",
        ],

        "skills": [
            "technical skills",
            "skills",
            "technical expertise",
            "core competencies",
            "technologies",
            "tech stack",
        ],

        "experience": [
            "experience",
            "work experience",
            "professional experience",
            "employment history",
            "employment",
            "internships",
        ],

        "projects": [
            "projects",
            "project",
            "personal projects",
            "selected projects",
            "academic projects",
        ],

        "certifications": [
            "certifications",
            "certification",
            "licenses",
            "licenses & certifications",
            "certifications & achievements",
            "achievements",
        ],
    }

    # -----------------------------

    NORMALIZED_HEADINGS = {}

    for canonical, aliases in SECTION_ALIASES.items():
        for alias in aliases:
            NORMALIZED_HEADINGS[alias] = canonical.title()

    # -----------------------------

    @classmethod
    def normalize_heading(cls, line: str) -> str:

        line = line.strip()

        line = re.sub(r"[-_=]{2,}", "", line)

        line = re.sub(r"\s+", " ", line)

        line = line.rstrip(":|-")

        return line.lower()

    # -----------------------------

    @classmethod
    def parse(cls, text: str):

        sections = {
            "Header": []
        }

        current = "Header"

        for raw_line in text.splitlines():

            line = raw_line.strip()

            if not line:
                continue

            heading = cls.normalize_heading(line)

            if heading in cls.NORMALIZED_HEADINGS:

                current = cls.NORMALIZED_HEADINGS[heading]

                sections.setdefault(current, [])

                continue

            sections.setdefault(current, []).append(line)

        return {
            section: "\n".join(content).strip()
            for section, content in sections.items()
        }