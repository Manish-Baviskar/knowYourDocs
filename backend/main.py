import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.documents import router as documents_router
from api.spatial import router as spatial_router
from database.base import Base
from database.connection import engine
from database.init_db import ensure_document_columns, seed_demo_documents
from models.document import Document


from fastapi.staticfiles import StaticFiles
from core.config import REPORTS_DIR

app = FastAPI(
    title="CMPDI AI Platform",
    description="AI-powered document processing and analysis platform for CMPDI.",
    version="1.0.0",
)

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175,http://localhost:5176,http://127.0.0.1:5176",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

REPORTS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/reports", StaticFiles(directory=REPORTS_DIR), name="reports")

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    ensure_document_columns()
    from database.connection import SessionLocal

    db = SessionLocal()
    try:
        seed_demo_documents(db)
    finally:
        db.close()


app.include_router(documents_router)
app.include_router(spatial_router)


@app.get("/")
def root():
    return {
        "message": "CMPDI AI Platform API is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }