from pydantic import BaseModel


class CoverLetterResponse(BaseModel):

    company: str | None = None

    job_title: str | None = None

    cover_letter: str

    email_subject: str

    email_body: str