from pathlib import Path

from app.schemas.resume import ParsedResume

from app.services.resume.preprocess.text_cleaner import TextCleaner

from app.services.resume.parsers.contact_parser import ContactParser
from app.services.resume.parsers.section_parser import SectionParser
from app.services.resume.parsers.skils_parser import SkillsParser
from app.services.resume.parsers.education_parser import EducationParser
from app.services.resume.parsers.experience_parser import ExperienceParser
from app.services.resume.parsers.project_parser import ProjectParser
from app.services.resume.parsers.certification_parser import CertificationParser

print(f">>> ResumeParser module loaded from: {Path(__file__).resolve()}")


class ResumeParser:

    @staticmethod
    def parse(text: str) -> ParsedResume:

        print("\n==============================")
        print(">>> ResumeParser.parse() called <<<")
        print("==============================\n")

        # ---------------------------------
        # Raw Text
        # ---------------------------------
        print("RAW TEXT (first 300 chars):")
        print(text[:300])
        print()

        # ---------------------------------
        # Clean Text
        # ---------------------------------
        text = TextCleaner.clean(text)

        print("CLEANED TEXT (first 300 chars):")
        print(text[:300])
        print()

        # ---------------------------------
        # Parse Sections
        # ---------------------------------
        sections = SectionParser.parse(text)

        print("========== PARSED SECTIONS ==========")

        for key, value in sections.items():
            print(f"\n[{key}]")
            print(value[:500])
            print("-----------------------------------")

        print("====================================\n")

        # ---------------------------------
        # Contact
        # ---------------------------------
        contact = ContactParser.parse(text)

        print("CONTACT")
        print(contact)
        print()

        # ---------------------------------
        # Summary
        # ---------------------------------
        summary = sections.get("Summary", "")

        print("SUMMARY")
        print(summary)
        print()

        # ---------------------------------
        # Skills
        # ---------------------------------
        skills = SkillsParser.parse(
            sections.get("Technical Skills", "")
        )

        print("SKILLS")
        print(skills)
        print()

        # ---------------------------------
        # Education
        # ---------------------------------
        education = EducationParser.parse(
            sections.get("Education", "")
        )

        print("EDUCATION")
        print(education)
        print()

        # ---------------------------------
        # Experience
        # ---------------------------------
        experience = ExperienceParser.parse(
            sections.get("Experience", "")
        )

        print("EXPERIENCE")
        print(experience)
        print()

        # ---------------------------------
        # Projects Section
        # ---------------------------------
        project_text = sections.get("Projects", "")

        print("PROJECT SECTION")
        print("-----------------------------------")
        print(repr(project_text))
        print("-----------------------------------\n")

        projects = ProjectParser.parse(project_text)

        print("PARSED PROJECTS")
        print(projects)
        print()

        # ---------------------------------
        # Certifications
        # ---------------------------------
        certifications = CertificationParser.parse(
            sections.get("Certifications", "")
        )

        print("CERTIFICATIONS")
        print(certifications)
        print()

        print("========== FINAL ==========")
        print(f"Projects Parsed: {len(projects)}")
        print("===========================\n")

        return ParsedResume(
            name=contact["name"],
            email=contact["email"],
            phone=contact["phone"],
            github=contact["github"],
            linkedin=contact["linkedin"],
            portfolio=contact["portfolio"],
            summary=summary,
            skills=skills,
            education=education,
            experience=experience,
            projects=projects,
            certifications=certifications,
        )