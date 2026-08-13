from app.schemas.resume import ParsedResume


class WeaknessAnalyzer:

    @classmethod
    def analyze(
        cls,
        resume: ParsedResume,
    ) -> list[str]:

        weaknesses = []

        if not resume.summary:
            weaknesses.append(
                "Professional summary is missing."
            )

        if not resume.linkedin:
            weaknesses.append(
                "LinkedIn profile is missing."
            )

        if not resume.portfolio:
            weaknesses.append(
                "Portfolio website is missing."
            )

        if not resume.experience:
            weaknesses.append(
                "No work experience found."
            )

        return weaknesses