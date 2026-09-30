import pymupdf as fitz
import pytesseract
from PIL import Image
from io import BytesIO


TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


def extract_text_with_ocr(file_path: str) -> str:
    """
    Extract text from scanned PDF pages using OCR.
    """

    pdf = fitz.open(file_path)

    extracted_text = []

    try:
        for page_number, page in enumerate(pdf):
            pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            image_bytes = pixmap.tobytes("png")
            image = Image.open(BytesIO(image_bytes))
            text = pytesseract.image_to_string(image)

            if text.strip():
                extracted_text.append(
                    f"--- Page {page_number + 1} ---\n{text.strip()}"
                )
    except Exception as e:
        print(f"OCR warning: {e}")
    finally:
        pdf.close()

    return "\n\n".join(extracted_text)