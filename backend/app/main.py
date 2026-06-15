from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.upload import router as upload_router
from app.db.init_db import init_db
from app.api.meeting import router as meeting_router
from app.api.search import router as search_router
from app.api.chat import router as chat_router
from app.api.insight import router as insight_router
from app.api.job import router as job_router
from app.api.analytics import router as analytics_router
from app.api.ws import router as ws_router
app = FastAPI(
    title="AI Meeting Intelligence API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(meeting_router)
app.include_router(search_router)
app.include_router(chat_router)
app.include_router(insight_router)
app.include_router(job_router)
app.include_router(analytics_router)
app.include_router(ws_router)
init_db()

@app.get("/")
def root():
    return {
        "message": "API Running"
    }