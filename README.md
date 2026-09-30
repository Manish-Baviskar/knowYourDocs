# CMPDI AI Platform

> **AI-powered mining intelligence platform for document processing, 3D spatial analysis, and automated reporting across Coal India Limited subsidiaries.**

---

## Overview

The **CMPDI AI Platform** is a full-stack web application built for the **Central Mine Planning & Design Institute (CMPDI)**, under India's Ministry of Coal. It digitalises and automates the core intelligence workflows at CMPDI and Coal India Limited (CIL) subsidiaries — replacing slow, manual report compilation with an integrated pipeline that goes from raw mining documents to AI-generated insights, interactive 3D mine visualisations, risk maps, what-if scenario simulations, and official parliamentary inquiry responses.

The platform was built to address **Problem Statement 26023** issued by the Ministry of Coal / CIL, targeting:

- **89%+ reduction** in report turnaround time
- **99%+ text extraction accuracy** (PyMuPDF + Tesseract OCR fallback)
- **94%+ workflow automation** for monthly and parliamentary reporting

**Target users:** Mining engineers, geological analysts, and administrators at CMPDI and CIL subsidiaries (ECL, BCCL, CCL, NCL, WCL, SECL, MCL).

---

## Features

- **Document Knowledge Base** — Upload PDF, Excel (`.xlsx`/`.xls`), and CSV geological and mining records
- **Smart Document Extraction** — Automatic extraction via PyMuPDF; scanned/image PDFs fall back to Tesseract OCR
- **AI Mine Analyst** — Ask free-text questions about any processed document; powered by local Ollama (`llama3.2:3b`) with OpenAI GPT-3.5-turbo as a cloud fallback
- **Smart Search** — Full-text keyword search across all processed mining documents
- **Automated Word Cloud & Topic Identification** — Extracts dominant terms and categorises documents into five mining-domain topics (Geology, Operations, Safety, Equipment, Environmental)
- **AI Parliamentary Inquiry Responder** — Automatically drafts official responses to Ministry of Coal / Lok Sabha / Rajya Sabha inquiries using subsidiary document context
- **PDF Report Generation** — One-click AI analysis reports exported as formatted PDFs via ReportLab
- **3D Mine Explorer** — Interactive WebGL mine model with stepped benches, equipment fleet, haul roads, and borehole markers (Three.js / React Three Fiber)
- **AI → 3D Explain & Show (Spatial AI)** — Natural language spatial queries (slope thresholds, equipment zones, traffic corridors, coal seams, risk zones) that highlight answers directly in the live 3D mine view
- **AI Risk Map** — Weighted, explainable risk scoring per zone (slope 25%, traffic 35%, historical events 20%, terrain change 20%) rendered as animated 3D discs with per-zone recommendations
- **What-If Simulator (Digital Twin)** — Simulate four predefined operational scenarios: bench expansion, depth increase, equipment relocation, and haul-route rerouting — with geometry deltas and metric estimates
- **KPI Dashboard** — Platform-level metrics on documents processed, parliamentary responses generated, and efficiency gains
- **Demo Data Seeding** — Three North Karanpura CSV datasets auto-loaded on first run for an immediately usable demo

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend framework** | FastAPI | 0.141.1 |
| **ASGI server** | Uvicorn | 0.54.0 |
| **ORM** | SQLAlchemy | 2.1.1 |
| **Database** | PostgreSQL (psycopg3) | — |
| **AI — local** | Ollama (`llama3.2:3b`) | 0.6.2 |
| **AI — cloud fallback** | OpenAI GPT-3.5-turbo | 3.19.2 |
| **PDF text extraction** | pypdf | 6.19.0 |
| **PDF rendering / OCR input** | PyMuPDF (fitz) | 1.28.2 |
| **OCR engine** | Tesseract (pytesseract) | 0.3.13 |
| **Spreadsheet parsing** | pandas, openpyxl, xlrd | — |
| **PDF report generation** | ReportLab | 5.0.1 |
| **Frontend framework** | React 19 + Vite 8 | — |
| **3D rendering** | Three.js, @react-three/fiber, @react-three/drei | — |
| **UI icons** | lucide-react | — |
| **Validation** | Pydantic v2 | 2.13.5 |
| **Testing** | Python `unittest` + FastAPI `TestClient` | — |
| **Linting (frontend)** | oxlint | — |

---

## Project Structure

