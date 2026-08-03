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
    def score_summary(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:

        if not resume.summary:
            return 0

        score = 0

        words = len(resume.summary.split())

        # Has a summary
        score += 4

        # Good length (30–80 words)
        if 30 <= words <= 80:
            score += 3

        # Contains action/technical keywords
        keywords = {
            "developed",
            "built",
            "designed",
            "implemented",
            "engineer",
            "developer",
            "full-stack",
            "backend",
            "frontend",
            "python",
            "javascript",
            "react",
            "next.js",
            "ai",
            "langchain",
        }

        lower_summary = resume.summary.lower()

        matches = sum(
            1
            for keyword in keywords
            if keyword in lower_summary
        )

        if matches >= 3:
            score += 3

        return min(score, 10)

    @classmethod
    def score_skills(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:
        return 0

    @classmethod
    def score_education(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:
        return 0

    @classmethod
    def score_experience(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:
        return 0

    @classmethod
    def score_projects(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:
        return 0

    @classmethod
    def score_certifications(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:
        return 0