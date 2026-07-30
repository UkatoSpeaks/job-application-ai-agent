import re

from app.schemas.resume import Experience


class ExperienceParser:
    DATE_PATTERN = re.compile(
        r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+–\s+.+$"
    )

    @classmethod
    def parse(cls, text: str) -> list[Experience]:
        if not text:
            return []

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        experiences = []
        current = None
        state = 0

        for line in lines:

            # Company
            if current is None:
                current = Experience(company=line)
                state = 1
                continue

            # Role
            if state == 1:
                current.role = line
                state = 2
                continue

            # Location
            if state == 2 and not cls.DATE_PATTERN.match(line):
                current.location = line
                state = 3
                continue

            # Duration
            if cls.DATE_PATTERN.match(line):
                current.duration = line
                state = 4
                continue

            # Responsibilities / Tech Stack
            if state >= 4:

                cleaned = line.lstrip("•-– ").strip()

                if not cleaned:
                    continue

                # Detect tech stack if the line looks like a comma-separated list
                if (
                    "," in cleaned
                    and len(cleaned.split()) <= 12
                    and cleaned.count(",") >= 2
                ):
                    current.tech_stack = [
                        tech.strip()
                        for tech in cleaned.split(",")
                        if tech.strip()
                    ]
                else:
                    current.responsibilities.append(cleaned)

        if current:
            experiences.append(current)

        return experiences