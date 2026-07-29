from typing import Dict, List
from pydantic import BaseModel, Field


class Education(BaseModel):
    institution: str | None = None
    location: str | None = None
    degree: str | None = None
    duration: str | None = None


class ParsedResume(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    github: str | None = None
    linkedin: str | None = None
    portfolio: str | None = None

    summary: str | None = None

    skills: Dict[str, List[str]] = Field(default_factory=dict)

    education: List[Education] = Field(default_factory=list)

    experience: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)


class ResumeResponse(BaseModel):
    filename: str
    extracted_text: str
    parsed_resume: ParsedResume