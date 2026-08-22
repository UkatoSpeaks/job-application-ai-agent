from io import BytesIO
from typing import Any, Dict, List, Union

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)

from app.schemas.resume import ParsedResume


def categorize_skills(skills: Any) -> List[Dict[str, Any]]:
    if not skills:
        return []

    if isinstance(skills, dict):
        return [{"category": k, "skills": v if isinstance(v, list) else [str(v)]} for k, v in skills.items() if v]

    skill_list = skills if isinstance(skills, list) else [str(skills)]
    if not skill_list:
        return []

    category_map = [
        ("Languages", ["c++", "cpp", "c#", "c", "python", "javascript", "typescript", "java", "sql", "html", "css", "go", "rust", "ruby", "php", "kotlin", "swift"]),
        ("Frontend", ["react", "react.js", "reactjs", "next.js", "nextjs", "vue", "vue.js", "angular", "tailwind css", "tailwind", "bootstrap", "html5", "css3", "redux", "web vitals"]),
        ("Backend", ["node.js", "nodejs", "express", "express.js", "fastapi", "flask", "django", "spring boot", "rest api", "rest apis", "restful apis", "graphql", "microservices"]),
        ("AI / GenAI", ["langchain", "langgraph", "rag", "mistral ai", "groq", "openai", "llama", "vector databases", "chromadb", "pinecone", "hugging face", "prompt engineering"]),
        ("Databases", ["mongodb", "postgresql", "postgres", "mysql", "sqlite", "firebase", "chromadb", "redis", "dynamodb", "supabase"]),
        ("Tools & Platforms", ["git", "github", "docker", "kubernetes", "postman", "render", "vercel", "aws", "gcp", "azure", "linux", "ci/cd", "jest", "cypress"]),
    ]

    result = []
    assigned = set()

    for cat_name, matchers in category_map:
        matched = []
        for skill in skill_list:
            if skill in assigned:
                continue
            lower = skill.lower().strip()
            if any(lower == m or lower.startswith(m + " ") or lower.endswith(" " + m) for m in matchers):
                matched.append(skill)
                assigned.add(skill)
        if matched:
            result.append({"category": cat_name, "skills": matched})

    remaining = [s for s in skill_list if s not in assigned]
    if remaining:
        result.append({"category": "Other Skills", "skills": remaining})

    return result


