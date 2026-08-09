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
        "restful api": "rest api",
        "restful apis": "rest api",
        "rest api development": "rest api",
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

        # =================================
        # KEYWORDS
        # =================================

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

        # =================================
        # RESUME SKILLS
        # =================================

        resume_skills = {
            cls.normalize_skill(skill)
            for skills in resume.skills.values()
            for skill in skills
        }

        # Experience tech stack
        for experience in resume.experience:
            for tech in experience.tech_stack:
                resume_skills.add(
                    cls.normalize_skill(tech)
                )

        # Project tech stack
        for project in resume.projects:
            for tech in project.tech_stack:
                resume_skills.add(
                    cls.normalize_skill(tech)
                )

        # =================================
        # JOB SKILLS
        # =================================

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

        # =================================
        # SCORE
        # =================================

        score = cls.calculate_score(
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            matched_keywords=matched_keywords,
            missing_keywords=missing_keywords,
        )

        # =================================
        # RECOMMENDATIONS
        # =================================

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

    # =====================================
    # SCORE CALCULATION
    # =====================================

    @staticmethod
    def calculate_score(
        matched_skills: list[str],
        missing_skills: list[str],
        matched_keywords: list[str],
        missing_keywords: list[str],
    ) -> int:

        # ---------------------------------
        # Skill score
        # ---------------------------------

        total_skills = (
            len(matched_skills)
            + len(missing_skills)
        )

        if total_skills > 0:
            skill_score = (
                len(matched_skills)
                / total_skills
            ) * 100
        else:
            skill_score = 0

        # ---------------------------------
        # Keyword score
        # ---------------------------------

        total_keywords = (
            len(matched_keywords)
            + len(missing_keywords)
        )

        if total_keywords > 0:
            keyword_score = (
                len(matched_keywords)
                / total_keywords
            ) * 100
        else:
            keyword_score = 0

        # ---------------------------------
        # Weighted score
        # ---------------------------------

        score = (
            skill_score * 0.70
            + keyword_score * 0.30
        )

        return round(score)

    # =====================================
    # RECOMMENDATIONS
    # =====================================

    @staticmethod
    def generate_recommendations(
        missing_skills: list[str],
        missing_keywords: list[str],
    ) -> list[str]:

        recommendations = []

        if missing_skills:
            recommendations.append(
                "Add or highlight these skills if you "
                "actually possess them: "
                + ", ".join(missing_skills)
            )

        if missing_keywords:
            recommendations.append(
                "Consider incorporating relevant keywords "
                "from the job description where they are "
                "truthfully supported by your experience: "
                + ", ".join(missing_keywords)
            )

        if not recommendations:
            recommendations.append(
                "Excellent match! Your resume aligns very "
                "well with the job description."
            )

        return recommendations