from pydantic import BaseModel,Field

class ResumeJobMatch(BaseModel):
    match_score:int
    matched_skills:list[str]=Field(default_factory=list)
    missing_skills:list[str]=Field(default_factory=list)
    missing_keywords:list[str]=Field(default_factory=list)
    missing_keywords:list[str]=Field(default_factory=list)
    recommendations:list[str]=Field(default_factory=list)