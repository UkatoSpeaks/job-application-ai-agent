import re

from app.schemas.resume import Certification


class CertificationParser:
    DATE_PATTERN = re.compile(
        r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$"
    )

    CREDENTIAL_PATTERN = re.compile(
        r"Credential ID:\s*([^)]+)",
        re.IGNORECASE,
    )

    ISSUER_KEYWORDS = (
        "Oracle",
        "Udemy",
        "Coursera",
        "Google",
        "Microsoft",
        "Meta",
        "AWS",
        "Amazon",
        "University",
    )

    @classmethod
    def parse(cls, text: str) -> list[Certification]:

        if not text:
            return []

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        certifications = []
        current = None

        for line in lines:

            # ------------------------
            # Date
            # ------------------------
            if cls.DATE_PATTERN.match(line):
                if current:
                    current.date = line
                continue

            # ------------------------
            # Credential ID
            # ------------------------
            credential = cls.CREDENTIAL_PATTERN.search(line)

            if credential:
                if current:
                    current.credential_id = credential.group(1).strip()

                    cleaned = re.sub(
                        r"\(Credential ID:.*?\)",
                        "",
                        line,
                    ).strip()

                    if cleaned:
                        current.description.append(cleaned)

                continue

            # ------------------------
            # Issuer
            # ------------------------
            if any(keyword in line for keyword in cls.ISSUER_KEYWORDS):

                if current and current.issuer is None:
                    current.issuer = line
                    continue

            # ------------------------
            # Link
            # ------------------------
            if "|" in line:

                title, *links = [
                    part.strip()
                    for part in line.split("|")
                ]

                if current:
                    certifications.append(current)

                current = Certification(
                    title=title,
                    links=links,
                )

                continue

            # ------------------------
            # New Item
            # ------------------------
            if current is None:

                current = Certification(
                    title=line
                )

                continue

            # ------------------------
            # Start New Certification
            # ------------------------
            if (
                not line.startswith("•")
                and len(line.split()) <= 8
                and current.description
            ):

                certifications.append(current)

                current = Certification(
                    title=line
                )

                continue

            # ------------------------
            # Description
            # ------------------------
            current.description.append(
                line.lstrip("•-– ").strip()
            )

        if current:
            certifications.append(current)

        return certifications