import os
import traceback
from urllib.parse import urlparse

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    UploadFile,
)

from app.services.job_agent.pipeline import (
    JobApplicationPipeline,
)

from app.services.resume.extractor import (
    ResumeExtractor,
)


router = APIRouter(
    prefix="/job-agent",
    tags=["Job Agent"],
)


@router.post("/analyze")
async def analyze_job(
    resume: UploadFile = File(...),
    job_url: str = Form(...),
):

    print(
        "\n========================================"
    )
    print(
        "JOB AGENT API REQUEST"
    )
    print(
        "========================================"
    )

    # =========================================
    # Normalize Job URL
    # =========================================

    job_url = job_url.strip()

    print(
        f"Job URL received: {repr(job_url)}"
    )

    # Handle accidental Markdown URL
    if (
        job_url.startswith("[")
        and "](" in job_url
    ):

        job_url = (
            job_url
            .split("](", 1)[1]
            .rstrip(")")
        )

    print(
        f"Job URL normalized: {repr(job_url)}"
    )

    # =========================================
    # Validate URL
    # =========================================

    parsed_url = urlparse(job_url)

    if parsed_url.scheme not in {
        "http",
        "https",
    }:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid job URL. "
                "Please provide a complete "
                "http/https URL."
            ),
        )

    if not parsed_url.netloc:

        raise HTTPException(
            status_code=400,
            detail="Invalid job URL.",
        )

    # =========================================
    # Validate Resume
    # =========================================

    if not resume.filename:

        raise HTTPException(
            status_code=400,
            detail="Resume file is required.",
        )

    if not resume.filename.lower().endswith(
        ".pdf"
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Only PDF resumes are supported."
            ),
        )

    # =========================================
    # Save Resume
    # =========================================

    upload_dir = "uploads"

    os.makedirs(
        upload_dir,
        exist_ok=True,
    )

    resume_path = os.path.join(
        upload_dir,
        resume.filename,
    )

    try:

        contents = await resume.read()

        if not contents:

            raise HTTPException(
                status_code=400,
                detail="Uploaded resume is empty.",
            )

        with open(
            resume_path,
            "wb",
        ) as file:

            file.write(contents)

        print(
            f"Resume saved: {resume_path}"
        )

        # =========================================
        # Extract Resume Text
        # =========================================

        resume_text = (
            ResumeExtractor.extract_text(
                resume_path
            )
        )

        if not resume_text.strip():

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract text "
                    "from resume."
                ),
            )

        print(
            f"Resume characters: "
            f"{len(resume_text)}"
        )

        # =========================================
        # Run Job Application Pipeline
        # =========================================

        print(
            "\n========== RUNNING PIPELINE =========="
        )

        result = (
            await JobApplicationPipeline.run(
                resume_text=resume_text,
                job_url=job_url,
            )
        )

        # =========================================
        # Extract Results
        # =========================================

        job = result["job"]

        agent_result = result["result"]

        match = agent_result.get(
            "match"
        )

        # =========================================
        # Build Match Response
        # =========================================

        match_response = {

            "score": agent_result.get(
                "match_score"
            ),

            "similarity": agent_result.get(
                "similarity"
            ),

            "matched_skills": (
                match.matched_skills
                if match
                else []
            ),

            "missing_skills": (
                match.missing_skills
                if match
                else []
            ),

            "matched_keywords": (
                match.matched_keywords
                if match
                else []
            ),

            "missing_keywords": (
                match.missing_keywords
                if match
                else []
            ),

            "recommendations": (
                match.recommendations
                if match
                else []
            ),
        }

        # =========================================
        # Final API Response
        # =========================================

        response = {

            "success": True,

            "job": {

                "title": job.title,

                "company": job.company,

                "location": job.location,

                "summary": job.summary,

                "responsibilities": (
                    job.responsibilities
                ),

                "required_skills": (
                    job.required_skills
                ),

                "preferred_skills": (
                    job.preferred_skills
                ),

                "qualifications": (
                    job.qualifications
                ),
            },

            "match": match_response,

            "tailored_resume": (
                agent_result.get(
                    "tailored_resume"
                )
            ),

            "cover_letter": (
                agent_result.get(
                    "cover_letter"
                )
            ),

            "validation": {

                "tailored_resume": (
                    agent_result.get(
                        "tailored_resume_validated"
                    )
                ),

                "cover_letter": (
                    agent_result.get(
                        "cover_letter_validated"
                    )
                ),
            },
        }

        print(
            "\n========================================"
        )

        print(
            "JOB AGENT API SUCCESS"
        )

        print(
            "========================================"
        )

        print(
            f"Job: {job.title}"
        )

        print(
            f"Company: {job.company}"
        )

        print(
            f"Match Score: "
            f"{agent_result.get('match_score')}"
        )

        print(
            f"Similarity: "
            f"{agent_result.get('similarity')}"
        )

        print(
            f"Tailored Resume Validated: "
            f"{agent_result.get('tailored_resume_validated')}"
        )

        print(
            f"Cover Letter Validated: "
            f"{agent_result.get('cover_letter_validated')}"
        )

        return response

    except HTTPException:
        raise

    except ValueError as e:

        print(
            "\n========================================"
        )

        print(
            "JOB AGENT VALIDATION ERROR"
        )

        print(
            "========================================"
        )

        print(
            f"{type(e).__name__}: {e}"
        )

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        print(
            "\n========================================"
        )

        print(
            "JOB AGENT ERROR"
        )

        print(
            "========================================"
        )

        print(
            f"Error type: "
            f"{type(e).__name__}"
        )

        print(
            f"Error: {e}"
        )

        print(
            "\n========== TRACEBACK =========="
        )

        traceback.print_exc()

        print(
            "========================================"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"{type(e).__name__}: {str(e)}"
            ),
        )