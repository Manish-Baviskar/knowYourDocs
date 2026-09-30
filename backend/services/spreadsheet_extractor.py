from pathlib import Path
import pandas as pd


def extract_text_from_spreadsheet(file_path: str) -> str:
    """
    Extract spreadsheet data and convert it into readable text.
    Supports CSV, XLS, and XLSX files.
    """
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"Spreadsheet not found: {file_path}")

    extension = path.suffix.lower()

    if extension == ".csv":
        sheets = {"CSV": pd.read_csv(path)}

    elif extension in {".xlsx", ".xls"}:
        sheets = pd.read_excel(path, sheet_name=None)

    else:
        raise ValueError(f"Unsupported spreadsheet format: {extension}")

    extracted_sections = []

    for sheet_name, dataframe in sheets.items():
        dataframe = dataframe.fillna("")

        extracted_sections.append(
            f"--- Sheet: {sheet_name} ---\n"
            f"{dataframe.to_string(index=False)}"
        )

    return "\n\n".join(extracted_sections)