from pydantic import BaseModel, Field


class JobDescription(BaseModel):

    title:str|None=None
    company:str|None=None
    location:str|None=None
    summary:str|None=None
    responsibilities:list[str]=Field(default_factory=list)
    required_skills:list[str]=Field(default_factory=list)
    preferred_skills:list[str]=Field(default_factory=list)
    qualifications:list[str]=Field(default_factory=list)