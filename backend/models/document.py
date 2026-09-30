from datetime import datetime
from sqlalchemy import DateTime, Float, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    subsidiary: Mapped[str] = mapped_column(String(100), default="CMPDI", nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default="uploaded",
        nullable=False,
    )
    extracted_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    topics_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    accuracy_score: Mapped[float | None] = mapped_column(Float, default=98.5, nullable=True)
    processing_time_sec: Mapped[float | None] = mapped_column(Float, default=1.2, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )


class ParliamentaryInquiry(Base):
    __tablename__ = "parliamentary_inquiries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    inquiry_ref: Mapped[str] = mapped_column(String(100), nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    subsidiary: Mapped[str] = mapped_column(String(100), default="CMPDI", nullable=False)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    official_response: Mapped[str] = mapped_column(Text, nullable=False)
    time_saved_pct: Mapped[float] = mapped_column(Float, default=88.5, nullable=False)
    accuracy_pct: Mapped[float] = mapped_column(Float, default=99.1, nullable=False)
    automation_pct: Mapped[float] = mapped_column(Float, default=94.0, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Approved", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )