import re

from app.schemas.resume import Experience
from app.services.resume.constants import TECH_STACK


class ExperienceParser:

    DATE_PATTERN = re.compile(
        r"^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\s+[–-]\s+.+$",
        re.IGNORECASE,
    )

    BULLET_PATTERN = re.compile(r"^[•\-–—]\s*")

    @classmethod
    def parse(cls, text: str) -> list[Experience]:

        if not text.strip():
            return []

        raw_lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        # -------------------------------------------------
        # Merge wrapped bullet lines
        # -------------------------------------------------

        lines = []

        for line in raw_lines:

            if cls.BULLET_PATTERN.match(line):
                lines.append(line)
                continue

            if (
                lines
                and cls.BULLET_PATTERN.match(lines[-1])
                and not cls.DATE_PATTERN.match(line)
            ):
                lines[-1] += " " + line
                continue

            lines.append(line)

        print("\n===== EXPERIENCE LINES =====")
        for i, line in enumerate(lines):
            print(i, repr(line))
        print("============================\n")

        experiences = []

        i = 0

        while i < len(lines):

            # Need company + location + role + duration
            if i + 3 >= len(lines):
                break

            company = lines[i]
            location = lines[i + 1]
            role = lines[i + 2]
            duration = lines[i + 3]

            if not cls.DATE_PATTERN.match(duration):
                i += 1
                continue

            exp = Experience(
                company=company,
                location=location,
                role=role,
                duration=duration,
            )

            i += 4

            # Collect bullet points
            while i < len(lines):

                line = lines[i]

                # Next experience begins
                if (
                    i + 3 < len(lines)
                    and cls.DATE_PATTERN.match(lines[i + 3])
                    and not cls.BULLET_PATTERN.match(line)
                ):
                    break

                if cls.BULLET_PATTERN.match(line):

                    bullet = cls.BULLET_PATTERN.sub("", line).strip()

                    exp.responsibilities.append(bullet)

                i += 1

            # Detect tech stack
            found = set()

            for bullet in exp.responsibilities:

                lower = bullet.lower()

                for tech in TECH_STACK:

                    if tech.lower() in lower:
                        found.add(tech)

            exp.tech_stack = sorted(found)

            experiences.append(exp)

        print("\n===== PARSED EXPERIENCES =====")
        for exp in experiences:
            print(exp.model_dump())
        print("==============================\n")

        return experiences