from pydantic import BaseModel

class ScoreBreakdown(BaseModel):
    contact: int=0
    summary: int=0
    skills: int=0
    education: int=0
    experience: int=0
    projects: int=0
    certifiaction: int=0



class ResumeScore(BaseModel):
    overall:int
    grade:str
    breakdown: ScoreBreakdown