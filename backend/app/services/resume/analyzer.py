from app.schemas.resume import ParsedResume
from app.schemas.validation import ValidationResult
from app.schemas.score import ResumeScore
from app.schemas.analysis import ResumeAnalysis

from app.services.resume.strengths import StrengthAnalyzer
from app.services.resume.weaknesses import WeaknessAnalyzer
from app.services.resume.recommendations import RecommendationAnalyzer


class ResumeAnalyzer:

    @classmethod
    def analyze(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
        score: ResumeScore,
    ) -> ResumeAnalysis:

        strengths = StrengthAnalyzer.analyze(resume)

        weaknesses = WeaknessAnalyzer.analyze(resume)

        recommendations = RecommendationAnalyzer.analyze(
            resume
        )

        missing_sections = cls.get_missing_sections(
            resume
        )

        return ResumeAnalysis(
            ats_score=score.overall,
            strengths=strengths,
            weaknesses=weaknesses,
            recommendations=recommendations,
            missing_sections=missing_sections,
        )

    @staticmethod
    def get_missing_sections(
        resume: ParsedResume,
    ) -> list[str]:

        missing = []

        if not resume.summary:
            missing.append("Professional Summary")

        if not resume.linkedin:
            missing.append("LinkedIn")

        if not resume.portfolio:
            missing.append("Portfolio")

        if not resume.experience:
            missing.append("Experience")

        if not resume.projects:
            missing.append("Projects")

        if not resume.certifications:
            missing.append("Certifications")

        return missing