import re

from app.schemas.resume import Project


class ProjectParser:
    TITLE_PATTERN = re.compile(
        r"^(?!Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).+?\s+–\s+.+$"
    )

    DATE_PATTERN = re.compile(
        r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+–\s+.+$"
    )

    @classmethod
    def parse(cls, text: str) -> list[Project]:
        if not text:
            return []

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        projects = []
        current = None

        for line in lines:

            # -----------------------------
            # Project Title
            # Example:
            # IndiaLand – Full-Stack Marketplace
            # -----------------------------
            if cls.TITLE_PATTERN.match(line):

                if current:
                    projects.append(current)

                title, subtitle = line.split("–", 1)

                current = Project(
                    title=title.strip(),
                    subtitle=subtitle.strip(),
                )

                continue

            if current is None:
                continue

            # -----------------------------
            # Duration
            # Example:
            # Jan 2026 – Present
            # -----------------------------
            if cls.DATE_PATTERN.match(line):
                current.duration = line.strip()
                continue

            # -----------------------------
            # Tech Stack + Links
            # Example:
            # – Next.js, Firebase | Live | Code
            # -----------------------------
            if line.startswith("–") and "|" in line:

                cleaned = line.lstrip("–").strip()

                parts = [part.strip() for part in cleaned.split("|")]

                current.tech_stack = [
                    tech.strip()
                    for tech in parts[0].split(",")
                    if tech.strip()
                ]

                if len(parts) > 1:
                    current.links = parts[1:]

                continue

            # -----------------------------
            # Description Bullet
            # -----------------------------
            if line.startswith("–"):

                current.description.append(
                    line.lstrip("–").strip()
                )

        if current:
            projects.append(current)

        return projects