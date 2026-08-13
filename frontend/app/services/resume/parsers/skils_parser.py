import re


class SkillsParser:

    @staticmethod
    def parse(
        skills_text: str,
    ) -> dict[str, list[str]]:

        skills = {}

        if not skills_text.strip():
            return skills

        current_category = None

        for line in skills_text.splitlines():

            line = line.strip()

            if not line:
                continue

            # Remove bullets
            line = re.sub(
                r"^[•●▪◦*-]\s*",
                "",
                line,
            )

            # -------------------------
            # Category : values
            # -------------------------

            if ":" in line:

                category, values = line.split(
                    ":",
                    1,
                )

                current_category = category.strip()

                parsed = re.split(
                    r",|\||•|;",
                    values,
                )

                parsed = [
                    skill.strip()
                    for skill in parsed
                    if skill.strip()
                ]

                skills[current_category] = parsed

            # -------------------------
            # Category
            # -------------------------

            elif (
                current_category is None
                and len(line.split()) <= 3
            ):

                current_category = line

                skills[current_category] = []

            # -------------------------
            # Values
            # -------------------------

            elif current_category:

                parsed = re.split(
                    r",|\||•|;",
                    line,
                )

                parsed = [
                    skill.strip()
                    for skill in parsed
                    if skill.strip()
                ]

                skills[current_category].extend(
                    parsed
                )

        return skills