```
CMPDI-AI-Platform-ANTIGRAVITY/
│
├── backend/                         # Python / FastAPI backend
│   ├── main.py                      # App entry point — CORS, startup hooks, router registration
│   ├── .env                         # Environment variables (DATABASE_URL, OPENAI_API_KEY)
│   ├── .gitignore
│   │
│   ├── api/
│   │   ├── documents.py             # Document CRUD, upload, process, analyze, report, search, topics, parliamentary
│   │   └── spatial.py               # Spatial mine state, risk map, scenario simulation, NL query analysis
│   │
│   ├── core/
│   │   └── config.py                # Path constants: BASE_DIR, DATA_DIR, DOCUMENTS_DIR, REPORTS_DIR
│   │
│   ├── database/
│   │   ├── base.py                  # SQLAlchemy declarative base
│   │   ├── connection.py            # Engine + SessionLocal (reads DATABASE_URL from .env)
│   │   └── init_db.py               # Table creation, column migration, demo data seeding
│   │
│   ├── models/
│   │   └── document.py              # ORM models: Document, ParliamentaryInquiry
│   │
│   └── services/
│       ├── ai_service.py            # analyze_document() — Ollama → OpenAI fallback → keyword extraction
│       ├── document_extractor.py    # Routing dispatcher: PDF text → OCR → spreadsheet
│       ├── document_processor.py    # Orchestrates extraction, status updates, topic extraction
│       ├── ocr_service.py           # PyMuPDF page render → Tesseract OCR pipeline
│       ├── pdf_extractor.py         # pypdf digital text extraction
│       ├── parliamentary_service.py # AI-assisted parliamentary draft generation
│       ├── report_service.py        # ReportLab PDF report builder
│       ├── search_service.py        # Keyword search across processed document text
│       ├── spatial_service.py       # Deterministic spatial analysis, risk scoring, simulation engine
│       ├── spreadsheet_extractor.py # pandas CSV / XLSX / XLS → text
│       └── topic_service.py         # Word cloud + 5-category topic classification
│
├── frontend/                        # React / Vite frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── main.jsx                 # React DOM entry
│       ├── App.jsx                  # Root component: sidebar nav, page routing, Documents/Search/Analyst/Analytics/Reports pages
│       ├── App.css / index.css      # Global styles
│       │
│       ├── pages/
│       │   ├── MineExplorerPage.jsx         # 3D mine explorer page shell
│       │   ├── SpatialAIPage.jsx            # AI chat + live 3D mine view (Explain & Show)
│       │   ├── DigitalTwinPage.jsx          # What-If scenario simulator (3D + metrics table)
│       │   ├── RiskMapPage.jsx              # Animated 3D risk zone map + factor breakdown
│       │   ├── WordCloudTopicPage.jsx       # Word cloud + topic distribution from backend
│       │   └── ParliamentaryInquiryPage.jsx # Draft & browse Ministry of Coal inquiries
│       │
│       ├── components/
│       │   ├── Header.jsx                   # Reusable page header
│       │   └── mine/
│       │       ├── MineExplorer.jsx         # Three.js 3D scene
│       │       ├── BenchLayer.jsx           # Stepped bench geometry
│       │       ├── EquipmentLayer.jsx       # Equipment fleet meshes
│       │       ├── HaulRoad.jsx             # Haul road geometry
│       │       ├── MineTerrain.jsx          # Procedural terrain surface
│       │       ├── MineViewControls.jsx     # Camera & view controls
│       │       └── TerrainLayer.jsx         # Surface terrain rendering
│       │
│       ├── panels/mine/
│       │   ├── LayerPanel.jsx               # Toggle visibility of mine layers
│       │   ├── MeasurementPanel.jsx         # In-scene measurement tools
│       │   ├── MineStats.jsx                # Key mine metrics panel
│       │   └── ObjectDetails.jsx            # Selected object info panel
│       │
│       ├── data/
│       │   ├── equipmentData.js             # Shared equipment configuration
│       │   └── mine/
│       │       ├── equipmentData.js         # Mine-specific equipment list
│       │       ├── mineConfig.js            # Mine site configuration
│       │       ├── spatialApi.js            # Frontend API calls to /spatial/*
│       │       ├── spatialData.js           # Local fallback spatial query definitions
│       │       └── terrainData.js           # Terrain geometry parameters
│       │
│       └── hooks/mine/
│           ├── useMineData.js               # Mine state management hook
│           └── useMineSettings.js           # Mine settings/preferences hook
│
├── data/                            # Persistent data directory (auto-created)
│   ├── documents/                   # Uploaded raw documents
│   │   ├── north_karanpura_survey.csv
│   │   ├── north_karanpura_equipment.csv
│   │   ├── north_karanpura_risk_observations.csv
│   │   └── ...
│   ├── processed/                   # (reserved for future use)
│   └── reports/                     # AI-generated PDF reports (served statically)
│
├── docs/
│   └── spatial-intelligence-mvp.md  # Spatial API design notes and operational disclaimers
│
├── tests/
│   ├── test_spatial_api.py          # HTTP integration tests (spatial endpoints, CORS)
│   └── test_spatial_contract.py     # Spatial response schema contract tests
│
└── scripts/                         # (reserved — currently empty)
```

