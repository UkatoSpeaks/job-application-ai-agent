import re

from app.schemas.resume import Education


class EducationParser:

    YEAR_PATTERN = re.compile(
        r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).*"
    )

    @classmethod
    def parse(cls, text: str) -> list[Education]:

        if not text:
            return []

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        education = []

        i = 0

        while i < len(lines):

            institution = lines[i]

            location = None
            degree = None
            duration = None

            if i + 1 < len(lines):
                location = lines[i + 1]

            if i + 2 < len(lines):
                degree = lines[i + 2]

            if i + 3 < len(lines):
                duration = lines[i + 3]

            education.append(
                Education(
                    institution=institution,
                    location=location,
                    degree=degree,
                    duration=duration,
                )
            )

            i += 4

        return education