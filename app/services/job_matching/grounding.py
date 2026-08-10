import re

from app.schemas.resume import ParsedResume
from app.schemas.tailor import ResumeTailorResponse
from app.schemas.cover_letter import CoverLetterResponse

from app.services.job_matching.constants import TECH_KEYWORDS


class GroundingValidator:

    # ==========================================================
    # Normalization
    # ==========================================================

    @staticmethod
    def normalize(value: str) -> str:
        return value.lower().strip()

    # ==========================================================
    # Resume Skills
    # ==========================================================

    @classmethod
    def get_resume_skills(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        skills = set()

        # Skills section
        for skill_list in resume.skills.values():
            for skill in skill_list:
                skills.add(
                    cls.normalize(skill)
                )

        # Experience tech stack
        for experience in resume.experience:
            for tech in experience.tech_stack:
                skills.add(
                    cls.normalize(tech)
                )

        # Project tech stack
        for project in resume.projects:
            for tech in project.tech_stack:
                skills.add(
                    cls.normalize(tech)
                )

        return skills

    # ==========================================================
    # Technologies Explicitly Used In Experience / Projects
    # ==========================================================

    @classmethod
    def get_used_technologies(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        technologies = set()

        # Experience
        for experience in resume.experience:
            for tech in experience.tech_stack:
                technologies.add(
                    cls.normalize(tech)
                )

        # Projects
        for project in resume.projects:
            for tech in project.tech_stack:
                technologies.add(
                    cls.normalize(tech)
                )

        return technologies

    # ==========================================================
    # Existing Projects
    # ==========================================================

    @classmethod
    def get_project_titles(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        return {
            cls.normalize(project.title)
            for project in resume.projects
            if project.title
        }

    # ==========================================================
    # Existing Companies
    # ==========================================================

    @classmethod
    def get_companies(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        return {
            cls.normalize(experience.company)
            for experience in resume.experience
            if experience.company
        }

    # ==========================================================
    # Extract Technical Keywords From Text
    # ==========================================================

    @classmethod
    def extract_technical_keywords(
        cls,
        text: str,
    ) -> set[str]:

        normalized_text = cls.normalize(text)

        found = set()

        for keyword in TECH_KEYWORDS:

            keyword_normalized = cls.normalize(
                keyword
            )

            # Word-boundary matching for simple
            # technologies.

            pattern = (
                r"(?<!\w)"
                + re.escape(keyword_normalized)
                + r"(?!\w)"
            )

            if re.search(
                pattern,
                normalized_text,
            ):
                found.add(
                    keyword_normalized
                )

        return found

    # ==========================================================
    # Tailored Resume Validation
    # ==========================================================

    @classmethod
    def validate_tailored_resume(
        cls,
        resume: ParsedResume,
        tailored: ResumeTailorResponse,
    ) -> ResumeTailorResponse:

        resume_skills = cls.get_resume_skills(
            resume
        )

        project_titles = cls.get_project_titles(
            resume
        )

        companies = cls.get_companies(
            resume
        )

        # ------------------------------------------
        # Improved Skills
        # ------------------------------------------

        improved_skills = [
            skill
            for skill in tailored.improved_skills
            if cls.normalize(skill)
            in resume_skills
        ]

        # ------------------------------------------
        # Keywords To Add
        #
        # Must NOT already exist in resume.
        # ------------------------------------------

        keywords_to_add = [
            keyword
            for keyword in tailored.keywords_to_add
            if cls.normalize(keyword)
            not in resume_skills
        ]

        # ------------------------------------------
        # Project Improvements
        # ------------------------------------------

        project_improvements = [
            project
            for project in tailored.project_improvements
            if cls.normalize(project.title)
            in project_titles
        ]

        # ------------------------------------------
        # Experience Improvements
        # ------------------------------------------

        experience_improvements = [
            experience
            for experience
            in tailored.experience_improvements
            if cls.normalize(experience.company)
            in companies
        ]

        return ResumeTailorResponse(
            improved_summary=tailored.improved_summary,
            improved_skills=improved_skills,
            keywords_to_add=keywords_to_add,
            project_improvements=project_improvements,
            experience_improvements=experience_improvements,
            ats_tips=tailored.ats_tips,
        )

    # ==========================================================
    # Find Unsupported Technical Claims
    # ==========================================================

    @classmethod
    def find_cover_letter_errors(
        cls,
        resume: ParsedResume,
        cover_letter: CoverLetterResponse,
    ) -> list[str]:

        errors = []

        # ------------------------------------------
        # Combine cover letter + email
        # ------------------------------------------

        text = (
            f"{cover_letter.cover_letter}\n"
            f"{cover_letter.email_body}"
        )

        normalized_text = cls.normalize(
            text
        )

        # ------------------------------------------
        # Resume technologies
        # ------------------------------------------

        resume_skills = cls.get_resume_skills(
            resume
        )

        used_technologies = (
            cls.get_used_technologies(
                resume
            )
        )

        # ------------------------------------------
        # Technical keywords in generated text
        # ------------------------------------------

        mentioned_technologies = (
            cls.extract_technical_keywords(
                text
            )
        )

        # ------------------------------------------
        # Unsupported technologies
        # ------------------------------------------

        unsupported = sorted(
            technology
            for technology
            in mentioned_technologies
            if technology not in resume_skills
        )

        for technology in unsupported:

            errors.append(
                f"Unsupported technology mentioned "
                f"in cover letter: {technology}"
            )

        # ------------------------------------------
        # Strong experience claims
        #
        # These verbs indicate actual usage/work.
        # ------------------------------------------

        strong_claim_patterns = [
            "used {technology}",
            "worked with {technology}",
            "worked on {technology}",
            "built with {technology}",
            "built using {technology}",
            "developed with {technology}",
            "developed using {technology}",
            "implemented with {technology}",
            "implemented using {technology}",
            "deployed with {technology}",
            "deployed using {technology}",
            "experience with {technology}",
            "experience in {technology}",
            "proficient in {technology}",
            "expertise in {technology}",
        ]

        # ------------------------------------------
        # Check technologies that only exist in the
        # resume's general skills section.
        #
        # We don't reject simply mentioning them.
        # We reject strong "I used X" claims when
        # the resume doesn't explicitly place X in
        # experience/project tech stacks.
        # ------------------------------------------

        for technology in sorted(
            mentioned_technologies
        ):

            if technology not in resume_skills:
                continue

            if technology in used_technologies:
                continue

            for claim_pattern in strong_claim_patterns:

                pattern = claim_pattern.format(
                    technology=re.escape(
                        technology
                    )
                )

                if re.search(
                    pattern,
                    normalized_text,
                ):

                    errors.append(
                        f"Unsupported usage claim for "
                        f"{technology}: "
                        f"technology appears only in the "
                        f"resume skills section."
                    )

                    break

        # ==================================================
        # Unsupported Concept Detection
        # ==================================================

        unsupported_concepts = {
            "system design": "System Design",
            "distributed systems": "Distributed Systems",
            "distributed architecture": "Distributed Architecture",
            "distributed architectures": "Distributed Architecture",
            "microservices": "Microservices",
            "cloud architecture": "Cloud Architecture",
            "devops": "DevOps",
            "enterprise architecture": "Enterprise Architecture",
            "software architecture": "Software Architecture",
        }

        for phrase, display_name in (
            unsupported_concepts.items()
        ):

            if phrase in normalized_text:

                # Only allow the phrase if the resume
                # explicitly contains it as a skill or
                # experience/project evidence.

                resume_text = cls.build_resume_text(
                    resume
                )

                if phrase not in resume_text:

                    errors.append(
                        f"Unsupported technical concept "
                        f"mentioned: {display_name}"
                    )

        return errors

    # ==========================================================
    # Build Resume Text
    # ==========================================================

    @classmethod
    def build_resume_text(
        cls,
        resume: ParsedResume,
    ) -> str:

        parts = []

        if resume.summary:
            parts.append(
                resume.summary
            )

        # Skills
        for skill_list in resume.skills.values():
            parts.extend(skill_list)

        # Experience
        for experience in resume.experience:

            if experience.company:
                parts.append(
                    experience.company
                )

            if experience.role:
                parts.append(
                    experience.role
                )

            parts.extend(
                experience.responsibilities
            )

            parts.extend(
                experience.tech_stack
            )

        # Projects
        for project in resume.projects:

            if project.title:
                parts.append(
                    project.title
                )

            if project.subtitle:
                parts.append(
                    project.subtitle
                )

            parts.extend(
                project.description
            )

            parts.extend(
                project.tech_stack
            )

        return cls.normalize(
            " ".join(parts)
        )

    # ==========================================================
    # Cover Letter Validation
    # ==========================================================

    @classmethod
    def validate_cover_letter(
        cls,
resume: ParsedResume,
        cover_letter: CoverLetterResponse,
    ) -> tuple[
        CoverLetterResponse,
        list[str],
    ]:

        errors = (
            cls.find_cover_letter_errors(
                resume,
                cover_letter,
            )
        )

        return (
            cover_letter,
            errors,
        )