from pathlib import Path
import shutil

from fastapi import APIRouter, UploadFile, File

from app.services.resume.extractor import ResumeExtractor
from app.services.resume.parser import ResumeParser
from app.services.resume.validator import ResumeValidator
from app.services.resume.scorer import ResumeScorer

from app.utils.file_utils import validate_pdf

router = APIRouter(prefix="/resume", tags=["Resume"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    validate_pdf(file)

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = ResumeExtractor.extract_text(str(file_path))

    parsed_resume = ResumeParser.parse(extracted_text)

    validation = ResumeValidator.validate(parsed_resume)

    score = ResumeScorer.score(
        parsed_resume,
        validation,
    )

    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "parsed_resume": parsed_resume,
        "validation": validation,
        "score": score,
    }