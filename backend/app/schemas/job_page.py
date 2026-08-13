from pydantic import BaseModel


class JobPage(BaseModel):
    url:str
    company:str|None=None
    job_title:str|None=None
    job_description:str