import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  Brain,
  Send,
  Sparkles,
  MapPin,
  ChevronRight,
  Layers3,
  Eye,
} from "lucide-react";
import { ALL_SPATIAL_QUERIES, SPATIAL_QUERIES } from "../data/mine/spatialData";
import { analyzeMineQuery } from "../data/mine/spatialApi";

// ─── Terrain with highlight zones ──────────────────────────────────────────
function AISpatialTerrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(300, 360, 60, 60);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      let y = 0;
      if (dist > 110) {
        y = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 6 + Math.sin(x * 0.08) * 3;
      } else {
        const depthFactor = Math.pow(1 - dist / 110, 1.3);
        const steps = Math.floor(depthFactor * 5);
        y = -steps * 11 - depthFactor * 8;
      }
      pos.setY(i, y);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#3d4f3e" roughness={0.9} />
    </mesh>
  );
}

// ─── Highlight Zone Disc ─────────────────────────────────────────────────
function HighlightZone({ x, z, y, radius, color, label }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.45 + Math.sin(clock.getElapsedTime() * 2.5) * 0.25;
    }
  });

  return (
    <group position={[x, y + 1, z]}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      {/* Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius, radius + 1.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <Text position={[0, 5, 0]} fontSize={4} color={color} anchorX="center" outlineWidth={0.25} outlineColor="#101810">
        {label}
      </Text>
    </group>
  );
}

// ─── Bench Rows ──────────────────────────────────────────────────────────
const BENCH_POSITIONS = [
  { y: 0, width: 80, length: 80 },
  { y: -11, width: 72, length: 72 },
  { y: -22, width: 62, length: 62 },
  { y: -33, width: 52, length: 52 },
  { y: -44, width: 40, length: 40 },
  { y: -55, width: 30, length: 30 },
  { y: -60, width: 22, length: 22 },
  { y: -65, width: 14, length: 14 },
];

function SpatialBenches({ highlightIndex }) {
  return (
    <group>
      {BENCH_POSITIONS.map((b, i) => (
        <mesh key={i} position={[0, b.y - 1.5, 0]} receiveShadow>
          <boxGeometry args={[b.width, 3, b.length]} />
          <meshStandardMaterial
            color={i === highlightIndex ? "#ffb300" : "#7a6c53"}
            emissive={i === highlightIndex ? "#ff8f00" : "#000"}
            emissiveIntensity={i === highlightIndex ? 0.5 : 0}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Equipment dots ──────────────────────────────────────────────────────
const EQ_POSITIONS = [
  { id: "EX-01", pos: [28, -34, 10] },
  { id: "EX-02", pos: [18, -34, -20] },
  { id: "DT-05", pos: [35, -34, -12] },
  { id: "DT-08", pos: [22, -34, -35] },
  { id: "DR-01", pos: [-18, -23, 8] },
  { id: "DZ-02", pos: [-30, -12, 30] },
];

function SpatialEquipment({ highlightIds }) {
  return (
    <group>
      {EQ_POSITIONS.map((eq) => {
        const isHighlighted = highlightIds && highlightIds.includes(eq.id);
        return (
          <group key={eq.id} position={eq.pos}>
            <mesh castShadow>
              <boxGeometry args={[6, 5, 4]} />
              <meshStandardMaterial
                color={isHighlighted ? "#ffb300" : "#546e7a"}
                emissive={isHighlighted ? "#f57f17" : "#000"}
                emissiveIntensity={isHighlighted ? 0.8 : 0}
              />
            </mesh>
            {isHighlighted && (
              <mesh position={[0, 8, 0]}>
                <sphereGeometry args={[2, 8, 8]} />
                <meshBasicMaterial color="#ffb300" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ─── Camera animator ─────────────────────────────────────────────────────
function CameraAnimator({ target }) {
  const { camera } = useThree();
  useEffect(() => {
    if (!target) return;
    const [tx, ty, tz] = target;
    camera.position.set(tx, ty, tz);
    camera.lookAt(0, -20, 0);
  }, [camera, target]);
  return null;
}

// ─── The 3D Scene ────────────────────────────────────────────────────────
function AISpatialScene({ activeQuery }) {
  const highlightZones = [];
  let highlightBench = null;
  let highlightEquipIds = null;

  if (activeQuery) {
    activeQuery.highlights.forEach((h) => {
      if (["slope", "seam", "traffic", "risk"].includes(h.type)) {
        highlightZones.push({
          x: h.x,
          z: h.z,
          y: h.y,
          radius: h.radius,
          color: h.color || (h.type === "risk" || h.type === "slope" ? "#ef4444" : h.type === "traffic" ? "#f97316" : "#eab308"),
          label: h.label,
        });
        if (h.benchIndex !== undefined) highlightBench = h.benchIndex;
        if (h.benchNumber !== undefined) highlightBench = h.benchNumber - 1;
      }
      if (h.type === "bench") {
        highlightBench = h.benchIndex;
      }
      if (h.type === "equipment") {
        highlightEquipIds = h.equipmentIds || h.ids;
        if (h.benchNumber !== undefined) highlightBench = h.benchNumber - 1;
      }
    });
  }

  return (
    <Canvas
      shadows
      camera={{ position: [140, 110, 180], fov: 45 }}
      style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #0f1c14 0%, #162112 100%)" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[80, 120, 80]} intensity={1.2} castShadow />
      <directionalLight position={[-60, 80, -60]} intensity={0.4} color="#7fb8ff" />

      <OrbitControls enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2 - 0.05} minDistance={30} maxDistance={400} />

      {activeQuery && <CameraAnimator target={activeQuery.camera} />}

      <AISpatialTerrain />
      <SpatialBenches highlightIndex={highlightBench} />
      <SpatialEquipment highlightIds={highlightEquipIds} />

      {highlightZones.map((hz, i) => (
        <HighlightZone key={i} {...hz} />
      ))}

      {/* Mine boundary */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <ringGeometry args={[112, 115, 64]} />
        <meshBasicMaterial color="#315d43" transparent opacity={0.5} />
      </mesh>
    </Canvas>
  );
}

