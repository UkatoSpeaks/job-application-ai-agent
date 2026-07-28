from fastapi import UploadFile,HTTPException
ALLOWED_EXTENSIONS={".pdf"}

def validate_pdf(file: UploadFile):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided."
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )