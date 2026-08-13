import re


class ContactParser:
    HEADER_LINES = 8

    @staticmethod
    def normalize_url(url: str) -> str:
        """Normalize URLs by adding https:// if missing."""
        if not url:
            return url

        url = url.strip().rstrip("/")

        if not url.startswith(("http://", "https://")):
            url = "https://" + url

        return url

    @staticmethod
    def normalize_phone(phone: str) -> str:
        """Normalize phone number."""
        if not phone:
            return phone

        phone = re.sub(r"[^\d+]", "", phone)

        if phone.count("+") > 1:
            phone = "+" + phone.replace("+", "")

        return phone

    @classmethod
    def parse(cls, text: str) -> dict:

        contact = {
            "name": None,
            "email": None,
            "phone": None,
            "github": None,
            "linkedin": None,
            "twitter": None,
            "portfolio": None,
        }

        # --------------------------------------------
        # Only inspect the resume header
        # --------------------------------------------
        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        if not lines:
            return contact

        contact["name"] = lines[0]

        header = "\n".join(lines[: cls.HEADER_LINES])

        # --------------------------------------------
        # Email
        # --------------------------------------------
        email_match = re.search(
            r"[\w\.-]+@[\w\.-]+\.\w+",
            header,
            re.IGNORECASE,
        )

        if email_match:
            contact["email"] = email_match.group()

        # --------------------------------------------
        # Phone
        # --------------------------------------------
        phone_match = re.search(
            r"(?:\+\d{1,3}[\s-]?)?(?:\(?\d{3,5}\)?[\s-]?)?\d[\d\s-]{7,}\d",
            header,
        )

        if phone_match:
            contact["phone"] = cls.normalize_phone(phone_match.group())

        # --------------------------------------------
        # GitHub
        # --------------------------------------------
        github_match = re.search(
            r"(?:https?://)?(?:www\.)?github\.com/[A-Za-z0-9_.-]+",
            header,
            re.IGNORECASE,
        )

        if github_match:
            contact["github"] = cls.normalize_url(github_match.group())

        # --------------------------------------------
        # LinkedIn
        # --------------------------------------------
        linkedin_match = re.search(
            r"(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9_-]+",
            header,
            re.IGNORECASE,
        )

        if linkedin_match:
            contact["linkedin"] = cls.normalize_url(linkedin_match.group())

        # --------------------------------------------
        # Twitter / X
        # --------------------------------------------
        twitter_match = re.search(
            r"(?:https?://)?(?:www\.)?(?:x\.com|twitter\.com)/[A-Za-z0-9_]+",
            header,
            re.IGNORECASE,
        )

        if twitter_match:
            contact["twitter"] = cls.normalize_url(twitter_match.group())

        # --------------------------------------------
        # Portfolio
        # --------------------------------------------
        portfolio_pattern = re.compile(
            r"(?:https?://)?(?:www\.)?"
            r"[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+"
            r"(?:/[^\s|]*)?",
            re.IGNORECASE,
        )

        ignored_domains = {
            "github.com",
            "linkedin.com",
            "twitter.com",
            "x.com",
            "gmail.com",
            "outlook.com",
            "yahoo.com",
        }

        valid_tlds = {
            "com",
            "dev",
            "app",
            "io",
            "ai",
            "tech",
            "me",
            "xyz",
            "site",
        }

        for match in portfolio_pattern.finditer(header):

            url = match.group()

            lower = url.lower()

            if any(domain in lower for domain in ignored_domains):
                continue

            if lower.endswith(".vercel.app") or lower.endswith(".netlify.app"):
                contact["portfolio"] = cls.normalize_url(url)
                break

            tld = lower.split(".")[-1]

            if tld in valid_tlds:
                contact["portfolio"] = cls.normalize_url(url)
                break

        return contact