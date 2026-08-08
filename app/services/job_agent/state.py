from typing import TypedDict
from app.schemas.resume import ParsedResume
from app.schemas.job_description import JobDescription
from app.schemas.tailor import ResumeTailorResponse
from app.schemas.match import ResumeJobMatch
from app.schemas.cover_letter import CoverLetterResponse



class JobAgentState(TypedDict, total=False):

    #Input
    resume_text:str
    job_description_text:str


    #Parsed Resume
    resume:ParsedResume
    job_description:JobDescription

    #Matching
    match:ResumeJobMatch
    similarity:int


    #AI outputs
    tailored_resume:ResumeTailorResponse
    cover_letter:CoverLetterResponse


    #Control
    error:str
    