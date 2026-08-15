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


def serialize_resume(resume):
    """Expose the parsed resume in the shape consumed by the web client."""
    skills = resume.skills
    if isinstance(skills, dict):
        skills = [skill for values in skills.values() for skill in values]

    return {
        "contact_info": {
            "name": resume.name,
            "email": resume.email,
            "phone": resume.phone,
            "linkedin": resume.linkedin,
            "github": resume.github,
        },
        "summary": resume.summary or "",
        "skills": skills or [],
        "work_experience": [
            {
                "job_title": item.role or "",
                "company": item.company or "",
                "location": item.location,
                "start_date": item.duration,
                "responsibilities": item.responsibilities,
            }
            for item in resume.experience
        ],
        "education": [
            {
                "degree": item.degree or "",
                "institution": item.institution or "",
                "graduation_year": item.duration,
            }
            for item in resume.education
        ],
        "projects": [
            {
                "title": item.title or "",
                "description": " ".join(item.description),
                "technologies": item.tech_stack,
            }
            for item in resume.projects
        ],
        "certifications": [
            item.title for item in resume.certifications if item.title
        ],
    }


def serialize_tailored_resume(resume, tailored_resume):
    """Apply grounded tailoring suggestions without changing resume identity data."""
    client_resume = serialize_resume(resume)
    client_resume["summary"] = (
        tailored_resume.improved_summary or client_resume["summary"]
    )
    client_resume["skills"] = (
        tailored_resume.improved_skills or client_resume["skills"]
    )

    improvements_by_company = {
        item.company: item.improvements
        for item in tailored_resume.experience_improvements
    }
    for experience in client_resume["work_experience"]:
        improvements = improvements_by_company.get(experience["company"])
        if improvements:
            experience["responsibilities"] = improvements

    return client_resume


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

        parsed_resume = agent_result.get("resume")
        tailored_resume = agent_result.get("tailored_resume")

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

            "original_resume": (
                serialize_resume(parsed_resume)
                if parsed_resume
                else None
            ),

            "tailored_resume": (
                serialize_tailored_resume(
                    parsed_resume,
                    tailored_resume,
                )
                if parsed_resume and tailored_resume
                else None
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