class JakeResumePDFGenerator:

    @classmethod
    def generate(cls, resume_data: Union[ParsedResume, Dict[str, Any]]) -> bytes:
        """
        Generate a single-page PDF in the classic Jake's Resume Template style.
        """
        if isinstance(resume_data, ParsedResume):
            data = resume_data.model_dump()
        else:
            data = resume_data

        buffer = BytesIO()

        # Tight 28pt (approx 0.38 inch) margins for strict 1-page fit
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=28,
            rightMargin=28,
            topMargin=28,
            bottomMargin=28,
        )

        usable_width = doc.width  # 612 - 56 = 556 pt

        styles = getSampleStyleSheet()

        # Typography styles tuned for 1-page fit
        name_style = ParagraphStyle(
            'JakeName',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=20,
            leading=22,
            alignment=1,  # Center
            textColor=colors.HexColor('#0f172a'),
            spaceAfter=3,
        )

        contact_style = ParagraphStyle(
            'JakeContact',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8.5,
            leading=11,
            alignment=1,  # Center
            textColor=colors.HexColor('#334155'),
            spaceAfter=8,
        )

        section_heading_style = ParagraphStyle(
            'JakeSectionHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=12,
            textColor=colors.HexColor('#0f172a'),
            spaceBefore=6,
            spaceAfter=2,
        )

        item_title_left = ParagraphStyle(
            'JakeItemTitleLeft',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9.5,
            leading=11.5,
            textColor=colors.HexColor('#0f172a'),
        )

        item_title_right = ParagraphStyle(
            'JakeItemTitleRight',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=11.5,
            alignment=2,  # Right
            textColor=colors.HexColor('#0f172a'),
        )

        item_sub_left = ParagraphStyle(
            'JakeItemSubLeft',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor('#334155'),
        )

        item_sub_right = ParagraphStyle(
            'JakeItemSubRight',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=8.5,
            leading=11,
            alignment=2,  # Right
            textColor=colors.HexColor('#475569'),
        )

        body_style = ParagraphStyle(
            'JakeBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor('#1e293b'),
        )

        bullet_style = ParagraphStyle(
            'JakeBullet',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8.5,
            leading=11.5,
            textColor=colors.HexColor('#1e293b'),
            spaceAfter=1.5,
        )

        story = []

        # -------------------------------------------------------------
        # 1. HEADER (Candidate Name & Contact Details)
        # -------------------------------------------------------------
        contact_info = data.get('contact_info', {}) or {}
        name = contact_info.get('name') or data.get('name') or 'Candidate Name'

        contact_parts = []
        if contact_info.get('phone'):
            contact_parts.append(contact_info['phone'])
        if contact_info.get('email'):
            contact_parts.append(contact_info['email'])
        if contact_info.get('location'):
            contact_parts.append(contact_info['location'])
        if contact_info.get('linkedin'):
            contact_parts.append(contact_info['linkedin'])
        if contact_info.get('github'):
            contact_parts.append(contact_info['github'])
        if contact_info.get('portfolio'):
            contact_parts.append(contact_info['portfolio'])

        contact_line = " | ".join(contact_parts) if contact_parts else "Email | Phone | Location"

        story.append(Paragraph(name, name_style))
        story.append(Paragraph(contact_line, contact_style))

        def add_section_header(title_text: str):
            story.append(Paragraph(title_text.upper(), section_heading_style))
            story.append(
                HRFlowable(
                    width="100%",
                    thickness=0.8,
                    color=colors.HexColor("#0f172a"),
                    spaceBefore=1,
                    spaceAfter=4,
                )
            )

        # -------------------------------------------------------------
        # 1. SUMMARY
        # -------------------------------------------------------------
        summary = data.get('summary')
        if summary:
            add_section_header('Summary')
            story.append(Paragraph(summary, body_style))
            story.append(Spacer(1, 4))

        # -------------------------------------------------------------
        # 2. TECHNICAL SKILLS (Categorized)
        # -------------------------------------------------------------
        skills_raw = data.get('skills', [])
        if skills_raw:
            categorized = categorize_skills(skills_raw)
            if categorized:
                add_section_header('Technical Skills')
                for cat in categorized:
                    cat_name = cat['category']
                    skills_str = ", ".join(cat['skills'])
                    story.append(Paragraph(f"<b>{cat_name}:</b> {skills_str}", body_style))
                    story.append(Spacer(1, 1.5))
                story.append(Spacer(1, 3))

        # -------------------------------------------------------------
        # 3. WORK EXPERIENCE
        # -------------------------------------------------------------
        work_exp = data.get('work_experience') or data.get('experience') or []
        if work_exp:
            add_section_header('Experience')
            for exp in work_exp:
                job_title = exp.get('job_title') or exp.get('role') or ''
                company = exp.get('company', '')
                dates = exp.get('start_date') or exp.get('duration') or ''
                if exp.get('end_date') and exp.get('start_date'):
                    dates = f"{exp['start_date']} – {exp['end_date']}"
                location = exp.get('location') or ''

                left_heading = f"<b>{company}</b>" if company else f"<b>{job_title}</b>"
                right_heading = f"<b>{dates}</b>" if dates else ""
                left_sub = f"{job_title}" if company else ""
                right_sub = f"{location}"

                table_data = [
                    [Paragraph(left_heading, item_title_left), Paragraph(right_heading, item_title_right)],
                ]
                if left_sub or right_sub:
                    table_data.append([Paragraph(left_sub, item_sub_left), Paragraph(right_sub, item_sub_right)])

                t = Table(table_data, colWidths=[usable_width * 0.72, usable_width * 0.28])
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
                ]))
                story.append(t)

                resps = exp.get('responsibilities') or exp.get('bullet_points') or []
                if resps:
                    story.append(Spacer(1, 1))
                    for resp in resps:
                        story.append(Paragraph(f"• {resp}", bullet_style))
                story.append(Spacer(1, 4))

        # -------------------------------------------------------------
        # 4. PROJECTS
        # -------------------------------------------------------------
        projects = data.get('projects', [])
        if projects:
            add_section_header('Projects')
            for proj in projects:
                title = proj.get('title', '')
                desc = proj.get('description', '')
                techs = proj.get('technologies') or proj.get('tech_stack') or []

                tech_str = f" | <i>{', '.join(techs)}</i>" if techs else ""
                heading_left = f"<b>{title}</b>{tech_str}"

                t = Table([[Paragraph(heading_left, item_title_left), Paragraph('', item_title_right)]], colWidths=[usable_width * 0.82, usable_width * 0.18])
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
                ]))
                story.append(t)

                if desc:
                    if isinstance(desc, list):
                        for d in desc:
                            story.append(Paragraph(f"• {d}", bullet_style))
                    else:
                        story.append(Paragraph(f"• {desc}", bullet_style))
                story.append(Spacer(1, 3))

        # -------------------------------------------------------------
        # 5. EDUCATION
        # -------------------------------------------------------------
        education_list = data.get('education', [])
        if education_list:
            add_section_header('Education')
            for edu in education_list:
                institution = edu.get('institution', '')
                degree = edu.get('degree', '')
                year = edu.get('graduation_year') or edu.get('year') or ''
                field = edu.get('field_of_study') or ''

                left_title = f"<b>{institution}</b>" if institution else f"<b>{degree}</b>"
                right_title = f"{year}"
                left_sub = f"{degree}" + (f" in {field}" if field else "") if institution else ""

                table_data = [
                    [Paragraph(left_title, item_title_left), Paragraph(right_title, item_title_right)],
                ]
                if left_sub:
                    table_data.append([Paragraph(left_sub, item_sub_left), Paragraph('', item_sub_right)])

                t = Table(table_data, colWidths=[usable_width * 0.75, usable_width * 0.25])
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
                ]))
                story.append(t)
                story.append(Spacer(1, 3))

        # -------------------------------------------------------------
        # 6. CERTIFICATIONS (If present)
        # -------------------------------------------------------------
        certifications = data.get('certifications', [])
        if certifications:
            add_section_header('Certifications')
            cert_str = " | ".join([c if isinstance(c, str) else c.get('title', '') for c in certifications if c])
            story.append(Paragraph(cert_str, body_style))
            story.append(Spacer(1, 3))

        # Build single-page document
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
