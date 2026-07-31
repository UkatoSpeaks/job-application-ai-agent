import re


class ContactParser:

    @staticmethod
    def parse(text: str) -> dict:
        contact = {
            "name": None,
            "email": None,
            "phone": None,
            "github": None,
            "linkedin": None,
            "portfolio": None,
        }

        # -----------------------------
        # Name
        # -----------------------------
        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        if lines:
            contact["name"] = lines[0]

        # -----------------------------
        # Email
        # -----------------------------
        email_match = re.search(
            r"[\w\.-]+@[\w\.-]+\.\w+",
            text
        )

        if email_match:
            contact["email"] = email_match.group()

        # -----------------------------
        # Phone
        # -----------------------------
        phone_match = re.search(
            r"(\+?\d[\d\s-]{8,}\d)",
            text
        )

        if phone_match:
            contact["phone"] = phone_match.group()

        # -----------------------------
        # GitHub
        # -----------------------------
        github_match = re.search(
            r"github\.com/\S+",
            text,
            re.IGNORECASE
        )

        if github_match:
            contact["github"] = github_match.group()

        # -----------------------------
        # LinkedIn
        # -----------------------------
        linkedin_match = re.search(
            r"linkedin\.com/\S+",
            text,
            re.IGNORECASE
        )

        if linkedin_match:
            contact["linkedin"] = linkedin_match.group()

        # -----------------------------
        # Portfolio
        # -----------------------------
        portfolio_match = re.search(
            r"https?://\S+",
            text,
            re.IGNORECASE
        )

        if portfolio_match:
            contact["portfolio"] = portfolio_match.group()

        return contact