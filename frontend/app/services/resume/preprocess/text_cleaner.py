import re


class TextCleaner:

    @staticmethod
    def clean(text: str) -> str:
        """
        Normalize extracted PDF text before parsing.
        """

        if not text:
            return ""

        # -----------------------------
        # Normalize line endings
        # -----------------------------
        text = text.replace("\r\n", "\n")
        text = text.replace("\r", "\n")

        # -----------------------------
        # Normalize bullet symbols only
        # -----------------------------
        text = (
            text.replace("•", "•")
                .replace("●", "•")
                .replace("▪", "•")
                .replace("◦", "•")
        )

        # -----------------------------
        # Remove trailing spaces
        # -----------------------------
        text = "\n".join(
            line.rstrip()
            for line in text.splitlines()
        )

        # -----------------------------
        # Collapse 3+ blank lines
        # -----------------------------
        text = re.sub(
            r"\n{3,}",
            "\n\n",
            text
        )

        return text.strip()