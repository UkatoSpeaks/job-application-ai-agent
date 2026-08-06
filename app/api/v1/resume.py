from pathlib import Path
import shutil
import traceback

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
)

from app.schemas.resume import ResumeResponse

from app.services.resume.extractor import ResumeExtractor
from app.services.resume.parser import ResumeParser
from app.services.resume.validator import ResumeValidator
from app.services.resume.scorer import ResumeScorer
from app.services.resume.analyzer import ResumeAnalyzer

from app.services.job_matching.llm_parser import (
    JobDescriptionLLMParser,
)
from app.services.job_matching.matcher import (
    ResumeJobMatcher,
)
from app.services.job_matching.similarity import (
    SimilarityCalculator,
)

from app.utils.file_utils import validate_pdf


router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


# ==========================================================
# Resume Upload
# ==========================================================

@router.post(
    "/upload",
    response_model=ResumeResponse,
)
async def upload_resume(
    file: UploadFile = File(...),
):

    validate_pdf(file)

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = ResumeExtractor.extract_text(
        str(file_path)
    )

    parsed_resume = ResumeParser.parse(
        extracted_text
    )

    validation = ResumeValidator.validate(
        parsed_resume
    )

    score = ResumeScorer.score(
        parsed_resume,
        validation,
    )

    analysis = ResumeAnalyzer.analyze(
        parsed_resume,
        validation,
        score,
    )

    return ResumeResponse(
        filename=file.filename,
        extracted_text=extracted_text,
        parsed_resume=parsed_resume,
        validation=validation,
        score=score,
        analysis=analysis,
    )


# ==========================================================
# Resume ↔ Job Description Matching
# ==========================================================

@router.post("/match")
async def match_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
):

    print("\n========================================")
    print("MATCH ENDPOINT CALLED")
    print("========================================")

    validate_pdf(file)

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ---------------------------------
    # Resume
    # ---------------------------------

    print("\nExtracting Resume...")

    extracted_text = ResumeExtractor.extract_text(
        str(file_path)
    )

    print("Parsing Resume...")

    parsed_resume = ResumeParser.parse(
        extracted_text
    )

    # ---------------------------------
    # Job Description
    # ---------------------------------

    print("\nCalling LLM Parser...")

    try:

        job = JobDescriptionLLMParser.parse(
            job_description
        )

        print("\n========== PARSED JOB ==========")
        print(job)
        print("================================")

    except Exception:

        print("\n========== LLM EXCEPTION ==========")
        traceback.print_exc()
        print("===================================\n")
        raise

    # ---------------------------------
    # Match
    # ---------------------------------

    print("\nCalculating Match...")

    match = ResumeJobMatcher.match(
        parsed_resume,
        job,
    )

    similarity = SimilarityCalculator.percentage(
        parsed_resume,
        job,
    )

    print("\nFinished Matching.")

    return {
        "resume": parsed_resume,
        "job_description": job,
        "match": match,
        "similarity": similarity,
    }