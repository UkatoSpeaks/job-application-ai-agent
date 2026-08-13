from app.schemas.resume import ParsedResume


class StrengthAnalyzer:

    @classmethod
    def analyze(
        cls,
        resume: ParsedResume,
    ) -> list[str]:

        strengths = []

        if len(resume.skills) >= 5:
            strengths.append(
                "Strong technical skill set across multiple domains."
            )

        if len(resume.projects) >= 3:
            strengths.append(
                "Contains multiple well-structured technical projects."
            )

        if resume.experience:
            strengths.append(
                "Includes relevant industry experience."
            )

        if resume.certifications:
            strengths.append(
                "Has industry certifications and achievements."
            )

        if resume.github:
            strengths.append(
                "GitHub profile is available."
            )

        return strengths