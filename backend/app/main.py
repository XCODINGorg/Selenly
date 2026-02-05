import logging
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, profiles, posts, moods, journals, ai, reports

app = FastAPI(title="Selenly API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
app.include_router(posts.router, prefix="/posts", tags=["posts"])
app.include_router(moods.router, prefix="/moods", tags=["moods"])
app.include_router(journals.router, prefix="/journals", tags=["journals"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])

logger = logging.getLogger("selenly")

@app.middleware("http")
async def request_logging(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    response.headers["X-Request-ID"] = request_id
    logger.info(
        "request_id=%s method=%s path=%s status=%s duration_ms=%.2f",
        request_id,
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response

@app.get("/")
async def root():
    return {"status": "ok", "service": "selenly-backend"}

@app.get("/health")
async def health():
    return {"status": "ok"}

