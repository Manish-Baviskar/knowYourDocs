from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

PROJECT_ROOT = BASE_DIR.parent

DATA_DIR = PROJECT_ROOT / "data"

DOCUMENTS_DIR = DATA_DIR / "documents"

PROCESSED_DIR = DATA_DIR / "processed"

REPORTS_DIR = DATA_DIR / "reports"