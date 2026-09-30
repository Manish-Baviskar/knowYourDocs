from sqlalchemy.orm import Session

from models.document import Document
from services.document_extractor import extract_document_text


def process_document(document_id: int, db: Session):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        raise ValueError("Document not found")

    document.status = "processing"
    db.commit()

    try:
        extracted_text, extraction_method = extract_document_text(
            document.file_path,
            document.file_type,
        )

        if extraction_method == "unsupported":
            document.status = "unsupported"
        else:
            document.extracted_text = extracted_text
            document.status = "processed"

        db.commit()
        db.refresh(document)

        return document, extraction_method

    except Exception:
        document.status = "failed"
        db.commit()
        raise