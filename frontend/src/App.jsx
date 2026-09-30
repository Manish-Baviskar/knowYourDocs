import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  ChevronRight,
  Cloud,
  Database,
  Download,
  FileBarChart,
  FileText,
  GitBranch,
  Layers3,
  Map,
  MessageSquareText,
  Mountain,
  Pickaxe,
  Play,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Zap,
} from "lucide-react";
import { WordCloudTopicPage } from "./pages/WordCloudTopicPage";
import { ParliamentaryInquiryPage } from "./pages/ParliamentaryInquiryPage";
import { SpatialAIPage } from "./pages/SpatialAIPage";
import { DigitalTwinPage } from "./pages/DigitalTwinPage";
import { RiskMapPage } from "./pages/RiskMapPage";
import "./App.css";

const API = "http://127.0.0.1:8000";

const mines = [
  {
    id: "mine-a",
    name: "North Karanpura Block A",
    location: "Jharkhand",
    type: "Open Cast Mining",
    status: "Active",
    documents: 128,
    depth: "125.5 m",
    grade: "G10 Coal",
    area: "24.8 km²",
  },
  {
    id: "mine-b",
    name: "Talcher Underground Sector B",
    location: "Odisha",
    type: "Underground Mining",
    status: "Active",
    documents: 94,
    depth: "210.2 m",
    grade: "G8 Coal",
    area: "31.4 km²",
  },
  {
    id: "mine-c",
    name: "Korba Prospecting Block C",
    location: "Chhattisgarh",
    type: "Exploration Zone",
    status: "Exploration",
    documents: 67,
    depth: "98.7 m",
    grade: "G12 Coal",
    area: "18.6 km²",
  },
];

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <Pickaxe size={24} />
        </div>

        <div className="brand-text">
          <h2>CMPDI</h2>
          <span>MINING INTELLIGENCE</span>
        </div>
      </div>

      <div className="nav-group">
        <div className="nav-title">PLATFORM</div>

        <button
          className={`nav-item ${page === "overview" ? "active" : ""}`}
          onClick={() => setPage("overview")}
        >
          <Map size={18} />
          <span>Mine Overview</span>
        </button>

        <button
          className={`nav-item ${page === "documents" ? "active" : ""}`}
          onClick={() => setPage("documents")}
        >
          <FileText size={18} />
          <span>Documents</span>
        </button>

        <button
          className={`nav-item ${page === "search" ? "active" : ""}`}
          onClick={() => setPage("search")}
        >
          <Search size={18} />
          <span>Smart Search</span>
        </button>

        <button
          className={`nav-item ${page === "analyst" ? "active" : ""}`}
          onClick={() => setPage("analyst")}
        >
          <Brain size={18} />
          <span>AI Mine Analyst</span>
        </button>

        <button
          className={`nav-item ${page === "analytics" ? "active" : ""}`}
          onClick={() => setPage("analytics")}
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </button>

        <button
          className={`nav-item ${page === "explorer" ? "active" : ""}`}
          onClick={() => setPage("explorer")}
        >
          <Layers3 size={18} />
          <span>3D Mine Explorer</span>
        </button>

        <button
          className={`nav-item ${page === "reports" ? "active" : ""}`}
          onClick={() => setPage("reports")}
        >
          <FileBarChart size={18} />
          <span>Reports</span>
        </button>
      </div>

      <div className="nav-group">
        <div className="nav-title">PS 26023 — AI REPORTING</div>

        <button
          className={`nav-item ${page === "wordcloud" ? "active" : ""}`}
          onClick={() => setPage("wordcloud")}
        >
          <Cloud size={18} />
          <span>Word Cloud & Topics</span>
        </button>

        <button
          className={`nav-item ${page === "parliamentary" ? "active" : ""}`}
          onClick={() => setPage("parliamentary")}
        >
          <MessageSquareText size={18} />
          <span>Parliamentary Inquiries</span>
        </button>
      </div>

      <div className="nav-group">
        <div className="nav-title">3D SPATIAL INTELLIGENCE</div>

        <button
          className={`nav-item ${page === "spatial-ai" ? "active" : ""}`}
          onClick={() => setPage("spatial-ai")}
        >
          <Zap size={18} />
          <span>AI → 3D Explain &amp; Show</span>
        </button>

        <button
          className={`nav-item ${page === "digital-twin" ? "active" : ""}`}
          onClick={() => setPage("digital-twin")}
        >
          <GitBranch size={18} />
          <span>What-If Simulator</span>
        </button>

        <button
          className={`nav-item ${page === "risk-map" ? "active" : ""}`}
          onClick={() => setPage("risk-map")}
        >
          <ShieldAlert size={18} />
          <span>AI Risk Map</span>
        </button>
      </div>

      <div className="nav-group system-nav">
        <div className="nav-title">SYSTEM</div>

        <button className="nav-item">
          <Database size={18} />
          <span>PostgreSQL DB</span>
        </button>

        <button className="nav-item">
          <Settings size={18} />
          <span>OCR / PyMuPDF</span>
        </button>
      </div>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-dot"></span>
          CMPDI Engine Online
        </div>

        <p>Central Mine Planning &amp; Design Institute</p>
      </div>
    </aside>
  );
}

