class SkillsParser:

    @staticmethod
    def parse(skills_text: str) -> dict[str, list[str]]:
        skills = {}

        if not skills_text:
            return skills

        for line in skills_text.splitlines():

            line = line.strip()

            if not line:
                continue

            if ":" not in line:
                continue

            category, values = line.split(":", 1)

            category = category.strip()

            skills[category] = [
                skill.strip()
                for skill in values.split(",")
                if skill.strip()
            ]

        return skills