from app.schemas.resume import ParsedResume
from app.schemas.validation import ValidationResult
from app.schemas.score import (
    ResumeScore,
    ScoreBreakdown,
)


class ResumeScorer:

    @classmethod
    def score(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> ResumeScore:

        contact = cls.score_contact(resume, validation)
        summary = cls.score_summary(resume, validation)
        skills = cls.score_skills(resume, validation)
        education = cls.score_education(resume, validation)
        experience = cls.score_experience(resume, validation)
        projects = cls.score_projects(resume, validation)
        certifications = cls.score_certifications(resume, validation)

        overall = (
            contact
            + summary
            + skills
            + education
            + experience
            + projects
            + certifications
        )

        grade = cls.calculate_grade(overall)

        return ResumeScore(
            overall=overall,
            grade=grade,
            breakdown=ScoreBreakdown(
                contact=contact,
                summary=summary,
                skills=skills,
                education=education,
                experience=experience,
                projects=projects,
                certifications=certifications,
            ),
        )

    @staticmethod
    def calculate_grade(score: int) -> str:

        if score >= 90:
            return "A+"

        if score >= 80:
            return "A"

        if score >= 70:
            return "B"

        if score >= 60:
            return "C"

        if score >= 50:
            return "D"

        return "F"

    @classmethod
    def score_contact(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:

        score = 0

        if resume.name:
            score += 2

        if resume.email:
            score += 3

        if resume.phone:
            score += 2

        if resume.github:
            score += 3

        if resume.linkedin:
            score += 3

        if resume.portfolio:
            score += 2

        return score

    @classmethod
    def score_summary(cls, resume, validation):
        return 0

    @classmethod
    def score_skills(cls, resume, validation):
        return 0

    @classmethod
    def score_education(cls, resume, validation):
        return 0

    @classmethod
    def score_experience(cls, resume, validation):
        return 0

    @classmethod
    def score_projects(cls, resume, validation):
        return 0

    @classmethod
    def score_certifications(cls, resume, validation):
        return 0