function Header({ eyebrow, title, description }) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="header-status">
        <Activity size={17} />
        <span>Platform Operational</span>
      </div>
    </header>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function MineSelection({ onSelect }) {
  return (
    <>
      <Header
        eyebrow="CMPDI DIGITAL MINE PLATFORM"
        title="Select a Mining Block"
        description="Choose a coal block to access documents, geological intelligence and AI-powered analysis."
      />

      <section className="content-section">
        <div className="section-header">
          <div>
            <h2>Mining Blocks</h2>
            <p>Active mining sites and exploration zones</p>
          </div>

          <span className="count-badge">{mines.length} Mines Operational</span>
        </div>

        <div className="mine-grid">
          {mines.map((mine) => (
            <article className="mine-card" key={mine.id}>
              <div className="mine-card-header">
                <div className="mine-icon">
                  <Pickaxe size={25} />
                </div>

                <span className="mine-status">
                  <span></span>
                  {mine.status}
                </span>
              </div>

              <div className="mine-card-title">
                <h3>{mine.name}</h3>
                <p>
                  {mine.location} <b>•</b> {mine.type}
                </p>
              </div>

              <div className="mine-card-stats">
                <div>
                  <span>Seam Depth</span>
                  <strong>{mine.depth}</strong>
                </div>

                <div>
                  <span>Documents</span>
                  <strong>{mine.documents}</strong>
                </div>
              </div>

              <button
                className="primary-button full"
                onClick={() => onSelect(mine)}
              >
                Open Mine Dashboard
                <ChevronRight size={17} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="overview-strip">
        <Stat icon={<FileText size={21} />} label="Total Documents" value="289" />
        <Stat icon={<Brain size={21} />} label="AI Analyses" value="42" />
        <Stat icon={<Layers3 size={21} />} label="3D Mine Models" value="3" />
        <Stat icon={<Database size={21} />} label="Data Sources" value="8" />
      </section>

      <section className="workflow-card">
        <div>
          <div className="eyebrow">INTELLIGENCE WORKFLOW</div>
          <h2>From Raw Mining Data to Actionable AI Insights</h2>
        </div>

        <div className="workflow">
          <span>01 Upload Records</span>
          <span>02 PyMuPDF / OCR Extraction</span>
          <span>03 AI Analysis</span>
          <span>04 3D Visualization</span>
          <span>05 PDF Reports</span>
        </div>
      </section>
    </>
  );
}

function MineDashboard({ mine, goBack, onNavigate }) {
  return (
    <>
      <button className="back-button" onClick={goBack}>
        ← Back to Mines
      </button>

      <Header
        eyebrow="SELECTED MINING BLOCK"
        title={mine.name}
        description={`${mine.location} • ${mine.type} • Status: ${mine.status}`}
      />

      <section className="dashboard-context-bar">
        <div>
          <span className="context-label">ACTIVE BLOCK</span>
          <strong>{mine.id.toUpperCase()} · {mine.location}</strong>
        </div>
        <div className="context-meta">
          <span className="live-indicator"><span></span> Live model connected</span>
          <button className="secondary-button small-btn" onClick={() => onNavigate("explorer")}>
            <Layers3 size={14} /> Open 3D Explorer
          </button>
        </div>
      </section>

      <section className="overview-strip mine-stats-strip">
        <Stat icon={<Mountain size={21} />} label="Seam Depth" value={mine.depth} />
        <Stat icon={<Pickaxe size={21} />} label="Coal Grade" value={mine.grade} />
        <Stat icon={<FileText size={21} />} label="Mine Documents" value={mine.documents} />
        <Stat icon={<Map size={21} />} label="Block Area" value={mine.area} />
      </section>

      <section className="dashboard-grid">
        <div className="panel large-panel dashboard-map-panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">DIGITAL MINE VIEW</div>
              <h2>3D Mine Explorer</h2>
              <p className="panel-subtitle">Terrain, elevation and active mining layers</p>
            </div>

            <span className="demo-badge">LIVE 3D MODEL</span>
          </div>

          <div className="mine-map">
            <div className="terrain terrain-a"></div>
            <div className="terrain terrain-b"></div>
            <div className="terrain terrain-c"></div>

            <div className="pit pit-one"></div>
            <div className="pit pit-two"></div>

            <div className="map-marker marker-a">
              <span></span>
              Borehole BH-402
            </div>

            <div className="map-marker marker-b">
              <span></span>
              Active Cut Seam
            </div>

            <div className="map-center">
              <Layers3 size={38} />
              <strong>Interactive 3D Mine View</strong>
              <span>Terrain • Elevation • Mine Layers</span>
              <button
                className="secondary-button small-btn"
                style={{ marginTop: 10 }}
                onClick={() => onNavigate("explorer")}
              >
                Launch Full 3D Explorer
              </button>
            </div>
          </div>
        </div>

        <div className="panel dashboard-actions-panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">MINE INTELLIGENCE</div>
              <h2>Quick Actions</h2>
              <p className="panel-subtitle">Move from overview to analysis</p>
            </div>
          </div>

          <div className="action-list">
            <button className="action" onClick={() => onNavigate("documents")}>
              <div className="action-icon"><FileText size={20} /></div>
              <div className="action-text">
                <strong>Mine Documents</strong>
                <span>Browse and process mine documents</span>
              </div>
              <ChevronRight size={17} />
            </button>

            <button className="action" onClick={() => onNavigate("search")}>
              <div className="action-icon"><Search size={20} /></div>
              <div className="action-text">
                <strong>Smart Search</strong>
                <span>Search across geological &amp; mining records</span>
              </div>
              <ChevronRight size={17} />
            </button>

            <button className="action" onClick={() => onNavigate("analyst")}>
              <div className="action-icon"><Brain size={20} /></div>
              <div className="action-text">
                <strong>AI Mine Analyst</strong>
                <span>Ask AI questions about geological data</span>
              </div>
              <ChevronRight size={17} />
            </button>

            <button className="action" onClick={() => onNavigate("documents")}>
              <div className="action-icon"><Upload size={20} /></div>
              <div className="action-text">
                <strong>Upload Document</strong>
                <span>Add new PDF, Excel or CSV records</span>
              </div>
              <ChevronRight size={17} />
            </button>

            <button className="action" onClick={() => onNavigate("risk-map")}>
              <div className="action-icon risk-action-icon"><ShieldAlert size={20} /></div>
              <div className="action-text">
                <strong>Risk Map</strong>
                <span>Review explainable spatial risk zones</span>
              </div>
              <ChevronRight size={17} />
            </button>

            <button className="action" onClick={() => onNavigate("digital-twin")}>
              <div className="action-icon twin-action-icon"><GitBranch size={20} /></div>
              <div className="action-text">
                <strong>What-If Simulator</strong>
                <span>Test bench, depth and haul scenarios</span>
              </div>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <section className="dashboard-insights">
        <div className="insight-card insight-card-accent">
          <div className="insight-icon"><Activity size={18} /></div>
          <div>
            <span>OPERATIONS</span>
            <strong>Mine model ready</strong>
            <p>Spatial layers are available for inspection and analysis.</p>
          </div>
          <button className="text-button" onClick={() => onNavigate("explorer")}>Inspect <ChevronRight size={14} /></button>
        </div>

        <div className="insight-card">
          <div className="insight-icon"><Brain size={18} /></div>
          <div>
            <span>AI WORKSPACE</span>
            <strong>{mine.documents} records available</strong>
            <p>Search, process or ask questions about mine documents.</p>
          </div>
          <button className="text-button" onClick={() => onNavigate("analyst")}>Ask AI <ChevronRight size={14} /></button>
        </div>

        <div className="insight-card">
          <div className="insight-icon"><ShieldAlert size={18} /></div>
          <div>
            <span>SPATIAL SAFETY</span>
            <strong>Risk review available</strong>
            <p>Open the demo risk map with factors and recommendations.</p>
          </div>
          <button className="text-button" onClick={() => onNavigate("risk-map")}>Review <ChevronRight size={14} /></button>
        </div>
      </section>
    </>
  );
}

function DocumentsPage({ onAnalyzeDoc }) {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [reportGeneratingId, setReportGeneratingId] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoading(true);
      const response = await fetch(`${API}/documents/`);
      if (!response.ok) throw new Error("Unable to fetch documents");
      const data = await response.json();
      setDocuments(data);
      setMessage("");
    } catch {
      setMessage("Could not connect to the CMPDI backend.");
    } finally {
      setLoading(false);
    }
  }

  async function uploadDocument(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setMessage("Uploading document to CMPDI platform...");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();

      setMessage(`Document '${data.filename}' uploaded successfully!`);
      await loadDocuments();
    } catch {
      setMessage("Document upload failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleProcess(document_id) {
    try {
      setProcessingId(document_id);
      setMessage(`Extracting text & running OCR on document #${document_id}...`);

      const response = await fetch(`${API}/documents/${document_id}/process`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Processing failed");
      const data = await response.json();

      setMessage(
        `Document #${data.document_id} processed via ${data.extraction_method}! Extracted ${data.characters_extracted} characters.`
      );
      await loadDocuments();
    } catch {
      setMessage("Processing failed. Make sure backend is running.");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleGenerateReport(document_id) {
    try {
      setReportGeneratingId(document_id);
      setMessage("Generating CMPDI AI Report (PDF)...");

      const response = await fetch(`${API}/documents/${document_id}/report?question=Provide%20comprehensive%20geological%20and%20mining%20summary`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Report generation failed");
      const data = await response.json();

      if (data.report_path) {
        const filename = data.report_path.split("\\").pop().split("/").pop();
        setReportUrl(`${API}/reports/${filename}`);
        setMessage(`Report generated: ${filename}`);
      }
    } catch {
      setMessage("Failed to generate report.");
    } finally {
      setReportGeneratingId(null);
    }
  }

  return (
    <>
      <Header
        eyebrow="CMPDI DOCUMENT INTELLIGENCE"
        title="Documents Knowledge Base"
        description="Upload, process using PyMuPDF / OCR, and analyze geological & mining documents."
      />

      <section className="panel documents-panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">DOCUMENT MANAGEMENT</div>
            <h2>Mine Documents</h2>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="secondary-button" onClick={loadDocuments}>
              <RefreshCw size={15} /> Refresh
            </button>

            <label className="primary-button upload-button">
              <Upload size={17} />
              Upload Document
              <input
                type="file"
                hidden
                accept=".pdf,.xlsx,.xls,.csv"
                onChange={uploadDocument}
              />
            </label>
          </div>
        </div>

        {message && <div className="message">{message}</div>}

        {reportUrl && (
          <div className="report-banner">
            <CheckCircle2 size={20} color="#2e7d32" />
            <span>PDF Report Ready for Download</span>
            <a
              href={reportUrl}
              target="_blank"
              rel="noreferrer"
              className="primary-button download-link"
            >
              <Download size={16} /> Download Report PDF
            </a>
          </div>
        )}

        {loading && <div className="loading">Communicating with CMPDI Backend...</div>}

        {documents.length === 0 && !loading ? (
          <div className="empty-state">
            <FileText size={42} />
            <h3>No documents loaded</h3>
            <p>Upload a PDF report, Excel sheet or CSV data file to build your mine knowledge repository.</p>
            <label className="primary-button upload-button">
              <Upload size={17} /> Upload First Document
              <input
                type="file"
                hidden
                accept=".pdf,.xlsx,.xls,.csv"
                onChange={uploadDocument}
              />
            </label>
          </div>
        ) : (
          <div className="document-list">
            {documents.map((doc) => (
              <div className="document-card" key={doc.document_id}>
                <div className="document-card-main">
                  <div className="document-icon">
                    <FileText size={22} />
                  </div>

                  <div className="document-info">
                    <strong>{doc.filename}</strong>
                    <span>
                      Type: {doc.file_type} • Uploaded: {new Date(doc.created_at).toLocaleString()}
                    </span>
                  </div>

                  <span className={`status-pill ${doc.status}`}>
                    {doc.status}
                  </span>
                </div>

                <div className="document-actions">
                  {doc.status !== "processed" ? (
                    <button
                      className="primary-button small-btn"
                      disabled={processingId === doc.document_id}
                      onClick={() => handleProcess(doc.document_id)}
                    >
                      {processingId === doc.document_id ? (
                        "Processing..."
                      ) : (
                        <>
                          <Play size={14} /> Process Document
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        className="secondary-button small-btn"
                        onClick={() => onAnalyzeDoc(doc)}
                      >
                        <Brain size={14} /> AI Analysis
                      </button>

                      <button
                        className="primary-button small-btn"
                        disabled={reportGeneratingId === doc.document_id}
                        onClick={() => handleGenerateReport(doc.document_id)}
                      >
                        {reportGeneratingId === doc.document_id ? (
                          "Generating..."
                        ) : (
                          <>
                            <FileBarChart size={14} /> Generate PDF Report
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function SmartSearchPage({ onAnalyzeDoc }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    if (e) e.preventDefault();
    if (!query.strip && !query.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`${API}/documents/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header
        eyebrow="CMPDI INTELLIGENCE SEARCH"
        title="Smart Mining Search"
        description="Instant keyword & content search across all processed mining reports, boreholes & geological surveys."
      />

      <section className="panel">
        <form onSubmit={handleSearch} className="search-box">
          <Search size={22} className="search-icon" />
          <input
            type="text"
            placeholder="Search keywords (e.g. coal, seam, thickness, overburden, borehole, grade)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="primary-button">
            {loading ? "Searching..." : "Search Records"}
          </button>
        </form>

        <div className="search-tags">
          <span>Popular queries:</span>
          <button onClick={() => { setQuery("coal"); handleSearch(); }}>coal</button>
          <button onClick={() => { setQuery("seam"); handleSearch(); }}>seam</button>
          <button onClick={() => { setQuery("overburden"); handleSearch(); }}>overburden</button>
          <button onClick={() => { setQuery("borehole"); handleSearch(); }}>borehole</button>
          <button onClick={() => { setQuery("grade"); handleSearch(); }}>grade</button>
        </div>

        {results !== null && (
          <div className="search-results">
            <div className="results-header">
              <h3>Search Results ({results.length} documents matched)</h3>
            </div>

            {results.length === 0 ? (
              <div className="empty-state">
                <AlertCircle size={36} />
                <p>No documents matched your query. Make sure documents are processed first.</p>
              </div>
            ) : (
              <div className="results-list">
                {results.map((res) => (
                  <div className="search-result-card" key={res.document_id}>
                    <div className="result-top">
                      <div>
                        <h4>{res.filename}</h4>
                        <span className="match-badge">
                          {res.match_count} word match{res.match_count > 1 ? "es" : ""}
                        </span>
                      </div>

                      <button
                        className="secondary-button small-btn"
                        onClick={() => onAnalyzeDoc({ document_id: res.document_id, filename: res.filename })}
                      >
                        <Brain size={14} /> Analyze with AI
                      </button>
                    </div>

                    <div className="matched-words">
                      <strong>Matched keywords:</strong>{" "}
                      {res.matched_words.map((w, idx) => (
                        <span key={idx} className="keyword-tag">{w}</span>
                      ))}
                    </div>

                    <div className="text-preview">
                      <p>"{res.text_preview}..."</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

function AIAnalystPage({ initialDoc }) {
  const [documents, setDocuments] = useState([]);
  const [selectedId, setSelectedId] = useState(initialDoc ? initialDoc.document_id : "");
  const [question, setQuestion] = useState("Summarize the geological structure and coal reserve estimates in this document.");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    fetchProcessedDocs();
  }, []);

  async function fetchProcessedDocs() {
    try {
      const res = await fetch(`${API}/documents/`);
      if (res.ok) {
        const data = await res.json();
        const processed = data.filter((d) => d.status === "processed");
        setDocuments(processed);
        if (processed.length > 0 && !selectedId) {
          setSelectedId(processed[0].document_id);
        }
      }
    } catch {
      // ignore
    }
  }

  async function handleAnalyze() {
    if (!selectedId || !question) return;

    try {
      setLoading(true);
      setAnalysis("");
      setReportUrl("");

      const res = await fetch(`${API}/documents/${selectedId}/analyze?question=${encodeURIComponent(question)}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();

      if (data.error) {
        setAnalysis(`Error: ${data.error}`);
      } else {
        setAnalysis(data.analysis);
      }
    } catch {
      setAnalysis("Could not perform analysis. Ensure document is processed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateReport() {
    if (!selectedId || !question) return;

    try {
      setReportLoading(true);
      const res = await fetch(`${API}/documents/${selectedId}/report?question=${encodeURIComponent(question)}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Report failed");
      const data = await res.json();

      if (data.report_path) {
        const filename = data.report_path.split("\\").pop().split("/").pop();
        setReportUrl(`${API}/reports/${filename}`);
      }
    } catch {
      alert("Failed to generate PDF report.");
    } finally {
      setReportLoading(false);
    }
  }

  return (
    <>
      <Header
        eyebrow="CMPDI GEOLOGICAL AI SERVICE"
        title="AI Mine Analyst"
        description="Query mining documents for geological structures, coal quality, seam thickness, overburden and safety analysis."
      />

      <section className="panel analyst-panel">
        <div className="analyst-controls">
          <div className="form-group">
            <label>Select Processed Mining Document:</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">-- Choose Document --</option>
              {documents.map((d) => (
                <option key={d.document_id} value={d.document_id}>
                  #{d.document_id} - {d.filename}
                </option>
              ))}
            </select>
            {documents.length === 0 && (
              <span className="form-hint">No processed documents found. Please process a document in the Documents tab first.</span>
            )}
          </div>

          <div className="form-group">
            <label>Inquiry / Prompt for AI Analyst:</label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about the document..."
            />
          </div>

          <div className="preset-prompts">
            <span>Quick Presets:</span>
            <button onClick={() => setQuestion("Summarize key geological findings and coal seam measurements.")}>
              Geological Summary
            </button>
            <button onClick={() => setQuestion("What are the coal grades, ash content, and depth measurements listed?")}>
              Coal Grade &amp; Depth
            </button>
            <button onClick={() => setQuestion("Identify potential mine safety risks, roof stability hazards or slope concerns.")}>
              Safety &amp; Hazards
            </button>
          </div>

          <button
            className="primary-button analyze-btn"
            disabled={loading || !selectedId}
            onClick={handleAnalyze}
          >
            <Sparkles size={18} /> {loading ? "Analyzing Document..." : "Run AI Mine Analysis"}
          </button>
        </div>

        {analysis && (
          <div className="analysis-output">
            <div className="output-header">
              <div className="output-title">
                <Brain size={22} color="#b78645" />
                <h3>CMPDI Mining Intelligence Output</h3>
              </div>

              <button
                className="primary-button small-btn"
                disabled={reportLoading}
                onClick={handleGenerateReport}
              >
                <Download size={15} /> {reportLoading ? "Generating PDF..." : "Export Official PDF Report"}
              </button>
            </div>

            {reportUrl && (
              <div className="report-download-card">
                <CheckCircle2 size={20} color="#2e7d32" />
                <span>Official PDF Report Generated Successfully!</span>
                <a href={reportUrl} target="_blank" rel="noreferrer" className="secondary-button small-btn">
                  Download PDF File
                </a>
              </div>
            )}

            <div className="analysis-content">
              <pre>{analysis}</pre>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function AnalyticsPage() {
  return (
    <>
      <Header
        eyebrow="CMPDI DATA INTELLIGENCE"
        title="Mine Analytics & Metrics"
        description="Comprehensive insights across coal blocks, document processing pipelines, and mine reserves."
      />

      <section className="overview-strip">
        <Stat icon={<Mountain size={21} />} label="Total Coal Blocks" value="3 Active" />
        <Stat icon={<FileText size={21} />} label="Processed Documents" value="100%" />
        <Stat icon={<Pickaxe size={21} />} label="Dominant Grade" value="G8 - G10" />
        <Stat icon={<Brain size={21} />} label="AI Models" value="Ollama / OpenAI" />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">STATISTICS</div>
              <h2>Mining Block Depth Profile</h2>
            </div>
          </div>

          <div className="analytics-bar-chart">
            <div className="bar-item">
              <span className="bar-label">North Karanpura A</span>
              <div className="bar-wrapper">
                <div className="bar-fill" style={{ width: "60%" }}></div>
              </div>
              <span className="bar-val">125.5 m</span>
            </div>

            <div className="bar-item">
              <span className="bar-label">Talcher Sector B</span>
              <div className="bar-wrapper">
                <div className="bar-fill" style={{ width: "95%" }}></div>
              </div>
              <span className="bar-val">210.2 m</span>
            </div>

            <div className="bar-item">
              <span className="bar-label">Korba Block C</span>
              <div className="bar-wrapper">
                <div className="bar-fill" style={{ width: "45%" }}></div>
              </div>
              <span className="bar-val">98.7 m</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">EXTRACTION ENGINE</div>
              <h2>Supported Document Formats</h2>
            </div>
          </div>

          <div className="format-list">
            <div className="format-item">
              <FileCode size={24} color="#b78645" />
              <div>
                <strong>PDF Files</strong>
                <span>PyMuPDF Native Text &amp; PyTesseract OCR</span>
              </div>
            </div>

            <div className="format-item">
              <FileText size={24} color="#4e7155" />
              <div>
                <strong>Excel &amp; CSV Spreadsheets</strong>
                <span>Pandas tabular data extraction</span>
              </div>
            </div>

            <div className="format-item">
              <Database size={24} color="#315d43" />
              <div>
                <strong>PostgreSQL Database</strong>
                <span>Persistent document catalog &amp; text indices</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { MineExplorerPage } from "./pages/MineExplorerPage";

function ExplorerPage({ selectedMine }) {
  return <MineExplorerPage selectedMine={selectedMine} />;
}

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Header
        eyebrow="CMPDI REPORTING SERVICE"
        title="Generated AI Reports"
        description="Official PDF reports generated by CMPDI AI Platform with geological analysis."
      />

      <section className="panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">PDF DOCUMENTS</div>
            <h2>Official Reports Catalog</h2>
          </div>
        </div>

        <div className="empty-state">
          <FileBarChart size={42} />
          <h3>Official PDF Reports</h3>
          <p>Generate PDF reports from any processed document in the Documents or AI Analyst tabs.</p>
        </div>
      </section>
    </>
  );
}

function App() {
  const [page, setPage] = useState("overview");
  const [spatialQueryId, setSpatialQueryId] = useState(null);
  const [selectedMine, setSelectedMine] = useState(null);
  const [selectedDocForAnalysis, setSelectedDocForAnalysis] = useState(null);

  useEffect(() => {
    document.title = "CMPDI AI Platform - Central Mine Planning & Design Institute";
  }, []);

  function selectMine(mine) {
    setSelectedMine(mine);
    setPage("overview");
  }

  function handleAnalyzeDoc(doc) {
    setSelectedDocForAnalysis(doc);
    setPage("analyst");
  }

  function renderPage() {
    if (page === "overview") {
      if (selectedMine) {
        return (
          <MineDashboard
            mine={selectedMine}
            goBack={() => setSelectedMine(null)}
            onNavigate={(targetPage) => setPage(targetPage)}
          />
        );
      }

      return <MineSelection onSelect={selectMine} />;
    }

    if (page === "documents") {
      return <DocumentsPage onAnalyzeDoc={handleAnalyzeDoc} />;
    }

    if (page === "search") {
      return <SmartSearchPage onAnalyzeDoc={handleAnalyzeDoc} />;
    }

    if (page === "analyst") {
      return <AIAnalystPage initialDoc={selectedDocForAnalysis} />;
    }

    if (page === "analytics") {
      return <AnalyticsPage />;
    }

    if (page === "explorer") {
      return <ExplorerPage selectedMine={selectedMine} />;
    }

    if (page === "wordcloud") {
      return <WordCloudTopicPage />;
    }

    if (page === "parliamentary") {
      return <ParliamentaryInquiryPage />;
    }

    if (page === "spatial-ai") {
      return (
        <SpatialAIPage
          initialQueryId={spatialQueryId}
          onInitialQueryHandled={() => setSpatialQueryId(null)}
        />
      );
    }

    if (page === "digital-twin") {
      return <DigitalTwinPage />;
    }

    if (page === "risk-map") {
      return (
        <RiskMapPage
          onInspectZone={(zone) => {
            setSpatialQueryId(`risk-${zone.id}`);
            setPage("spatial-ai");
          }}
        />
      );
    }

    return <ReportsPage />;
  }

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
