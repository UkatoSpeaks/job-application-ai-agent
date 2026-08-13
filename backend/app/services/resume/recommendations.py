from app.schemas.resume import ParsedResume


class RecommendationAnalyzer:

    @classmethod
    def analyze(
        cls,
        resume: ParsedResume,
    ) -> list[str]:

        recommendations = []

        if not resume.summary:
            recommendations.append(
                "Add a concise professional summary highlighting your expertise."
            )

        if not resume.linkedin:
            recommendations.append(
                "Include your LinkedIn profile."
            )

        if not resume.portfolio:
            recommendations.append(
                "Add your portfolio website."
            )

        if len(resume.projects) < 3:
            recommendations.append(
                "Include more technical projects."
            )

        if not resume.certifications:
            recommendations.append(
                "Add certifications to strengthen your profile."
            )

        return recommendations