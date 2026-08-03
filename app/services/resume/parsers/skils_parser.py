import re


class SkillsParser:

    @staticmethod
    def parse(skills_text: str) -> dict[str, list[str]]:

        skills = {}

        if not skills_text.strip():
            return skills

        for line in skills_text.splitlines():

            line = line.strip()

            if not line:
                continue

            # Remove bullet if present
            line = re.sub(r"^[•\-–—]\s*", "", line)

            # Must contain a category
            if ":" not in line:
                continue

            category, values = line.split(":", 1)

            category = category.strip()

            values = values.strip()

            if not values:
                continue

            parsed = []

            for skill in values.split(","):

                skill = skill.strip()

                if skill:
                    parsed.append(skill)

            if parsed:
                skills[category] = parsed

        return skills