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

        if not resume.skills:
            return 0

        score = 0

        # ---------------------------------
        # Number of Categories (5)
        # ---------------------------------
        categories = len(resume.skills)

        if categories >= 5:
            score += 5
        elif categories >= 3:
            score += 3
        elif categories >= 1:
            score += 1

        # ---------------------------------
        # Total Skills (5)
        # ---------------------------------
        total_skills = sum(
            len(skill_list)
            for skill_list in resume.skills.values()
        )

        if total_skills >= 20:
            score += 5
        elif total_skills >= 15:
            score += 4
        elif total_skills >= 10:
            score += 3
        elif total_skills >= 5:
            score += 2

        # ---------------------------------
        # Modern Technologies (5)
        # ---------------------------------
        modern_tech = {
            "React",
            "Next.js",
            "TypeScript",
            "FastAPI",
            "Node.js",
            "Docker",
            "Kubernetes",
            "MongoDB",
            "PostgreSQL",
            "LangChain",
            "LangGraph",
            "CrewAI",
            "Git",
            "GitHub",
        }

        found = set()

        for skill_list in resume.skills.values():
            for skill in skill_list:
                if skill in modern_tech:
                    found.add(skill)

        if len(found) >= 8:
            score += 5
        elif len(found) >= 5:
            score += 4
        elif len(found) >= 3:
            score += 3
        elif len(found) >= 1:
            score += 2

        # ---------------------------------
        # AI / Backend Bonus (5)
        # ---------------------------------
        bonus = {
            "Python",
            "FastAPI",
            "LangChain",
            "LangGraph",
            "CrewAI",
            "Docker",
            "PostgreSQL",
        }

        matched = set()

        for skill_list in resume.skills.values():
            for skill in skill_list:
                if skill in bonus:
                    matched.add(skill)

        if len(matched) >= 5:
            score += 5
        elif len(matched) >= 3:
            score += 4
        elif len(matched) >= 2:
            score += 3
        elif len(matched) >= 1:
            score += 2

        return min(score, 20)

    @classmethod
    def score_education(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:

        if not resume.education:
            return 0

        score = 0

        # ---------------------------------
        # Number of Education Entries
        # ---------------------------------
        count = len(resume.education)

        if count >= 2:
            score += 2
        elif count == 1:
            score += 1

        # ---------------------------------
        # Highest Degree
        # ---------------------------------
        highest = resume.education[0]

        degree = (highest.degree or "").lower()

        if any(
            keyword in degree
            for keyword in (
                "bachelor",
                "b.tech",
                "btech",
                "computer science",
                "engineering",
            )
        ):
            score += 4

        # ---------------------------------
        # Duration Present
        # ---------------------------------
        if highest.duration:
            score += 2

        # ---------------------------------
        # Institution Present
        # ---------------------------------
        if highest.institution:
            score += 2

        return min(score, 10)

    @classmethod
    def score_experience(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:

        if not resume.experience:
            return 0

        score = 0

        # ---------------------------------
        # Experience Count (4)
        # ---------------------------------
        count = len(resume.experience)

        if count >= 2:
            score += 4
        elif count == 1:
            score += 2

        responsibilities = 0
        technologies = set()

        for exp in resume.experience:

            # -----------------------------
            # Role + Company + Duration (6)
            # -----------------------------
            if exp.company:
                score += 1

            if exp.role:
                score += 2

            if exp.duration:
                score += 3

            responsibilities += len(exp.responsibilities)

            for tech in exp.tech_stack:
                technologies.add(tech)

        # ---------------------------------
        # Responsibilities (5)
        # ---------------------------------
        if responsibilities >= 6:
            score += 5
        elif responsibilities >= 4:
            score += 4
        elif responsibilities >= 2:
            score += 3
        elif responsibilities >= 1:
            score += 2

        # ---------------------------------
        # Tech Stack (5)
        # ---------------------------------
        if len(technologies) >= 8:
            score += 5
        elif len(technologies) >= 6:
            score += 4
        elif len(technologies) >= 4:
            score += 3
        elif len(technologies) >= 2:
            score += 2

        return min(score, 20)

    @classmethod
    def score_projects(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:

        if not resume.projects:
            return 0

        score = 0

        # ---------------------------------
        # Number of Projects (4)
        # ---------------------------------
        count = len(resume.projects)

        if count >= 4:
            score += 4
        elif count >= 3:
            score += 3
        elif count >= 2:
            score += 2
        elif count >= 1:
            score += 1

        total_descriptions = 0
        total_links = 0
        technologies = set()

        for project in resume.projects:

            # -----------------------------
            # Title + Duration (6)
            # -----------------------------
            if project.title:
                score += 1

            if project.subtitle:
                score += 1

            if project.duration:
                score += 2

            total_descriptions += len(project.description)
            total_links += len(project.links)

            for tech in project.tech_stack:
                technologies.add(tech)

        # ---------------------------------
        # Description Quality (4)
        # ---------------------------------
        if total_descriptions >= 9:
            score += 4
        elif total_descriptions >= 6:
            score += 3
        elif total_descriptions >= 3:
            score += 2
        elif total_descriptions >= 1:
            score += 1

        # ---------------------------------
        # Technology Diversity (4)
        # ---------------------------------
        if len(technologies) >= 10:
            score += 4
        elif len(technologies) >= 7:
            score += 3
        elif len(technologies) >= 4:
            score += 2
        elif len(technologies) >= 2:
            score += 1

        # ---------------------------------
        # Links (2)
        # ---------------------------------
        if total_links >= 6:
            score += 2
        elif total_links >= 3:
            score += 1

        return min(score, 20)

    @classmethod
    def score_certifications(
        cls,
        resume: ParsedResume,
        validation: ValidationResult,
    ) -> int:

        if not resume.certifications:
            return 0

        score = 0

        # ---------------------------------
        # Number of Certifications (2)
        # ---------------------------------
        count = len(resume.certifications)

        if count >= 4:
            score += 2
        elif count >= 2:
            score += 1

        issuers = set()

        for cert in resume.certifications:

            # -----------------------------
            # Title (2)
            # -----------------------------
            if cert.title:
                score += 1

            # -----------------------------
            # Issuer (2)
            # -----------------------------
            if cert.issuer:
                issuers.add(cert.issuer)

            # -----------------------------
            # Credential ID (1)
            # -----------------------------
            if cert.credential_id:
                score += 1

            # -----------------------------
            # Description (2)
            # -----------------------------
            if cert.description:
                score += 1

            # -----------------------------
            # Verification Link (2)
            # -----------------------------
            if cert.links:
                score += 1

        # ---------------------------------
        # Unique Issuers (1)
        # ---------------------------------
        if len(issuers) >= 2:
            score += 1

        return min(score, 10)