import sys
import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
import app.models  # Register models with Base

Base.metadata.create_all(bind=engine)


if sys.platform == "win32":

    asyncio.set_event_loop_policy(
        asyncio.WindowsProactorEventLoopPolicy()
    )


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=True,
)

cors_origins_raw = getattr(settings, "CORS_ORIGINS", "*")
if isinstance(cors_origins_raw, str):
    origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]
else:
    origins = cors_origins_raw

allow_all = "*" in origins or origins == ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else origins,
    allow_origin_regex=None if allow_all else r"https://.*\.vercel\.app",
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    api_router
)


@app.get("/")
@app.get("/health")
def root():
    return {
        "status": "ok",
        "message": "Backend Running",
        "version": settings.APP_VERSION,
    }