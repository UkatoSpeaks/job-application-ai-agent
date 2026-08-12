import sys
import asyncio

from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings


if sys.platform == "win32":
    asyncio.set_event_loop_policy(
        asyncio.WindowsProactorEventLoopPolicy()
    )


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=True,
)


app.include_router(
    api_router
)


@app.get("/")
def root():
    return {
        "message": "Backend Running",
        "version": settings.APP_VERSION,
    }