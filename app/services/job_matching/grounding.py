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

        # ------------------------------------------
        # Skills section
        # ------------------------------------------

        for skill_list in resume.skills.values():

            for skill in skill_list:

                skills.add(
                    cls.normalize(skill)
                )

        # ------------------------------------------
        # Experience tech stack
        # ------------------------------------------

        for experience in resume.experience:

            for tech in experience.tech_stack:

                skills.add(
                    cls.normalize(tech)
                )

        # ------------------------------------------
        # Project tech stack
        # ------------------------------------------

        for project in resume.projects:

            for tech in project.tech_stack:

                skills.add(
                    cls.normalize(tech)
                )

        return skills

    # ==========================================================
    # Technologies Explicitly Supported By Resume
    # ==========================================================

    @classmethod
    def get_used_technologies(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        technologies = set()

        # ------------------------------------------
        # Experience
        # ------------------------------------------

        for experience in resume.experience:

            # Tech stack
            for tech in experience.tech_stack:

                technologies.add(
                    cls.normalize(tech)
                )

            # Responsibilities
            responsibility_text = " ".join(
                experience.responsibilities
            )

            technologies.update(
                cls.extract_technical_keywords(
                    responsibility_text
                )
            )

        # ------------------------------------------
        # Projects
        # ------------------------------------------

        for project in resume.projects:

            # Tech stack
            for tech in project.tech_stack:

                technologies.add(
                    cls.normalize(tech)
                )

            # Project descriptions
            description_text = " ".join(
                project.description
            )

            technologies.update(
                cls.extract_technical_keywords(
                    description_text
                )
            )

        return technologies

    # ==========================================================
    # All Resume Technical Evidence
    # ==========================================================

    @classmethod
    def get_resume_technical_evidence(
        cls,
        resume: ParsedResume,
    ) -> set[str]:

        evidence = set()

        # ------------------------------------------
        # Skills
        # ------------------------------------------

        evidence.update(
            cls.get_resume_skills(
                resume
            )
        )

        # ------------------------------------------
        # Explicit technologies from experience
        # ------------------------------------------

        evidence.update(
            cls.get_used_technologies(
                resume
            )
        )

        # ------------------------------------------
        # Full resume text
        # ------------------------------------------

        resume_text = cls.build_resume_text(
            resume
        )

        evidence.update(
            cls.extract_technical_keywords(
                resume_text
            )
        )

        return evidence

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
    # Extract Technical Keywords
    # ==========================================================

    @classmethod
    def extract_technical_keywords(
        cls,
        text: str,
    ) -> set[str]:

        normalized_text = cls.normalize(
            text
        )

        found = set()

        for keyword in TECH_KEYWORDS:

            keyword_normalized = cls.normalize(
                keyword
            )

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
        # Improved skills
        # ------------------------------------------

        improved_skills = [
            skill
            for skill in tailored.improved_skills
            if cls.normalize(skill)
            in resume_skills
        ]

        # ------------------------------------------
        # Keywords to add
        #
        # These must NOT already exist in resume.
        # ------------------------------------------

        keywords_to_add = [
            keyword
            for keyword in tailored.keywords_to_add
            if cls.normalize(keyword)
            not in resume_skills
        ]

        # ------------------------------------------
        # Existing projects only
        # ------------------------------------------

        project_improvements = [
            project
            for project in tailored.project_improvements
            if cls.normalize(project.title)
            in project_titles
        ]

        # ------------------------------------------
        # Existing companies only
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
    # Future / Learning Reference
    # ==========================================================

    @classmethod
    def is_future_or_learning_reference(
        cls,
        text: str,
        technology: str,
    ) -> bool:

        tech = re.escape(
            cls.normalize(technology)
        )

        future_patterns = [

            # --------------------------------------
            # Learning
            # --------------------------------------

            rf"\beager to (learn|explore|develop skills in)\s+{tech}\b",

            rf"\binterested in (learning|exploring)\s+{tech}\b",

            rf"\blooking to (learn|explore|develop skills in)\s+{tech}\b",

            rf"\bcurrently learning\s+{tech}\b",

            rf"\bwant to (learn|explore)\s+{tech}\b",

            rf"\bhope to (learn|explore)\s+{tech}\b",

            # --------------------------------------
            # Skill development
            # --------------------------------------

            rf"\bexpand(ing)? my skills in\s+{tech}\b",

            rf"\b(build|develop|strengthen) my skills in\s+{tech}\b",

            rf"\bgain(ing)? experience (with|in)\s+{tech}\b",

            # --------------------------------------
            # Career transition
            # --------------------------------------

            rf"\btransition(ing)? (to|into)\s+{tech}\b",

            rf"\btransition my .* to\s+{tech}\b",
        ]

        normalized_text = cls.normalize(
            text
        )

        return any(
            re.search(
                pattern,
                normalized_text,
            )
            for pattern in future_patterns
        )

    # ==========================================================
    # Strong Existing Experience Claims
    # ==========================================================

    @classmethod
    def has_strong_usage_claim(
        cls,
        text: str,
        technology: str,
    ) -> bool:

        tech = re.escape(
            cls.normalize(technology)
        )

        strong_patterns = [

            rf"\bused\s+{tech}\b",

            rf"\bworked with\s+{tech}\b",

            rf"\bworked on\s+{tech}\b",

            rf"\bbuilt with\s+{tech}\b",

            rf"\bbuilt using\s+{tech}\b",

            rf"\bdeveloped with\s+{tech}\b",

            rf"\bdeveloped using\s+{tech}\b",

            rf"\bimplemented with\s+{tech}\b",

            rf"\bimplemented using\s+{tech}\b",

            rf"\bdeployed with\s+{tech}\b",

            rf"\bdeployed using\s+{tech}\b",

            rf"\bexperience with\s+{tech}\b",

            rf"\bexperience in\s+{tech}\b",

            rf"\bproficient in\s+{tech}\b",

            rf"\bexpertise in\s+{tech}\b",

            rf"\bskilled in\s+{tech}\b",

            rf"\bstrong experience in\s+{tech}\b",

            rf"\bstrong experience with\s+{tech}\b",
        ]

        normalized_text = cls.normalize(
            text
        )

        return any(
            re.search(
                pattern,
                normalized_text,
            )
            for pattern in strong_patterns
        )

    # ==========================================================
    # Find Cover Letter Errors
    # ==========================================================

    @classmethod
    def find_cover_letter_errors(
        cls,
        resume: ParsedResume,
        cover_letter: CoverLetterResponse,
    ) -> list[str]:

        errors = []

        # ------------------------------------------
        # Combine generated content
        # ------------------------------------------

        text = (
            f"{cover_letter.cover_letter}\n"
            f"{cover_letter.email_body}"
        )

        normalized_text = cls.normalize(
            text
        )

        # ------------------------------------------
        # Resume skills
        # ------------------------------------------

        resume_skills = cls.get_resume_skills(
            resume
        )

        # ------------------------------------------
        # Technologies explicitly supported
        # by the complete resume
        # ------------------------------------------

        resume_technical_evidence = (
            cls.get_resume_technical_evidence(
                resume
            )
        )

        # ------------------------------------------
        # Technologies explicitly used
        # in experience/projects
        # ------------------------------------------

        used_technologies = (
            cls.get_used_technologies(
                resume
            )
        )

        # ------------------------------------------
        # Technical keywords mentioned
        # in cover letter
        # ------------------------------------------

        mentioned_technologies = (
            cls.extract_technical_keywords(
                text
            )
        )

        # ==================================================
        # Unsupported Technologies
        # ==================================================

        for technology in sorted(
            mentioned_technologies
        ):

            # --------------------------------------
            # Technology exists anywhere in resume
            # --------------------------------------

            if technology in resume_technical_evidence:

                continue

            # --------------------------------------
            # Missing technology used as a future /
            # learning target is allowed.
            #
            # Example:
            #
            # "I am eager to expand my skills in Java."
            # --------------------------------------

            if cls.is_future_or_learning_reference(
                text,
                technology,
            ):

                continue

            # --------------------------------------
            # Unsupported technology
            # --------------------------------------

            errors.append(
                f"Unsupported technology mentioned "
                f"in cover letter: {technology}"
            )

        # ==================================================
        # Strong Usage Claims
        #
        # If a technology appears ONLY in the general
        # resume skills section, do not allow the LLM
        # to make strong experience claims unless the
        # resume contains actual evidence.
        # ==================================================

        for technology in sorted(
            mentioned_technologies
        ):

            # --------------------------------------
            # Not even present in resume
            # --------------------------------------

            if technology not in resume_skills:

                continue

            # --------------------------------------
            # Explicitly supported by experience /
            # project evidence
            # --------------------------------------

            if technology in used_technologies:

                continue

            # --------------------------------------
            # Future / learning statement
            # --------------------------------------

            if cls.is_future_or_learning_reference(
                text,
                technology,
            ):

                continue

            # --------------------------------------
            # Strong unsupported usage claim
            # --------------------------------------

            if cls.has_strong_usage_claim(
                text,
                technology,
            ):

                errors.append(
                    f"Unsupported usage claim for "
                    f"{technology}: technology appears "
                    f"only in the resume skills section."
                )

        # ==================================================
        # Unsupported Technical Concepts
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

        # ------------------------------------------
        # Full resume text
        # ------------------------------------------

        resume_text = cls.build_resume_text(
            resume
        )

        # ------------------------------------------
        # Validate concepts
        # ------------------------------------------

        for phrase, display_name in (
            unsupported_concepts.items()
        ):

            if phrase not in normalized_text:

                continue

            if phrase in resume_text:

                continue

            # Future / learning reference is okay.
            if cls.is_future_or_learning_reference(
                text,
                phrase,
            ):

                continue

            errors.append(
                f"Unsupported technical concept "
                f"mentioned: {display_name}"
            )

        # ==================================================
        # Remove duplicate errors
        # ==================================================

        return list(
            dict.fromkeys(errors)
        )

    # ==========================================================
    # Build Complete Resume Text
    # ==========================================================

    @classmethod
    def build_resume_text(
        cls,
        resume: ParsedResume,
    ) -> str:

        parts = []

        # ------------------------------------------
        # Summary
        # ------------------------------------------

        if resume.summary:

            parts.append(
                resume.summary
            )

        # ------------------------------------------
        # Skills
        # ------------------------------------------

        for skill_list in resume.skills.values():

            parts.extend(
                skill_list
            )

        # ------------------------------------------
        # Experience
        # ------------------------------------------

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

        # ------------------------------------------
        # Projects
        # ------------------------------------------

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