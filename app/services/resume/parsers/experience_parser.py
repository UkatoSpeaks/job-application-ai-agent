import re

from app.schemas.resume import Experience
from app.services.resume.constants import TECH_STACK


class ExperienceParser:

    MONTHS = (
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    )

    DATE_PATTERN = re.compile(
        r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+[–-]\s+.+$"
    )

    @classmethod
    def parse(cls, text: str) -> list[Experience]:

        if not text.strip():
            return []

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        experiences = []
        current = None

        for line in lines:

            # ---------------------------------------------------
            # New Experience
            # ---------------------------------------------------
            if current is None:

                current = Experience(company=line)

                continue

            # ---------------------------------------------------
            # Duration
            # ---------------------------------------------------
            if cls.DATE_PATTERN.match(line):

                current.duration = line

                continue

            # ---------------------------------------------------
            # Bullet Point
            # ---------------------------------------------------
            if re.match(r"^[•\-–—]", line):

                bullet = re.sub(r"^[•\-–—]\s*", "", line)

                current.responsibilities.append(bullet)

                continue

            # ---------------------------------------------------
            # Wrapped Bullet
            # ---------------------------------------------------
            if current.responsibilities:

                current.responsibilities[-1] += " " + line

                continue

            # ---------------------------------------------------
            # Role
            # ---------------------------------------------------
            if current.role is None:

                current.role = line

                continue

            # ---------------------------------------------------
            # Location
            # ---------------------------------------------------
            if current.location is None:

                current.location = line

                continue

            # ---------------------------------------------------
            # New Company
            # ---------------------------------------------------
            experiences.append(current)

            current = Experience(company=line)

        if current:
            experiences.append(current)

        # -------------------------------------------------------
        # Detect Tech Stack
        # -------------------------------------------------------
        for exp in experiences:

            found = set()

            for bullet in exp.responsibilities:

                for tech in TECH_STACK:

                    if tech.lower() in bullet.lower():

                        found.add(tech)

            exp.tech_stack = sorted(found)

        return experiences