import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  AlertTriangle,
  ShieldCheck,
  Shield,
  Sparkles,
  BarChart3,
  Info,
  Eye,
} from "lucide-react";
import { RISK_ZONES } from "../data/mine/spatialData";
import { fetchMineRiskMap } from "../data/mine/spatialApi";

// ─── Terrain ─────────────────────────────────────────────────────────────
function RiskTerrain() {
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
        const df = Math.pow(1 - dist / 110, 1.3);
        const steps = Math.floor(df * 5);
        y = -steps * 11 - df * 8;
      }
      pos.setY(i, y);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#1e2f20" roughness={0.9} flatShading />
    </mesh>
  );
}

// ─── Animated Risk Zone Disc ─────────────────────────────────────────────
function RiskDisc({ zone, isSelected, onClick }) {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerRef.current) {
      outerRef.current.material.opacity =
        zone.level === "HIGH" ? 0.35 + Math.sin(t * 3) * 0.2 : 0.3;
    }
    if (innerRef.current && zone.level === "HIGH") {
      innerRef.current.rotation.z = t * 0.8;
    }
  });

  return (
    <group
      position={[zone.x, zone.y + 0.5, zone.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick(zone);
      }}
    >
      {/* Solid fill */}
      <mesh ref={outerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[zone.radius, 48]} />
        <meshBasicMaterial color={zone.color} transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Spinning ring for HIGH */}
      <mesh ref={innerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[zone.radius * 0.6, zone.radius * 0.65, 48]} />
        <meshBasicMaterial color={zone.color} transparent opacity={zone.level === "HIGH" ? 0.9 : 0.6} />
      </mesh>

      {/* Outer border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[zone.radius, zone.radius + 1.5, 48]} />
        <meshBasicMaterial color={zone.color} transparent opacity={0.9} />
      </mesh>

      {/* Selected glow pillar */}
      {isSelected && (
        <mesh position={[0, 10, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 24, 12]} />
          <meshBasicMaterial color={zone.color} transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}

// ─── Equipment (static) ───────────────────────────────────────────────────
const EQUIPMENT = [
  { pos: [20, -34, -18] },
  { pos: [28, -34, -10] },
  { pos: [18, -34, -30] },
  { pos: [-14, -22, 6] },
  { pos: [-30, -12, 28] },
];

function RiskEquipment() {
  return (
    <group>
      {EQUIPMENT.map((eq, i) => (
        <mesh key={i} position={eq.pos} castShadow>
          <boxGeometry args={[6, 5, 4]} />
          <meshStandardMaterial color="#546e7a" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 3D Risk Scene ────────────────────────────────────────────────────────
function RiskScene({ zones, selectedZoneId, onZoneClick }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 200, 220], fov: 40 }}
      style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #060e08 0%, #0e1a10 100%)" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[80, 120, 80]} intensity={1.0} castShadow />
      <directionalLight position={[-60, 80, -60]} intensity={0.3} color="#7fb8ff" />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={40}
        maxDistance={450}
      />

      <RiskTerrain />
      <RiskEquipment />

      {zones.map((zone) => (
        <RiskDisc
          key={zone.id}
          zone={zone}
          isSelected={zone.id === selectedZoneId}
          onClick={onZoneClick}
        />
      ))}

      {/* Mine boundary */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <ringGeometry args={[112, 115, 64]} />
        <meshBasicMaterial color="#315d43" transparent opacity={0.4} />
      </mesh>
    </Canvas>
  );
}

// ─── Risk Level Icon ──────────────────────────────────────────────────────
function RiskIcon({ level }) {
  if (level === "HIGH") return <AlertTriangle size={16} color="#ef4444" />;
  if (level === "MEDIUM") return <Shield size={16} color="#eab308" />;
  return <ShieldCheck size={16} color="#22c55e" />;
}

// ─── Zone List Item ───────────────────────────────────────────────────────
function ZoneListItem({ zone, isSelected, onClick }) {
  return (
    <button
      className={`risk-zone-item ${isSelected ? "risk-zone-selected" : ""}`}
      onClick={() => onClick(zone)}
      style={{ "--risk-color": zone.color }}
    >
      <div className="risk-zone-dot" style={{ background: zone.color }} />
      <div className="risk-zone-info">
        <span>{zone.label}</span>
        <strong className={`risk-badge-text risk-${zone.level.toLowerCase()}`}>
          <RiskIcon level={zone.level} /> {zone.level}
        </strong>
      </div>
    </button>
  );
}

// ─── Risk Detail Panel ────────────────────────────────────────────────────
function RiskDetailPanel({ zone, onInspectZone, disclaimer }) {
  if (!zone) {
    return (
      <div className="risk-detail-empty">
        <Info size={28} color="#315d43" />
        <p>Click any highlighted zone in the 3D map to view AI-assisted risk analysis.</p>
      </div>
    );
  }

  const levelClass = zone.level.toLowerCase();

  return (
    <div className="risk-detail-card">
      <div className={`risk-detail-header risk-header-${levelClass}`}>
        <RiskIcon level={zone.level} />
        <div>
          <div className="risk-detail-level">{zone.level} RISK ZONE</div>
          <div className="risk-detail-label">{zone.label}</div>
        </div>
      </div>

      <div className="risk-factors-grid">
        <div className="risk-factor-row">
          <span>Risk Score</span>
          <strong>{zone.score ?? "Demo"}{zone.score !== undefined ? "/100" : ""}</strong>
        </div>
        <div className="risk-factor-row">
          <span>Slope</span>
          <strong>{zone.factors.slope}</strong>
        </div>
        <div className="risk-factor-row">
          <span>Equipment Traffic</span>
          <strong>{zone.factors.equipmentTraffic}</strong>
        </div>
        <div className="risk-factor-row">
          <span>Historical Events</span>
          <strong>{zone.factors.historicalEvents}</strong>
        </div>
        <div className="risk-factor-row">
          <span>Terrain Change</span>
          <strong>{zone.factors.terrainChange}</strong>
        </div>
      </div>

      <div className="risk-primary-factors">
        <div className="risk-section-title">Primary Risk Factors:</div>
        <ul>
          {zone.primaryFactors.map((f, i) => (
            <li key={i}>• {f}</li>
          ))}
        </ul>
      </div>

      <div className="risk-recommendation">
        <Sparkles size={14} color="#b78645" />
        <div>
          <div className="risk-section-title">AI Recommendation:</div>
          <p>{zone.recommendation}</p>
        </div>
      </div>

      <div className="risk-disclaimer">
        ⚠️ <em>{disclaimer}</em>
      </div>
      <button className="secondary-button risk-inspect-button" onClick={() => onInspectZone(zone)}>
        <Eye size={15} /> Explain this zone in 3D
      </button>
    </div>
  );
}

// ─── KPI Summary Bar ─────────────────────────────────────────────────────
function RiskSummaryBar({ zones }) {
  const high = zones.filter((z) => z.level === "HIGH").length;
  const med = zones.filter((z) => z.level === "MEDIUM").length;
  const low = zones.filter((z) => z.level === "LOW").length;
  const averageScore = zones.some((zone) => zone.score !== undefined)
    ? Math.round(zones.reduce((sum, zone) => sum + (zone.score || 0), 0) / zones.length)
    : null;

  return (
    <div className="risk-summary-bar">
      <div className="risk-summary-item risk-high-bg">
        <AlertTriangle size={18} color="#ef4444" />
        <div>
          <span>High Risk Zones</span>
          <strong>{high}</strong>
        </div>
      </div>
      <div className="risk-summary-item risk-med-bg">
        <Shield size={18} color="#eab308" />
        <div>
          <span>Medium Risk Zones</span>
          <strong>{med}</strong>
        </div>
      </div>
      <div className="risk-summary-item risk-low-bg">
        <ShieldCheck size={18} color="#22c55e" />
        <div>
          <span>Low Risk Zones</span>
          <strong>{low}</strong>
        </div>
      </div>
      <div className="risk-summary-item">
        <BarChart3 size={18} color="#315d43" />
        <div>
          <span>Overall Risk Index</span>
          <strong>{averageScore === null ? "DEMO" : `${averageScore}/100`}</strong>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export function RiskMapPage({ onInspectZone }) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState(RISK_ZONES);
  const [dataSource, setDataSource] = useState("Connecting to spatial API");
  const [disclaimer, setDisclaimer] = useState("AI-assisted indicator only; not an authoritative safety decision. Verify with a qualified geotechnical engineer.");

  useEffect(() => {
    let cancelled = false;
    fetchMineRiskMap("mine-a")
      .then((result) => {
        if (cancelled) return;
        const colorByLevel = { HIGH: "#ef4444", MEDIUM: "#eab308", LOW: "#22c55e" };
        const apiZones = result.zones.map((zone) => {
          const factor = (name) => zone.factors.find((item) => item.name === name);
          return {
            id: zone.zone_id,
            label: zone.label,
            x: zone.x,
            y: zone.y,
            z: zone.z,
            radius: zone.radius,
            level: zone.level,
            color: colorByLevel[zone.level],
            score: zone.score,
            factors: {
              slope: factor("Slope")?.observation ?? "N/A",
              equipmentTraffic: factor("Equipment traffic")?.observation ?? "N/A",
              historicalEvents: Number(factor("Historical events")?.observation ?? 0),
              terrainChange: factor("Terrain change")?.observation ?? "N/A",
            },
            primaryFactors: zone.primary_factors,
            recommendation: zone.recommendation,
          };
        });
        setZones(apiZones);
        setDisclaimer(result.disclaimer);
        setDataSource(`API · ${result.data_source} · ${new Date(result.observed_at).toLocaleTimeString()}`);
      })
      .catch(() => setDataSource("Offline · sample data"));
    return () => { cancelled = true; };
  }, []);

  function handleZoneClick(zone) {
    setSelectedZone((prev) => (prev?.id === zone.id ? null : zone));
  }

  return (
    <>
      <header className="page-header">
        <div>
          <div className="eyebrow">AI PREDICTIVE RISK MAP · FEATURE 3</div>
          <h1>Mine Risk Intelligence Map</h1>
          <p>Demonstration risk indicators combine sample terrain, slope, equipment movement, and incident signals. Select a zone to inspect its factors or open it in the spatial AI view.</p>
        </div>
        <div className="header-status">
          <AlertTriangle size={17} />
          <span>{dataSource}</span>
        </div>
      </header>

      <RiskSummaryBar zones={zones} />

      <div className="risk-map-layout">
        {/* ── Left: Zone List ── */}
        <div className="risk-zone-panel">
          <div className="risk-panel-title">
            <Shield size={16} color="#b78645" />
            <span>Classified Zones ({zones.length})</span>
          </div>
          <div className="risk-zone-list">
            {zones.map((z) => (
              <ZoneListItem
                key={z.id}
                zone={z}
                isSelected={selectedZone?.id === z.id}
                onClick={handleZoneClick}
              />
            ))}
          </div>

          <div className="risk-legend">
            <div className="legend-title">Risk Level Legend</div>
            {[
              { level: "HIGH", color: "#ef4444", desc: "Immediate inspection required" },
              { level: "MEDIUM", color: "#eab308", desc: "Monitor weekly" },
              { level: "LOW", color: "#22c55e", desc: "Standard schedule" },
            ].map((l) => (
              <div key={l.level} className="legend-row">
                <div className="legend-dot" style={{ background: l.color }} />
                <span><strong>{l.level}</strong> — {l.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Center: 3D Map ── */}
        <div className="risk-3d-panel">
          <RiskScene
            zones={zones}
            selectedZoneId={selectedZone?.id}
            onZoneClick={handleZoneClick}
          />
          <div className="risk-map-hint">
            Click coloured zones to inspect risk factors
          </div>
        </div>

        {/* ── Right: Detail Panel ── */}
        <div className="risk-detail-panel">
          <div className="risk-panel-title">
            <Sparkles size={16} color="#b78645" />
            <span>Risk Analysis</span>
          </div>
          <RiskDetailPanel zone={selectedZone} onInspectZone={onInspectZone} disclaimer={disclaimer} />
        </div>
      </div>
    </>
  );
}
