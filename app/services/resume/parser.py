import re

from app.schemas.resume import ParsedResume
from app.services.resume.section_parser import SectionParser
from app.services.resume.skils_parser import SkillsParser
from app.services.resume.education_parser import EducationParser
from app.services.resume.project_parser import ProjectParser
from app.services.resume.experience_parser import ExperienceParser
from app.services.resume.certification_parser import CertificationParser


class ResumeParser:

    @staticmethod
    def parse(text: str) -> ParsedResume:
        # ---------------------------------
        # Parse Resume Sections
        # ---------------------------------
        sections = SectionParser.parse(text)

        # ---------------------------------
        # Contact Information
        # ---------------------------------
        email = None
        phone = None
        github = None
        linkedin = None
        portfolio = None

        email_match = re.search(
            r"[\w\.-]+@[\w\.-]+\.\w+",
            text
        )

        if email_match:
            email = email_match.group()

        phone_match = re.search(
            r"(\+?\d[\d\s-]{8,}\d)",
            text
        )

        if phone_match:
            phone = phone_match.group()

        github_match = re.search(
            r"github\.com/\S+",
            text,
            re.IGNORECASE
        )

        if github_match:
            github = github_match.group()

        linkedin_match = re.search(
            r"linkedin\.com/\S+",
            text,
            re.IGNORECASE
        )

        if linkedin_match:
            linkedin = linkedin_match.group()

        portfolio_match = re.search(
            r"https?://\S+",
            text,
            re.IGNORECASE
        )

        if portfolio_match:
            portfolio = portfolio_match.group()

        # ---------------------------------
        # Name
        # ---------------------------------
        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        name = lines[0] if lines else None

        # ---------------------------------
        # Parse Individual Sections
        # ---------------------------------
        summary = sections.get("Summary", "")

        skills = SkillsParser.parse(
            sections.get("Technical Skills", "")
        )

        education = EducationParser.parse(
            sections.get("Education", "")
        )

        experience = ExperienceParser.parse(
            sections.get("Experience", "")
        )

        projects = ProjectParser.parse(
            sections.get("Projects", "")
        )

        certifications = CertificationParser.parse(
            sections.get("Certifications", "")
        )

        # ---------------------------------
        # Return Structured Resume
        # ---------------------------------
        return ParsedResume(
            name=name,
            email=email,
            phone=phone,
            github=github,
            linkedin=linkedin,
            portfolio=portfolio,
            summary=summary,
            skills=skills,
            education=education,
            experience=experience,
            projects=projects,
            certifications=certifications,
        )