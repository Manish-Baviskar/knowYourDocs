from sqlalchemy.orm import Session

from models.document import Document


def search_documents(query: str, db: Session):
    documents = (
        db.query(Document)
        .filter(Document.status == "processed")
        .all()
    )

    query_words = query.lower().split()
    results = []

    for document in documents:
        text = document.extracted_text or ""
        text_lower = text.lower()

        matched_words = [
            word for word in query_words
            if word in text_lower
        ]

        if matched_words:
            results.append(
                {
                    "document_id": document.id,
                    "filename": document.filename,
                    "matched_words": matched_words,
                    "match_count": len(matched_words),
                    "text_preview": text[:500],
                }
            )

    results.sort(
        key=lambda item: item["match_count"],
        reverse=True,
    )

    return results