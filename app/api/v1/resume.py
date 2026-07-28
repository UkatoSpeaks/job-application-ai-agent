from pathlib import Path
import shutil

from fastapi import APIRouter, UploadFile, File

from app.schemas.resume import ResumeResponse
from app.services.resume.extractor import ResumeExtractor
from app.utils.file_utils import validate_pdf

router = APIRouter(prefix="/resume", tags=["Resume"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(file: UploadFile = File(...)):
    validate_pdf(file)

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = ResumeExtractor.extract_text(str(file_path))

    return ResumeResponse(
        filename=file.filename,
        extracted_text=extracted_text,
    )