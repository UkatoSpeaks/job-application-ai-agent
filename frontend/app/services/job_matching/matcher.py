from app.schemas.resume import ParsedResume
from app.schemas.job_description import JobDescription
from app.schemas.match import ResumeJobMatch

from app.services.job_matching.keyword_extractor import (
    KeywordExtractor,
)


class ResumeJobMatcher:

    # ==========================================================
    # Skill Aliases
    # ==========================================================

    SKILL_ALIASES = {

        "postgresql": "sql",
        "mysql": "sql",
        "mariadb": "sql",

        "express.js": "express",
        "expressjs": "express",

        "node.js": "node",
        "nodejs": "node",

        "reactjs": "react",
        "react.js": "react",

        "rest apis": "rest api",
        "restful api": "rest api",
        "restful apis": "rest api",
        "rest api development": "rest api",

        "typescript/javascript": "typescript",
        "javascript/typescript": "javascript",
    }

    # ==========================================================
    # Normalize Skill
    # ==========================================================

    @classmethod
    def normalize_skill(
        cls,
        skill: str,
    ) -> str:

        skill = (
            skill
            .lower()
            .strip()
        )

        skill = (
            skill
            .replace("reactjs", "react")
            .replace("react.js", "react")
            .replace("node.js", "node")
            .replace("nodejs", "node")
            .replace("express.js", "express")
            .replace("expressjs", "express")
        )

        return cls.SKILL_ALIASES.get(
            skill,
            skill,
        )

    # ==========================================================
    # Extract Resume Skills
    # ==========================================================

    @classmethod
    def get_resume_skills(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        skills = set()

        # ------------------------------------------
        # Skills section
        # ------------------------------------------

        for skill_list in resume.skills.values():

            for skill in skill_list:

                skills.add(
                    cls.normalize_skill(skill)
                )

        # ------------------------------------------
        # Experience tech stack
        # ------------------------------------------

        for experience in resume.experience:

            for tech in experience.tech_stack:

                skills.add(
                    cls.normalize_skill(tech)
                )

        # ------------------------------------------
        # Project tech stack
        # ------------------------------------------

        for project in resume.projects:

            for tech in project.tech_stack:

                skills.add(
                    cls.normalize_skill(tech)
                )

        # ------------------------------------------
        # Keyword extraction
        # ------------------------------------------

        keywords = (
            KeywordExtractor
            .extract_resume_keywords(
                resume
            )
        )

        for keyword in keywords:

            skills.add(
                cls.normalize_skill(keyword)
            )

        return skills

    # ==========================================================
    # Extract Job Skills
    # ==========================================================

    @classmethod
    def get_job_skills(
        cls,
        job: JobDescription,
    ) -> set[str]:

        skills = set()

        # ------------------------------------------
        # Required skills
        # ------------------------------------------

        for skill in job.required_skills:

            extracted = (
                KeywordExtractor
                .extract_text_keywords(
                    skill
                )
            )

            for keyword in extracted:

                skills.add(
                    cls.normalize_skill(keyword)
                )

        # ------------------------------------------
        # Preferred skills
        # ------------------------------------------

        for skill in job.preferred_skills:

            extracted = (
                KeywordExtractor
                .extract_text_keywords(
                    skill
                )
            )

            for keyword in extracted:

                skills.add(
                    cls.normalize_skill(keyword)
                )

        return skills

    # ==========================================================
    # Match
    # ==========================================================

    @classmethod
    def match(
        cls,
        resume: ParsedResume,
        job: JobDescription,
    ) -> ResumeJobMatch:

        # ======================================================
        # Skills
        # ======================================================

        resume_skills = (
            cls.get_resume_skills(
                resume
            )
        )

        job_skills = (
            cls.get_job_skills(
                job
            )
        )

        matched_skills = sorted(
            resume_skills.intersection(
                job_skills
            )
        )

        missing_skills = sorted(
            job_skills.difference(
                resume_skills
            )
        )

        # ======================================================
        # Keywords
        # ======================================================

        resume_keywords = {
            cls.normalize_skill(keyword)
            for keyword in (
                KeywordExtractor
                .extract_resume_keywords(
                    resume
                )
            )
        }

        job_keywords = {
            cls.normalize_skill(keyword)
            for keyword in (
                KeywordExtractor
                .extract_job_keywords(
                    job
                )
            )
        }

        matched_keywords = sorted(
            resume_keywords.intersection(
                job_keywords
            )
        )

        missing_keywords = sorted(
            job_keywords.difference(
                resume_keywords
            )
        )

        # ======================================================
        # Score
        # ======================================================

        score = cls.calculate_score(
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            matched_keywords=matched_keywords,
            missing_keywords=missing_keywords,
        )

        # ======================================================
        # Recommendations
        # ======================================================

        recommendations = (
            cls.generate_recommendations(
                missing_skills,
                missing_keywords,
            )
        )

        # ======================================================
        # Result
        # ======================================================

        return ResumeJobMatch(
            match_score=score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            matched_keywords=matched_keywords,
            missing_keywords=missing_keywords,
            recommendations=recommendations,
        )

    # ==========================================================
    # Score
    # ==========================================================

    @staticmethod
    def calculate_score(
        matched_skills: list[str],
        missing_skills: list[str],
        matched_keywords: list[str],
        missing_keywords: list[str],
    ) -> int:

        # ------------------------------------------
        # Skill Score
        # ------------------------------------------

        total_skills = (
            len(matched_skills)
            + len(missing_skills)
        )

        if total_skills:

            skill_score = (
                len(matched_skills)
                / total_skills
            ) * 100

        else:

            skill_score = 0

        # ------------------------------------------
        # Keyword Score
        # ------------------------------------------

        total_keywords = (
            len(matched_keywords)
            + len(missing_keywords)
        )

        if total_keywords:

            keyword_score = (
                len(matched_keywords)
                / total_keywords
            ) * 100

        else:

            keyword_score = 0

        # ------------------------------------------
        # Weighted score
        # ------------------------------------------

        score = (
            skill_score * 0.70
            + keyword_score * 0.30
        )

        return round(score)

    # ==========================================================
    # Recommendations
    # ==========================================================

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
                + ", ".join(
                    missing_skills
                )
            )

        if missing_keywords:

            recommendations.append(
                "Consider incorporating relevant "
                "keywords from the job description "
                "where they are truthfully supported "
                "by your experience: "
                + ", ".join(
                    missing_keywords
                )
            )

        if not recommendations:

            recommendations.append(
                "Excellent match! Your resume aligns "
                "very well with the job description."
            )

        return recommendations