// ─── Quick Query Chips ───────────────────────────────────────────────────
function QueryChip({ query, onClick }) {
  return (
    <button className="query-chip" onClick={onClick}>
      <ChevronRight size={12} />
      <span>{query.label}</span>
    </button>
  );
}

// ─── Chat Message ─────────────────────────────────────────────────────────
function formatChatText(text) {
  return text.split(/(\*\*.*?\*\*|\n)/g).map((part, index) => {
    if (part === "\n") return <br key={index} />;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function ChatMessage({ role, text, stats }) {
  return (
    <div className={`chat-message ${role}`}>
      {role === "ai" && <div className="chat-avatar ai-avatar"><Brain size={14} /></div>}
      <div className="chat-bubble">
        <div className="chat-text">{formatChatText(text)}</div>
        {stats && <div className="chat-stats">{stats.map((stat, index) => <div key={index} className="chat-stat-pill"><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>}
      </div>
      {role === "user" && <div className="chat-avatar user-avatar"><Eye size={14} /></div>}
    </div>
  );
}

function findLocalQuery(text) {
  const normalized = text.toLowerCase().replace(/[–—-]/g, " ").replace(/bench\s*0?(\d+)/g, "bench $1").replace(/\s+/g, " ");
  if (/\b(risk|hazard|incident|inspection)\b/.test(normalized)) {
    const bench = normalized.match(/bench \d+/)?.[0];
    const zone = normalized.match(/zone ([a-z])/)?.[1];
    return ALL_SPATIAL_QUERIES.find((query) => {
      if (!query.zoneLabel) return false;
      const label = query.zoneLabel.toLowerCase().replace(/[–—-]/g, " ").replace(/bench\s*0?(\d+)/g, "bench $1");
      return (bench && label.includes(bench) && (!zone || label.includes(`zone ${zone}`))) || (!bench && !zone && query.id === "risk-rz-01");
    }) || null;
  }
  if (/(slope|incline|steep|grade)/.test(normalized)) return SPATIAL_QUERIES.find((query) => query.id === "slope30");
  if (/(equipment|vehicle|truck|excavator|shovel)/.test(normalized) && /(bench 4|bench four)/.test(normalized)) return SPATIAL_QUERIES.find((query) => query.id === "bench4equip");
  if (/(traffic|haul|road|corridor|congestion)/.test(normalized)) return SPATIAL_QUERIES.find((query) => query.id === "hightraffic");
  if (/(coal|seam|deep|stratigraph)/.test(normalized)) return SPATIAL_QUERIES.find((query) => query.id === "coalseam");
  return null;
}

export function SpatialAIPage({ initialQueryId, onInitialQueryHandled }) {
  const [messages, setMessages] = useState([{ role: "ai", text: "**Spatial AI Engine online.** Ask about slope zones, equipment, traffic, coal seams, or risk zones.", stats: null }]);
  const [input, setInput] = useState("");
  const [activeQuery, setActiveQuery] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [dataStatus, setDataStatus] = useState("Spatial API available");
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!initialQueryId) return;
    const query = ALL_SPATIAL_QUERIES.find((item) => item.id === initialQueryId);
    if (query) runQuery(query);
    onInitialQueryHandled?.();
  }, [initialQueryId, onInitialQueryHandled]);

  function handleQuerySelect(query) {
    setInput(query.label);
    runQuery(query);
  }

  async function runQuery(query) {
    const queryText = typeof query === "string" ? query : query.label;
    const localFallback = typeof query === "string" ? findLocalQuery(query) : query;
    setMessages((current) => [...current, { role: "user", text: queryText, stats: null }]);
    setThinking(true);
    setActiveQuery(null);
    try {
      const result = await analyzeMineQuery("mine-a", queryText);
      const colors = { risk: "#ef4444", slope: "#ef4444", equipment: "#ffb300", traffic: "#f97316", seam: "#eab308" };
      const highlights = result.highlights.map((highlight) => ({
        type: highlight.kind, x: highlight.x, y: highlight.y, z: highlight.z,
        radius: highlight.radius, label: highlight.label, color: colors[highlight.kind],
        equipmentIds: highlight.equipment_ids, benchNumber: highlight.bench_number,
      }));
      if (result.recognized) {
        const focus = highlights[0];
        setActiveQuery({ highlights, camera: focus ? [focus.x + 90, 90, focus.z + 110] : [140, 110, 180] });
      }
      setDataStatus(`API · ${result.data_source}`);
      setMessages((current) => [...current, { role: "ai", text: `${result.explanation}\n\nData source: ${result.data_source}`, stats: result.statistics }]);
    } catch {
      setDataStatus("Offline · sample fallback");
      setActiveQuery(localFallback);
      setMessages((current) => [...current, { role: "ai", text: localFallback?.answer || "The spatial API is unavailable and this query has no matching sample result. Start the backend or try a suggested query.", stats: localFallback?.stats || null }]);
    } finally {
      setThinking(false);
      setInput("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (input.trim()) runQuery(input.trim());
  }

  return (
    <>
      <header className="page-header">
        <div>
          <div className="eyebrow">SPATIAL AI ENGINE · FEATURE 1</div>
          <h1>AI → 3D Explain &amp; Show Intelligence</h1>
          <p>Ask a natural language question — the AI analyzes mine data and highlights the answer directly in the live 3D mine view.</p>
        </div>
        <div className="header-status">
          <Sparkles size={17} />
          <span>{dataStatus}</span>
        </div>
      </header>

      <div className="spatial-ai-layout">
        {/* ── Left: Chat Panel ── */}
        <div className="spatial-chat-panel">
          <div className="spatial-chat-header">
            <Brain size={18} color="#b78645" />
            <span>AI Mine Analyst</span>
          </div>

          <div className="spatial-chat-messages">
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} text={m.text} stats={m.stats} />
            ))}
            {thinking && (
              <div className="chat-message ai">
                <div className="chat-avatar ai-avatar"><Brain size={14} /></div>
                <div className="chat-bubble thinking-bubble">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="query-suggestions">
            <div className="suggestion-label"><Layers3 size={12} /> Suggested spatial queries:</div>
            {SPATIAL_QUERIES.map((q) => (
              <QueryChip key={q.id} query={q} onClick={() => handleQuerySelect(q)} />
            ))}
          </div>

          <form className="spatial-input-row" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any mine feature or zone..."
              disabled={thinking}
            />
            <button type="submit" disabled={thinking || !input.trim()}>
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* ── Right: 3D Mine Scene ── */}
        <div className="spatial-3d-panel">
          {!activeQuery && (
            <div className="spatial-placeholder">
              <MapPin size={32} color="#315d43" />
              <p>Ask a spatial question to highlight zones in the 3D mine</p>
            </div>
          )}
          {activeQuery && (
            <div className="spatial-badge">
              <Sparkles size={13} color="#b78645" />
              <span>{activeQuery.highlights.length} zone(s) highlighted in 3D view</span>
            </div>
          )}
          <AISpatialScene activeQuery={activeQuery} />
        </div>
      </div>
    </>
  );
}
