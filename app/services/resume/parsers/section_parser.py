import re


class SectionParser:

    SECTION_ALIASES = {
        "Summary": [
            "summary",
            "professional summary",
            "profile",
            "career objective",
            "objective",
            "about me",
        ],

        "Education": [
            "education",
            "academic background",
            "academic qualifications",
            "education & training",
        ],

        "Technical Skills": [
            "technical skills",
            "skills",
            "technical expertise",
            "core competencies",
            "technologies",
            "tech stack",
        ],

        "Experience": [
            "experience",
            "work experience",
            "professional experience",
            "employment history",
            "employment",
            "internships",
        ],

        "Projects": [
            "projects",
            "project",
            "personal projects",
            "selected projects",
            "academic projects",
        ],

        "Certifications": [
            "certifications",
            "certification",
            "licenses",
            "licenses & certifications",
            "certifications & achievements",
            "achievements",
        ],
    }

    NORMALIZED_HEADINGS = {}

    for canonical, aliases in SECTION_ALIASES.items():
        for alias in aliases:
            NORMALIZED_HEADINGS[alias] = canonical

    @classmethod
    def normalize_heading(cls, line: str) -> str:

        line = line.strip()

        line = re.sub(r"[-_=]{2,}", "", line)
        line = re.sub(r"\s+", " ", line)

        line = line.rstrip(":|-")

        return line.lower()

    @classmethod
    def parse(cls, text: str) -> dict[str, str]:

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

            sections[current].append(line)

        return {
            key: "\n".join(value).strip()
            for key, value in sections.items()
        }