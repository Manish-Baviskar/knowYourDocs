from services.ocr_service import extract_text_with_ocr
from services.pdf_extractor import extract_text_from_pdf
from services.spreadsheet_extractor import extract_text_from_spreadsheet

MIN_TEXT_LENGTH = 100


def extract_document_text(file_path: str, file_type: str) -> tuple[str, str]:
    """
    Automatically choose the correct extraction method
    based on the document type.

    Returns:
        extracted_text, extraction_method
    """
    extension = file_path.lower().split(".")[-1]

    # PDF processing
    if extension == "pdf":
        text = extract_text_from_pdf(file_path)

        if len(text.strip()) >= MIN_TEXT_LENGTH:
            return text, "pdf_text"

        ocr_text = extract_text_with_ocr(file_path)
        return ocr_text, "ocr"

    # Spreadsheet processing
    if extension in {"xlsx", "xls", "csv"}:
        text = extract_text_from_spreadsheet(file_path)
        return text, "spreadsheet"

    return "", "unsupported"