from pydantic import BaseModel, Field


class ProjectImprovement(BaseModel):
    title: str
    improvements: list[str] = Field(default_factory=list)


class ExperienceImprovement(BaseModel):
    company: str
    improvements: list[str] = Field(default_factory=list)


class ResumeTailorResponse(BaseModel):

    improved_summary: str

    improved_skills: list[str] = Field(default_factory=list)

    keywords_to_add: list[str] = Field(default_factory=list)

    project_improvements: list[ProjectImprovement] = Field(
        default_factory=list
    )

    experience_improvements: list[ExperienceImprovement] = Field(
        default_factory=list
    )

    ats_tips: list[str] = Field(default_factory=list)