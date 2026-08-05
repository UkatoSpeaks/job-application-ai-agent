from app.schemas.resume import ParsedResume
from app.schemas.job_description import JobDescription
from app.schemas.match import ResumeJobMatch

from app.services.job_matching.keyword_extractor import (
    KeywordExtractor,
)


class ResumeJobMatcher:

    SKILL_ALIASES = {
        "postgresql": "sql",
        "mysql": "sql",
        "mariadb": "sql",

        "express.js": "express",
        "node.js": "node",

        "rest apis": "rest api",
    }

    @classmethod
    def normalize_skill(cls, skill: str) -> str:
        skill = skill.lower().strip()
        return cls.SKILL_ALIASES.get(skill, skill)

    @classmethod
    def match(
        cls,
        resume: ParsedResume,
        job: JobDescription,
    ) -> ResumeJobMatch:

        # ---------------------------------
        # Keywords
        # ---------------------------------

        resume_keywords = {
            cls.normalize_skill(keyword)
            for keyword in KeywordExtractor.extract_resume_keywords(
                resume
            )
        }

        job_keywords = {
            cls.normalize_skill(keyword)
            for keyword in KeywordExtractor.extract_job_keywords(
                job
            )
        }

        matched_keywords = sorted(
            resume_keywords.intersection(job_keywords)
        )

        missing_keywords = sorted(
            job_keywords.difference(resume_keywords)
        )

        # ---------------------------------
        # Skills
        # ---------------------------------

        resume_skills = {
            cls.normalize_skill(skill)
            for skills in resume.skills.values()
            for skill in skills
        }

        # Include experience tech stack
        for exp in resume.experience:
            for tech in exp.tech_stack:
                resume_skills.add(
                    cls.normalize_skill(tech)
                )

        # Include project tech stack
        for project in resume.projects:
            for tech in project.tech_stack:
                resume_skills.add(
                    cls.normalize_skill(tech)
                )

        job_skills = {
            cls.normalize_skill(skill)
            for skill in (
                job.required_skills
                + job.preferred_skills
            )
        }

        matched_skills = sorted(
            resume_skills.intersection(job_skills)
        )

        missing_skills = sorted(
            job_skills.difference(resume_skills)
        )

        # ---------------------------------
        # Score
        # ---------------------------------

        score = cls.calculate_score(
            matched_keywords,
            missing_keywords,
        )

        recommendations = cls.generate_recommendations(
            missing_skills,
            missing_keywords,
        )

        return ResumeJobMatch(
            match_score=score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            matched_keywords=matched_keywords,
            missing_keywords=missing_keywords,
            recommendations=recommendations,
        )

    @staticmethod
    def calculate_score(
        matched: list[str],
        missing: list[str],
    ) -> int:

        total = len(matched) + len(missing)

        if total == 0:
            return 0

        return round(
            (len(matched) / total) * 100
        )

    @staticmethod
    def generate_recommendations(
        missing_skills: list[str],
        missing_keywords: list[str],
    ) -> list[str]:

        recommendations = []

        if missing_skills:
            recommendations.append(
                "Add or highlight these skills if you possess them: "
                + ", ".join(missing_skills)
            )

        if missing_keywords:
            recommendations.append(
                "Include relevant keywords such as: "
                + ", ".join(missing_keywords)
            )

        if not recommendations:
            recommendations.append(
                "Excellent match! Your resume aligns very well with the job description."
            )

        return recommendations