---

## Prerequisites

### Backend
- **Python 3.11+**
- **PostgreSQL 14+** — running locally or remotely
- **Tesseract OCR** (required for scanned PDFs):
  - Windows: Install from [UB Mannheim Tesseract releases](https://github.com/UB-Mannheim/tesseract/wiki) to `C:\Program Files\Tesseract-OCR\`
  - Linux/macOS: `sudo apt install tesseract-ocr` or `brew install tesseract`  
    <!-- TODO: verify — Tesseract path is hardcoded to the Windows path in ocr_service.py; update it if deploying on Linux/macOS -->
- **Ollama** (optional but recommended for local AI):
  - Install from [ollama.com](https://ollama.com) and run `ollama pull llama3.2:3b`
  - If Ollama is unavailable, the system falls back to OpenAI GPT-3.5-turbo

### Frontend
- **Node.js 18+** and **npm**

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd CMPDI-AI-Platform-ANTIGRAVITY
```

### 2. Set up the Backend

```bash
cd backend
```

**Create and activate a virtual environment:**

```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

**Install dependencies:**

```bash
pip install fastapi uvicorn sqlalchemy psycopg[binary] pydantic python-dotenv \
    pymupdf pypdf pytesseract pillow pandas openpyxl xlrd reportlab \
    ollama openai python-multipart httpx
```

> **Note:** No `requirements.txt` is included in this project. The command above installs all packages used by the codebase. <!-- TODO: verify — add a requirements.txt for reproducibility -->

**Configure environment variables:**

```bash
# Copy and edit the .env file — NEVER commit real credentials to Git
cp .env .env.example   # optionally keep a template
```

Edit `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://YOUR_USER:YOUR_PASSWORD@localhost:5432/cmpdi_ai
OPENAI_API_KEY=sk-...   # Optional: only needed if Ollama is unavailable
```

> ⚠️ **Security warning:** The `.env` file currently contains real credentials. Remove or replace them before committing to any version control system.

**Create the PostgreSQL database:**

```sql
CREATE DATABASE cmpdi_ai;
```

**Initialise the database and seed demo data:**

```bash
python database/init_db.py
```

This creates all tables and loads three North Karanpura demo datasets automatically.

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

---

## Usage

### Start the Backend

```bash
cd backend
.\venv\Scripts\Activate.ps1    # Windows
# or: source venv/bin/activate  # macOS/Linux

uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://127.0.0.1:8000`.  
Interactive API docs: `http://127.0.0.1:8000/docs`

**Sample API output:**

```json
GET http://127.0.0.1:8000/
{
  "message": "CMPDI AI Platform API is running",
  "status": "success"
}
```

### Start the Frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173` (Vite will print the exact port).

### Run the Tests

From the `backend/` directory (with the venv activated):

```bash
python -m unittest discover -s ../tests -v
```

The tests use an **in-memory SQLite database** — no PostgreSQL connection required.

**Sample test output:**

```
test_cors_allows_active_vite_port_for_inquiry_requests ... ok
test_cors_allows_configured_frontend_and_rejects_other_origins ... ok
test_spatial_endpoints_serve_consistent_state ... ok
test_unknown_site_returns_not_found ... ok
----------------------------------------------------------------------
Ran 4 tests in X.XXXs
OK
```

### Build the Frontend for Production

```bash
cd frontend
npm run build
```

Output is placed in `frontend/dist/`.

---

## Configuration / Environment Variables

| Variable | Location | Required | Description |
|---|---|---|---|
| `DATABASE_URL` | `backend/.env` | ✅ Yes | SQLAlchemy connection string for PostgreSQL |
| `OPENAI_API_KEY` | `backend/.env` | ⚠️ Optional | OpenAI API key — used as fallback if Ollama is unavailable |
| `CORS_ALLOWED_ORIGINS` | `backend/.env` or shell | ⚠️ Optional | Comma-separated list of allowed frontend origins. Defaults to `http://localhost:5173`–`5176` for local dev. **Must be restricted before deployment.** |
| `VITE_API_URL` | Frontend env | ⚠️ Optional | Override the default backend URL (`http://127.0.0.1:8000`) for the frontend. Set via a `.env` file in `frontend/` |

**Example `backend/.env`:**

```env
DATABASE_URL=postgresql+psycopg://postgres:yourpassword@localhost:5432/cmpdi_ai
OPENAI_API_KEY=sk-...
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Example `frontend/.env`:**

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## API Endpoints

### Documents (`/documents`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/documents/` | List all documents |
| `POST` | `/documents/upload` | Upload a PDF, XLSX, XLS, or CSV file |
| `POST` | `/documents/{id}/process` | Extract text (PyMuPDF → OCR fallback) + run topic analysis |
| `POST` | `/documents/{id}/analyze` | Ask an AI question about a processed document |
| `POST` | `/documents/{id}/report` | Generate a PDF AI analysis report |
| `GET` | `/documents/search?query=...` | Full-text keyword search across processed documents |
| `GET` | `/documents/topics-global` | Aggregated word cloud + topic distribution |
| `GET` | `/documents/{id}/topics` | Per-document word cloud + topic distribution |
| `POST` | `/documents/parliamentary/draft` | Generate an AI parliamentary inquiry response |
| `GET` | `/documents/parliamentary/inquiries` | List all parliamentary inquiries |
| `GET` | `/documents/kpi-metrics` | Platform KPI metrics |

### Spatial (`/spatial`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/spatial/sites` | List available spatial mine sites |
| `GET` | `/spatial/sites/{site_id}/state` | Get terrain zones and equipment state |
| `POST` | `/spatial/sites/{site_id}/analyze` | Natural language spatial query → highlights + statistics |
| `GET` | `/spatial/sites/{site_id}/risk-zones` | Weighted risk map for all terrain zones |
| `POST` | `/spatial/sites/{site_id}/simulate` | Run a what-if scenario simulation |

**Supported spatial query intents:** slope thresholds, equipment near a numbered bench, high-traffic haul zones, deep coal seam zones, named risk-zone inspection.

**Supported simulation scenarios:** `bench5-expand`, `depth-increase`, `equip-relocation`, `haul-reroute`.

---

## Screenshots / Demo

> <!-- TODO: Add screenshots here. Suggested images to capture: -->
> 1. **Mine Overview** — mine selection cards with stats strip
> 2. **Documents Page** — upload panel with processed document list
> 3. **AI Mine Analyst** — chat interface with an AI response
> 4. **Spatial AI Page** — chat + highlighted 3D mine view side-by-side
> 5. **Risk Map Page** — 3D animated risk discs + factor breakdown panel
> 6. **Digital Twin Page** — what-if scenario result with metric table
> 7. **Word Cloud Page** — word frequency cloud + topic distribution bars
> 8. **Parliamentary Inquiry Page** — generated official response

---

## Roadmap / Future Improvements

The following items are noted in the project's internal documentation (`docs/spatial-intelligence-mvp.md`) and codebase as required before operational or production use:

- [ ] Replace synthetic demo mine data with real authorised survey/DEM, GIS, fleet telemetry, incident, weather, and geology feeds
- [ ] Compute slopes from validated terrain surfaces and spatial distances from projected coordinate systems (not Euclidean approximations)
- [ ] Calibrate and independently validate risk weights and thresholds with qualified geotechnical and mine-safety staff
- [ ] Replace fixed simulation assumptions with surveyed geometry, equipment capacities, road grades, and production schedules
- [ ] Add user authentication and authorisation, audit logs, API rate and size limits, and deployment secrets management
- [ ] Add persistence and versioning for spatial snapshots
- [ ] Generate a `requirements.txt` or use `pyproject.toml` for reproducible Python environments
- [ ] Add domain-reviewed acceptance tests with representative mine data and browser-level end-to-end tests
- [ ] Restricted CORS configuration, monitoring, and TLS for production deployment
- [ ] Fix hardcoded Tesseract path for cross-platform support (Linux/macOS)
- [ ] Add TypeScript and type-aware linting to the frontend (currently plain JSX)
- [ ] Implement real vector/semantic search (currently keyword-match only)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

**Backend code style:** Follow PEP 8. Keep service modules single-responsibility.  
**Frontend code style:** Lint with `npm run lint` before committing.

> **Important:** Never commit real credentials, API keys, or database passwords. Add `.env` to `.gitignore`.

---

## License

<!-- TODO: No LICENSE file was found in the repository. Add a LICENSE file before making this repository public. -->

This project does not currently include a license file. If you intend to open-source it, consider adding an appropriate license (e.g., MIT, Apache 2.0, or a proprietary government-use license).

---

## Author / Contact

<!-- TODO: Fill in author and contact details -->

| Field | Value |
|---|---|
| **Organization** | Central Mine Planning & Design Institute (CMPDI), Ranchi |
| **Ministry** | Ministry of Coal, Government of India |
| **Project Contact** | <!-- TODO: Add name and email --> |
| **GitHub** | <!-- TODO: Add GitHub profile/org link --> |

---

> **Disclaimer:** All spatial mine coordinates, terrain data, equipment positions, and risk scores in the current version are **synthetic demonstration data**. They must not be used for any operational, safety, or engineering decision. Validate all outputs with qualified geotechnical and mine-safety professionals before operational deployment.
