# CMPDI AI Platform

> AI-powered mining intelligence platform for document processing, 3D spatial analysis, and automated reporting across Coal India Limited subsidiaries.

## Overview

The **CMPDI AI Platform** is a full-stack web application built for the **Central Mine Planning & Design Institute (CMPDI)**, under India's Ministry of Coal. It replaces slow, manual report compilation with an integrated pipeline that goes from raw mining documents to AI-generated insights, interactive 3D mine visualisations, risk maps, what-if simulations, and parliamentary inquiry responses.

It was built for **Problem Statement 26023** (Ministry of Coal / CIL), targeting:

- 89%+ reduction in report turnaround time
- 99%+ text extraction accuracy (PyMuPDF with Tesseract OCR fallback)
- 94%+ workflow automation for monthly and parliamentary reporting

**Target users:** mining engineers, geological analysts, and administrators at CMPDI and CIL subsidiaries (ECL, BCCL, CCL, NCL, WCL, SECL, MCL).

## Features

- **Document Knowledge Base:** upload PDF, Excel (`.xlsx`/`.xls`), and CSV mining records
- **Smart Extraction:** PyMuPDF for digital PDFs, Tesseract OCR for scanned ones
- **AI Mine Analyst:** ask questions about any processed document using local Ollama (`llama3.2:3b`) with OpenAI GPT-3.5-turbo as a cloud fallback
- **Smart Search:** keyword search across all processed documents
- **Word Cloud & Topic Identification:** classifies documents into Geology, Operations, Safety, Equipment, and Environmental topics
- **Parliamentary Inquiry Responder:** drafts official responses to Lok Sabha / Rajya Sabha inquiries from subsidiary document context
- **PDF Report Generation:** one-click AI analysis reports via ReportLab
- **3D Mine Explorer:** interactive WebGL model with benches, equipment, haul roads, and boreholes (Three.js / React Three Fiber)
- **Spatial AI (Explain & Show):** natural language spatial queries highlighted directly in the 3D view
- **AI Risk Map:** weighted, explainable risk scores per zone (slope 25%, traffic 35%, historical events 20%, terrain change 20%)
- **What-If Simulator (Digital Twin):** bench expansion, depth increase, equipment relocation, and haul-route rerouting scenarios
- **KPI Dashboard:** documents processed, parliamentary responses generated, and efficiency gains
- **Demo Data:** three North Karanpura CSV datasets are seeded on first run

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, Uvicorn, SQLAlchemy, Pydantic v2 |
| Database | PostgreSQL (psycopg3) |
| AI | Ollama (`llama3.2:3b`), OpenAI GPT-3.5-turbo (fallback) |
| Document processing | PyMuPDF, pypdf, Tesseract (pytesseract), pandas, openpyxl, xlrd |
| Reports | ReportLab |
| Frontend | React 19, Vite |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Testing | Python `unittest` + FastAPI `TestClient` |

## Project Structure

```
CMPDI-AI-Platform/
├── backend/
│   ├── main.py               # App entry point, CORS, router registration
│   ├── api/                  # documents.py, spatial.py (route handlers)
│   ├── core/                 # config.py (paths and constants)
│   ├── database/             # connection, base, init_db (tables + demo seeding)
│   ├── models/               # ORM models: Document, ParliamentaryInquiry
│   └── services/             # AI, OCR, extraction, search, topics, reports, spatial logic
├── frontend/
│   └── src/
│       ├── pages/            # Mine Explorer, Spatial AI, Digital Twin, Risk Map, Word Cloud, Parliamentary
│       ├── components/mine/  # Three.js scene components
│       ├── panels/mine/      # Layer, measurement, stats, and object detail panels
│       ├── data/             # Mine config and spatial API helpers
│       └── hooks/mine/       # Mine state and settings hooks
├── data/                     # Uploaded documents and generated reports (auto-created)
├── docs/                     # Spatial API design notes
└── tests/                    # API and schema contract tests
```

## Prerequisites

