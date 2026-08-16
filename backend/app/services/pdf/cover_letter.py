from datetime import datetime
from io import BytesIO
from typing import Any, Dict, Union

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer


class CoverLetterPDFGenerator:

    @classmethod
    def generate(cls, cover_letter_data: Union[Dict[str, Any], str], candidate_name: str = "Candidate") -> bytes:
        """
        Generate a polished Cover Letter PDF.
        Returns PDF bytes.
        """
        buffer = BytesIO()

        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=54,  # 0.75 in
            rightMargin=54,
            topMargin=54,
            bottomMargin=54,
        )

        styles = getSampleStyleSheet()

        header_name_style = ParagraphStyle(
            'CoverHeaderName',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=18,
            leading=20,
            textColor=colors.HexColor('#0f172a'),
        )

        header_sub_style = ParagraphStyle(
            'CoverHeaderSub',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor('#475569'),
        )

        meta_style = ParagraphStyle(
            'CoverMeta',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#334155'),
            spaceAfter=6,
        )

        subject_style = ParagraphStyle(
            'CoverSubject',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=15,
            textColor=colors.HexColor('#0f172a'),
            spaceBefore=10,
            spaceAfter=12,
        )

        body_style = ParagraphStyle(
            'CoverBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=15,
            textColor=colors.HexColor('#1e293b'),
            spaceAfter=12,
        )

        story = []

        # Parse payload
        if isinstance(cover_letter_data, str):
            content = cover_letter_data
            company = "Hiring Team"
            job_title = ""
            subject = "Job Application"
        else:
            content = (
                cover_letter_data.get('cover_letter')
                or cover_letter_data.get('content')
                or cover_letter_data.get('email_body')
                or ""
            )
            company = cover_letter_data.get('company') or "Hiring Team"
            job_title = cover_letter_data.get('job_title') or cover_letter_data.get('role') or ""
            subject = cover_letter_data.get('email_subject') or f"Application for {job_title}" if job_title else "Job Application"
            if cover_letter_data.get('recipient'):
                company = f"{cover_letter_data['recipient']} - {company}"

        # 1. Candidate Header
        story.append(Paragraph(candidate_name, header_name_style))
        story.append(Spacer(1, 4))
        story.append(
            HRFlowable(
                width="100%",
                thickness=1,
                color=colors.HexColor("#0f172a"),
                spaceBefore=2,
                spaceAfter=12,
            )
        )

        # 2. Date & Recipient Info
        today_str = datetime.now().strftime("%B %d, %Y")
        story.append(Paragraph(today_str, meta_style))
        story.append(Spacer(1, 6))

        story.append(Paragraph(f"<b>To:</b> Hiring Manager / Recruitment Team", meta_style))
        story.append(Paragraph(f"<b>Company:</b> {company}", meta_style))
        if job_title:
            story.append(Paragraph(f"<b>Position:</b> {job_title}", meta_style))

        story.append(Spacer(1, 8))

        # 3. Subject Line
        story.append(Paragraph(f"RE: {subject}", subject_style))

        # 4. Body Paragraphs
        # Split content into paragraphs if newline delimited
        paragraphs = content.split("\n\n") if "\n\n" in content else content.split("\n")
        for p in paragraphs:
            clean_p = p.strip().replace("\n", " ")
            if clean_p:
                story.append(Paragraph(clean_p, body_style))

        # 5. Sign Off (if not already included in content)
        if "Sincerely" not in content and "Best regards" not in content:
            story.append(Spacer(1, 12))
            story.append(Paragraph("Sincerely,", body_style))
            story.append(Spacer(1, 16))
            story.append(Paragraph(f"<b>{candidate_name}</b>", body_style))

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
