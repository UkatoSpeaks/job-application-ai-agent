import re
from app.schemas.resume import Project


class ProjectParser:
    MONTHS = (
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    )

    TITLE_PATTERN = re.compile(r"^.+?\s+[–-]\s+.+$")

    @classmethod
    def parse(cls, text: str) -> list[Project]:

        if not text.strip():
            return []

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        projects = []
        current = None

        for line in lines:

            # ---------------------------------------------------
            # New Project
            # ---------------------------------------------------
            if cls.TITLE_PATTERN.match(line) and not any(
                line.startswith(month) for month in cls.MONTHS
            ):

                if current:
                    projects.append(current)

                title, subtitle = re.split(
                    r"\s+[–-]\s+",
                    line,
                    maxsplit=1
                )

                current = Project(
                    title=title.strip(),
                    subtitle=subtitle.strip(),
                )

                continue

            if current is None:
                continue

            # ---------------------------------------------------
            # Duration
            # ---------------------------------------------------
            if any(line.startswith(month) for month in cls.MONTHS):
                current.duration = line
                continue

            # ---------------------------------------------------
            # Bullet
            # ---------------------------------------------------
            if re.match(r"^[•\-–—]", line):

                bullet = re.sub(r"^[•\-–—]\s*", "", line)

                # Tech Stack
                if "|" in bullet:

                    parts = [p.strip() for p in bullet.split("|")]

                    current.tech_stack = [
                        tech.strip()
                        for tech in parts[0].split(",")
                        if tech.strip()
                    ]

                    current.links = [
                        p
                        for p in parts[1:]
                        if p
                    ]

                else:
                    current.description.append(bullet)

                continue

            # ---------------------------------------------------
            # Wrapped description line
            # ---------------------------------------------------
            if current.description:
                current.description[-1] += " " + line

        if current:
            projects.append(current)

        return projects