- **Python 3.11+**
- **PostgreSQL 14+**
- **Node.js 18+** and npm
- **Tesseract OCR** (for scanned PDFs)
  - Windows: install from [UB Mannheim releases](https://github.com/UB-Mannheim/tesseract/wiki) to `C:\Program Files\Tesseract-OCR\`
  - Linux/macOS: `sudo apt install tesseract-ocr` or `brew install tesseract`
  - The Tesseract path is currently hardcoded for Windows in `ocr_service.py`; update it on Linux/macOS.
- **Ollama** (optional): install from [ollama.com](https://ollama.com), then run `ollama pull llama3.2:3b`. Without it, the app falls back to OpenAI.

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd CMPDI-AI-Platform
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1        # Windows (PowerShell)
# source venv/bin/activate         # macOS / Linux

# Install dependencies
pip install fastapi uvicorn sqlalchemy "psycopg[binary]" pydantic python-dotenv \
    pymupdf pypdf pytesseract pillow pandas openpyxl xlrd reportlab \
    ollama openai python-multipart httpx
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://YOUR_USER:YOUR_PASSWORD@localhost:5432/cmpdi_ai
OPENAI_API_KEY=sk-...   # optional, only needed if Ollama is unavailable
```

Create the database and initialise it:

```sql
CREATE DATABASE cmpdi_ai;
```

```bash
python database/init_db.py
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

## Usage

**Start the backend:**

```bash
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API: `http://127.0.0.1:8000` | Interactive docs: `http://127.0.0.1:8000/docs`

**Start the frontend** (in a separate terminal):

```bash
cd frontend
npm run dev
```

The app runs at `http://localhost:5173`.

**Run tests** (from `backend/`, venv activated; uses in-memory SQLite, no PostgreSQL needed):

```bash
python -m unittest discover -s ../tests -v
```

**Build for production:**

```bash
cd frontend
npm run build
```

## Configuration

| Variable | Location | Required | Description |
|---|---|---|---|
| `DATABASE_URL` | `backend/.env` | Yes | PostgreSQL connection string |
| `OPENAI_API_KEY` | `backend/.env` | No | Fallback AI provider if Ollama is unavailable |
| `CORS_ALLOWED_ORIGINS` | `backend/.env` | No | Comma-separated allowed origins (defaults to `localhost:5173`–`5176`) |
| `VITE_API_URL` | `frontend/.env` | No | Backend URL (defaults to `http://127.0.0.1:8000`) |

## API Endpoints

### Documents (`/documents`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/documents/` | List all documents |
| `POST` | `/documents/upload` | Upload a PDF, XLSX, XLS, or CSV |
| `POST` | `/documents/{id}/process` | Extract text and run topic analysis |
| `POST` | `/documents/{id}/analyze` | Ask an AI question about a document |
| `POST` | `/documents/{id}/report` | Generate a PDF analysis report |
| `GET` | `/documents/search?query=...` | Keyword search |
| `GET` | `/documents/topics-global` | Global word cloud and topic distribution |
| `GET` | `/documents/{id}/topics` | Per-document topics |
| `POST` | `/documents/parliamentary/draft` | Draft a parliamentary inquiry response |
| `GET` | `/documents/parliamentary/inquiries` | List inquiries |
| `GET` | `/documents/kpi-metrics` | Platform KPIs |

### Spatial (`/spatial`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/spatial/sites` | List mine sites |
| `GET` | `/spatial/sites/{site_id}/state` | Terrain zones and equipment state |
| `POST` | `/spatial/sites/{site_id}/analyze` | Natural language spatial query |
| `GET` | `/spatial/sites/{site_id}/risk-zones` | Weighted risk map |
| `POST` | `/spatial/sites/{site_id}/simulate` | Run a what-if scenario |

Simulation scenarios: `bench5-expand`, `depth-increase`, `equip-relocation`, `haul-reroute`.

## Roadmap

- Replace synthetic demo data with authorised survey, GIS, telemetry, and geology feeds
- Validate risk weights and thresholds with qualified geotechnical and mine-safety staff
- Add authentication, audit logs, rate limiting, and secrets management
- Add a `requirements.txt` for reproducible installs
- Replace keyword search with semantic/vector search
- Make the Tesseract path cross-platform
- Add end-to-end browser tests

## Authors

**TEAM SAHASTRA**

Developed for:

**Smart India Hackathon 2026**

## License

This repository is intended for academic, research, and demonstration purposes.

Check the licenses of the underlying datasets, pretrained models, and third-party components before redistribution.

## Disclaimer

All spatial mine coordinates, terrain data, equipment positions, and risk scores are **synthetic demonstration data**. Do not use them for any operational, safety, or engineering decision.