from typing import Dict, List

from pydantic import BaseModel, Field

from app.schemas.validation import ValidationResult
from app.schemas.score import ResumeScore
from app.schemas.analysis import ResumeAnalysis


class Education(BaseModel):
    institution: str | None = None
    location: str | None = None
    degree: str | None = None 
    duration: str | None = None


class Project(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    duration: str | None = None

    tech_stack: List[str] = Field(default_factory=list)
    description: List[str] = Field(default_factory=list)
    links: List[str] = Field(default_factory=list)


class Experience(BaseModel):
    company: str | None = None
    role: str | None = None
    location: str | None = None
    duration: str | None = None

    responsibilities: List[str] = Field(default_factory=list)
    tech_stack: List[str] = Field(default_factory=list)

    employment_type: str | None = None


class Certification(BaseModel):
    title: str | None = None
    issuer: str | None = None
    date: str | None = None

    credential_id: str | None = None
    description: List[str] = Field(default_factory=list)
    links: List[str] = Field(default_factory=list)


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
    experience: List[Experience] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)


class ResumeResponse(BaseModel):
    filename: str
    extracted_text: str

    parsed_resume: ParsedResume

    validation: ValidationResult

    score: ResumeScore

    analysis: ResumeAnalysis