import re

from app.schemas.resume import ParsedResume
from app.schemas.validation import (
    ValidationIssue,
    ValidationResult,
)


EMAIL_REGEX = re.compile(
    r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
)

PHONE_REGEX = re.compile(
    r"^\+?[0-9\s()-]{10,15}$"
)


class ResumeValidator:

    @classmethod
    def validate(cls, resume: ParsedResume) -> ValidationResult:

        result = ValidationResult()

        cls.validate_contact(resume, result)
        cls.validate_summary(resume, result)
        cls.validate_skills(resume, result)
        cls.validate_education(resume, result)
        cls.validate_experience(resume, result)
        cls.validate_projects(resume, result)
        cls.validate_certifications(resume, result)

        result.valid = len(result.errors) == 0

        return result

    # ============================================================
    # Contact
    # ============================================================

    @classmethod
    def validate_contact(
        cls,
        resume: ParsedResume,
        result: ValidationResult,
    ) -> None:

        if not resume.name:
            result.errors.append(
                ValidationIssue(
                    field="name",
                    severity="error",
                    message="Candidate name is missing."
                )
            )

        if not resume.email:
            result.errors.append(
                ValidationIssue(
                    field="email",
                    severity="error",
                    message="Email address is missing."
                )
            )

        elif not EMAIL_REGEX.match(resume.email):
            result.errors.append(
                ValidationIssue(
                    field="email",
                    severity="error",
                    message="Invalid email address."
                )
            )

        if not resume.phone:
            result.warnings.append(
                ValidationIssue(
                    field="phone",
                    severity="warning",
                    message="Phone number is missing."
                )
            )

        elif not PHONE_REGEX.match(resume.phone):
            result.warnings.append(
                ValidationIssue(
                    field="phone",
                    severity="warning",
                    message="Phone number appears invalid."
                )
            )

        if not resume.github:
            result.warnings.append(
                ValidationIssue(
                    field="github",
                    severity="warning",
                    message="GitHub profile is missing."
                )
            )

        if not resume.linkedin:
            result.warnings.append(
                ValidationIssue(
                    field="linkedin",
                    severity="warning",
                    message="LinkedIn profile is missing."
                )
            )

        if not resume.portfolio:
            result.info.append(
                ValidationIssue(
                    field="portfolio",
                    severity="info",
                    message="Portfolio website not provided."
                )
            )

    # ============================================================
    # Summary
    # ============================================================

    @classmethod
    def validate_summary(
        cls,
        resume: ParsedResume,
        result: ValidationResult,
    ) -> None:

        if not resume.summary:

            result.warnings.append(
                ValidationIssue(
                    field="summary",
                    severity="warning",
                    message="Professional summary is missing."
                )
            )

            return

        if len(resume.summary) < 40:
            result.warnings.append(
                ValidationIssue(
                    field="summary",
                    severity="warning",
                    message="Professional summary is too short."
                )
            )

        if len(resume.summary) > 500:
            result.info.append(
                ValidationIssue(
                    field="summary",
                    severity="info",
                    message="Professional summary is unusually long."
                )
            )

    # ============================================================
    # Skills
    # ============================================================

    @classmethod
    def validate_skills(
        cls,
        resume: ParsedResume,
        result: ValidationResult,
    ) -> None:

        if not resume.skills:

            result.errors.append(
                ValidationIssue(
                    field="skills",
                    severity="error",
                    message="No technical skills found."
                )
            )

            return

        total_skills = sum(
            len(items)
            for items in resume.skills.values()
        )

        if total_skills < 5:
            result.warnings.append(
                ValidationIssue(
                    field="skills",
                    severity="warning",
                    message="Very few technical skills detected."
                )
            )

    # ============================================================
    # Education
    # ============================================================

    @classmethod
    def validate_education(
        cls,
        resume: ParsedResume,
        result: ValidationResult,
    ) -> None:

        if not resume.education:

            result.errors.append(
                ValidationIssue(
                    field="education",
                    severity="error",
                    message="Education section is missing."
                )
            )

            return

        for index, edu in enumerate(resume.education, start=1):

            if not edu.institution:
                result.warnings.append(
                    ValidationIssue(
                        field=f"education[{index}].institution",
                        severity="warning",
                        message="Institution name missing."
                    )
                )

            if not edu.degree:
                result.warnings.append(
                    ValidationIssue(
                        field=f"education[{index}].degree",
                        severity="warning",
                        message="Degree missing."
                    )
                )

            if not edu.duration:
                result.warnings.append(
                    ValidationIssue(
                        field=f"education[{index}].duration",
                        severity="warning",
                        message="Education duration missing."
                    )
                )

    # ============================================================
    # Experience
    # ============================================================

    @classmethod
    def validate_experience(
        cls,
        resume: ParsedResume,
        result: ValidationResult,
    ) -> None:

        if not resume.experience:

            result.warnings.append(
                ValidationIssue(
                    field="experience",
                    severity="warning",
                    message="No work experience found."
                )
            )

            return

        for index, exp in enumerate(resume.experience, start=1):

            if not exp.company:
                result.warnings.append(
                    ValidationIssue(
                        field=f"experience[{index}].company",
                        severity="warning",
                        message="Company name missing."
                    )
                )

            if not exp.role:
                result.warnings.append(
                    ValidationIssue(
                        field=f"experience[{index}].role",
                        severity="warning",
                        message="Role missing."
                    )
                )

            if not exp.duration:
                result.warnings.append(
                    ValidationIssue(
                        field=f"experience[{index}].duration",
                        severity="warning",
                        message="Experience duration missing."
                    )
                )

    # ============================================================
    # Projects
    # ============================================================

    @classmethod
    def validate_projects(
        cls,
        resume: ParsedResume,
        result: ValidationResult,
    ) -> None:

        if not resume.projects:

            result.errors.append(
                ValidationIssue(
                    field="projects",
                    severity="error",
                    message="Projects section is missing."
                )
            )

            return

        if len(resume.projects) == 1:

            result.warnings.append(
                ValidationIssue(
                    field="projects",
                    severity="warning",
                    message="Only one project detected."
                )
            )

        for index, project in enumerate(resume.projects, start=1):

            if not project.title:
                result.warnings.append(
                    ValidationIssue(
                        field=f"projects[{index}].title",
                        severity="warning",
                        message="Project title missing."
                    )
                )

            if not project.tech_stack:
                result.warnings.append(
                    ValidationIssue(
                        field=f"projects[{index}].tech_stack",
                        severity="warning",
                        message="Tech stack missing."
                    )
                )

            if not project.description:
                result.warnings.append(
                    ValidationIssue(
                        field=f"projects[{index}].description",
                        severity="warning",
                        message="Project description missing."
                    )
                )

    # ============================================================
    # Certifications
    # ============================================================

    @classmethod
    def validate_certifications(
        cls,
        resume: ParsedResume,
        result: ValidationResult,
    ) -> None:

        if not resume.certifications:

            result.info.append(
                ValidationIssue(
                    field="certifications",
                    severity="info",
                    message="No certifications found."
                )
            )