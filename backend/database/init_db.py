from database.base import Base
from database.connection import engine, SessionLocal
from core.config import DOCUMENTS_DIR
from models.document import Document, ParliamentaryInquiry
from sqlalchemy import inspect, text


DEMO_DOCUMENTS = (
    "north_karanpura_survey.csv",
    "north_karanpura_equipment.csv",
    "north_karanpura_risk_observations.csv",
)


def ensure_document_columns():
    """Add newer nullable document fields to an older prototype database."""
    columns = {
        "subsidiary": "VARCHAR(100)",
        "topics_json": "TEXT",
        "accuracy_score": "FLOAT",
        "processing_time_sec": "FLOAT",
    }

    with engine.begin() as connection:
        existing = {column["name"] for column in inspect(connection).get_columns("documents")}
        for name, column_type in columns.items():
            if name not in existing:
                connection.execute(text(f"ALTER TABLE documents ADD COLUMN {name} {column_type}"))


def seed_demo_documents(db):
    """Register bundled prototype datasets so the demo opens with usable records."""
    for filename in DEMO_DOCUMENTS:
        file_path = DOCUMENTS_DIR / filename
        if not file_path.exists() or db.query(Document).filter(Document.filename == filename).first():
            continue

        extracted_text = file_path.read_text(encoding="utf-8")
        db.add(
            Document(
                filename=filename,
                file_type="text/csv",
                file_path=str(file_path),
                subsidiary="CMPDI",
                status="processed",
                extracted_text=extracted_text,
                accuracy_score=99.2,
                processing_time_sec=0.8,
            )
        )

    db.commit()


def init_db():
    Base.metadata.create_all(bind=engine)
    ensure_document_columns()

    db = SessionLocal()
    try:
        seed_demo_documents(db)
        if db.query(ParliamentaryInquiry).count() == 0:
            sample_inquiries = [
                ParliamentaryInquiry(
                    inquiry_ref="LOK-SABHA-USQ-4029",
                    subject="Coal Production & Geological Reserves in CIL Subsidiaries (2025-26)",
                    subsidiary="CIL Headquarters / CMPDI",
                    question="Will the Minister of Coal be pleased to state the current coal reserve estimates across CIL subsidiaries including ECL, BCCL, CCL, NCL, WCL, SECL, and MCL, and the measures taken for automated reporting?",
                    official_response="As per the latest geological reports compiled by CMPDI, total proved coal reserves across CIL subsidiaries stand at 184.2 Billion Tonnes. High-capacity opencast mines in NCL and SECL contributed 48% of total raw coal production. CMPDI AI Platform has automated 94% of monthly report compilations, reducing report turnaround time by 88.5%.",
                    time_saved_pct=88.5,
                    accuracy_pct=99.2,
                    automation_pct=94.0,
                    status="Approved by Ministry",
                ),
                ParliamentaryInquiry(
                    inquiry_ref="RAJYA-SABHA-SQ-118",
                    subject="Environmental Impact Assessment & Overburden Dumping in Open Cast Mines",
                    subsidiary="CMPDI Ranchi",
                    question="What steps are being taken by CMPDI to analyze overburden dump stability and land reclamation in North Karanpura and Talcher coalfields?",
                    official_response="CMPDI uses AI-assisted satellite topography and 3D terrain modeling to continuously monitor slope stability. Overburden dump reclamation coverage increased by 14.2% across CIL subsidiaries, with automated environmental compliance tracking achieving 98.8% accuracy.",
                    time_saved_pct=91.0,
                    accuracy_pct=98.8,
                    automation_pct=92.5,
                    status="Approved by Ministry",
                ),
            ]
            db.add_all(sample_inquiries)
            db.commit()
            print("Seed parliamentary inquiries created in Database!")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    print("DATABASE TABLES CREATED SUCCESSFULLY")