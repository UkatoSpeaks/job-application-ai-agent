from typing import Any, Dict, Optional
from fastapi import APIRouter, Body, HTTPException, Response
from pydantic import BaseModel

from app.schemas.resume import ParsedResume
from app.services.pdf import CoverLetterPDFGenerator, JakeResumePDFGenerator

router = APIRouter(
    prefix="/export",
    tags=["Export"],
)


class CoverLetterExportRequest(BaseModel):
    cover_letter: Optional[str] = None
    content: Optional[str] = None
    email_body: Optional[str] = None
    email_subject: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    role: Optional[str] = None
    recipient: Optional[str] = None
    candidate_name: Optional[str] = "Candidate"


@router.post("/resume-pdf")
async def export_resume_pdf(
    payload: Dict[str, Any] = Body(...),
):
    """
    Generate and stream a PDF of the candidate resume formatted in Jake's Resume Template.
    """
    try:
        # Extract parsed resume object if wrapped inside a parent response object
        resume_data = payload.get("tailored_resume") or payload.get("parsed_resume") or payload.get("original_resume") or payload

        pdf_bytes = JakeResumePDFGenerator.generate(resume_data)

        # Extract filename
        contact_info = resume_data.get("contact_info", {}) if isinstance(resume_data, dict) else {}
        candidate_name = contact_info.get("name") or "Candidate"
        clean_name = candidate_name.replace(" ", "_")
        filename = f"{clean_name}_Jake_Resume.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition",
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate resume PDF: {str(e)}",
        )


@router.post("/cover-letter-pdf")
async def export_cover_letter_pdf(
    payload: CoverLetterExportRequest = Body(...),
):
    """
    Generate and stream a PDF of the cover letter.
    """
    try:
        data_dict = payload.model_dump()
        candidate_name = payload.candidate_name or "Candidate"

        pdf_bytes = CoverLetterPDFGenerator.generate(
            cover_letter_data=data_dict,
            candidate_name=candidate_name,
        )

        company_clean = (payload.company or "Company").replace(" ", "_")
        filename = f"Cover_Letter_{company_clean}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition",
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate cover letter PDF: {str(e)}",
        )
