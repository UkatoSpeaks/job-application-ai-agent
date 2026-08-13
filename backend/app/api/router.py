from fastapi import APIRouter

from app.api.v1.resume import (
    router as resume_router,
)

from app.api.v1.job_agent import (
    router as job_agent_router,
)


api_router = APIRouter()


api_router.include_router(
    resume_router
)

api_router.include_router(
    job_agent_router
)