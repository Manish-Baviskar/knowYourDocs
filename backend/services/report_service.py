from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from core.config import REPORTS_DIR


def generate_report(
    filename: str,
    question: str,
    analysis: str,
) -> str:

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    safe_name = Path(filename).stem.replace(" ", "_")
    report_path = REPORTS_DIR / f"{safe_name}_report.pdf"

    pdf = canvas.Canvas(str(report_path), pagesize=A4)

    width, height = A4
    y = height - 50

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(50, y, "CMPDI AI Analysis Report")

    y -= 40

    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(50, y, f"Document: {filename}")

    y -= 30

    pdf.drawString(50, y, "Question:")
    y -= 20

    pdf.setFont("Helvetica", 10)

    for line in question.split("\n"):
        pdf.drawString(60, y, line[:100])
        y -= 15

    y -= 15

    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(50, y, "AI Analysis:")

    y -= 25

    pdf.setFont("Helvetica", 10)

    for line in analysis.split("\n"):
        if y < 50:
            pdf.showPage()
            y = height - 50
            pdf.setFont("Helvetica", 10)

        pdf.drawString(60, y, line[:100])
        y -= 15

    pdf.save()

    return str(report_path)