from pydantic import BaseModel, Field


class ResumeAnalysis(BaseModel):
    ats_score: int

    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    missing_sections: list[str] = Field(default_factory=list)