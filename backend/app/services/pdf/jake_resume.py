from io import BytesIO
from typing import Any, Dict, List, Union

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    ListFlowable,
    ListItem,
)

from app.schemas.resume import ParsedResume


class JakeResumePDFGenerator:

    @classmethod
    def generate(cls, resume_data: Union[ParsedResume, Dict[str, Any]]) -> bytes:
        """
        Generate a PDF in the classic Jake's Resume Template style.
        Returns PDF bytes.
        """
        # Convert schema to dict if needed
        if isinstance(resume_data, ParsedResume):
            data = resume_data.model_dump()
        else:
            data = resume_data

        buffer = BytesIO()

        # Jake's Resume uses tight 0.5 inch margins
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        usable_width = doc.width  # 612 - 72 = 540 pt

        styles = getSampleStyleSheet()

        # Custom typography styles
        name_style = ParagraphStyle(
            'JakeName',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=24,
            alignment=1,  # Center
            textColor=colors.HexColor('#0f172a'),
            spaceAfter=4,
        )

        contact_style = ParagraphStyle(
            'JakeContact',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            alignment=1,  # Center
            textColor=colors.HexColor('#334155'),
            spaceAfter=12,
        )

        section_heading_style = ParagraphStyle(
            'JakeSectionHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=13,
            textColor=colors.HexColor('#0f172a'),
            spaceBefore=8,
            spaceAfter=2,
        )

        item_title_left = ParagraphStyle(
            'JakeItemTitleLeft',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=12,
            textColor=colors.HexColor('#0f172a'),
        )

        item_title_right = ParagraphStyle(
            'JakeItemTitleRight',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9.5,
            leading=12,
            alignment=2,  # Right
            textColor=colors.HexColor('#0f172a'),
        )

        item_sub_left = ParagraphStyle(
            'JakeItemSubLeft',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=9.5,
            leading=12,
            textColor=colors.HexColor('#334155'),
        )

        item_sub_right = ParagraphStyle(
            'JakeItemSubRight',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=9,
            leading=12,
            alignment=2,  # Right
            textColor=colors.HexColor('#475569'),
        )

        body_style = ParagraphStyle(
            'JakeBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#1e293b'),
        )

        bullet_style = ParagraphStyle(
            'JakeBullet',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12.5,
            textColor=colors.HexColor('#1e293b'),
            spaceAfter=2,
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
        if contact_info.get('linkedin'):
            contact_parts.append(contact_info['linkedin'])
        if contact_info.get('github'):
            contact_parts.append(contact_info['github'])
        if contact_info.get('location'):
            contact_parts.append(contact_info['location'])

        contact_line = " | ".join(contact_parts) if contact_parts else "Email | Phone | Location"

        story.append(Paragraph(name, name_style))
        story.append(Paragraph(contact_line, contact_style))

        # Helper to add section header with horizontal rule
        def add_section_header(title_text: str):
            story.append(Paragraph(title_text.upper(), section_heading_style))
            story.append(
                HRFlowable(
                    width="100%",
                    thickness=0.8,
                    color=colors.HexColor("#0f172a"),
                    spaceBefore=1,
                    spaceAfter=6,
                )
            )

        # -------------------------------------------------------------
        # 2. SUMMARY (If present)
        # -------------------------------------------------------------
        summary = data.get('summary')
        if summary:
            add_section_header('Professional Summary')
            story.append(Paragraph(summary, body_style))
            story.append(Spacer(1, 6))

        # -------------------------------------------------------------
        # 3. EDUCATION
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
                story.append(Spacer(1, 4))

        # -------------------------------------------------------------
        # 4. SKILLS
        # -------------------------------------------------------------
        skills = data.get('skills', [])
        if skills:
            add_section_header('Technical Skills')
            if isinstance(skills, list):
                skills_str = ", ".join(skills)
                story.append(Paragraph(f"<b>Languages & Frameworks:</b> {skills_str}", body_style))
            elif isinstance(skills, dict):
                for cat, val in skills.items():
                    val_str = ", ".join(val) if isinstance(val, list) else str(val)
                    story.append(Paragraph(f"<b>{cat}:</b> {val_str}", body_style))
                    story.append(Spacer(1, 2))
            story.append(Spacer(1, 6))

        # -------------------------------------------------------------
        # 5. WORK EXPERIENCE
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

                left_heading = f"<b>{job_title}</b>"
                right_heading = f"<b>{dates}</b>" if dates else ""
                left_sub = f"{company}"
                right_sub = f"{location}"

                table_data = [
                    [Paragraph(left_heading, item_title_left), Paragraph(right_heading, item_title_right)],
                    [Paragraph(left_sub, item_sub_left), Paragraph(right_sub, item_sub_right)],
                ]

                t = Table(table_data, colWidths=[usable_width * 0.70, usable_width * 0.30])
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('TOPPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
                ]))
                story.append(t)

                # Responsibilities bullet points
                resps = exp.get('responsibilities') or exp.get('bullet_points') or []
                if resps:
                    story.append(Spacer(1, 2))
                    for resp in resps:
                        bullet_item = Paragraph(f"• {resp}", bullet_style)
                        story.append(bullet_item)
                story.append(Spacer(1, 6))

        # -------------------------------------------------------------
        # 6. PROJECTS
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

                t = Table([[Paragraph(heading_left, item_title_left), Paragraph('', item_title_right)]], colWidths=[usable_width * 0.8, usable_width * 0.2])
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
                story.append(Spacer(1, 4))

        # Build document
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
