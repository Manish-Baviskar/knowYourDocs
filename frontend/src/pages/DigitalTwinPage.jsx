import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  Layers3,
  Sliders,
  Play,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Truck,
  Map,
  Package,
  Clock,
} from "lucide-react";
import { SIMULATION_SCENARIOS } from "../data/mine/spatialData";
import { simulateMineScenario } from "../data/mine/spatialApi";

// ─── Bench data ──────────────────────────────────────────────────────────
const BASE_BENCHES = [
  { y: 0, w: 80, l: 80, color: "#6d7d6f" },
  { y: -11, w: 70, l: 70, color: "#7a6c53" },
  { y: -22, w: 60, l: 60, color: "#826a44" },
  { y: -33, w: 50, l: 50, color: "#7a6c53" },
  { y: -44, w: 38, l: 38, color: "#4a5e3a" },
  { y: -55, w: 28, l: 28, color: "#2d3a1e" },
  { y: -62, w: 18, l: 18, color: "#1a2010" },
  { y: -67, w: 10, l: 10, color: "#111" },
];

function TwinTerrain({ colorize }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(240, 280, 48, 48);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      let y = 0;
      if (dist > 90) {
        y = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 5;
      } else {
        const df = Math.pow(1 - dist / 90, 1.3);
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
      <meshStandardMaterial color={colorize ? "#244028" : "#3d4f3e"} roughness={0.9} />
    </mesh>
  );
}

function TwinBenches({ simBenchIndex, widthDelta, depthDelta, isSimulated }) {
  return (
    <group>
      {BASE_BENCHES.map((b, i) => {
        let w = b.w;
        let h = 3;
        let yPos = b.y;
        let color = b.color;
        let emissive = "#000";
        let emissiveIntensity = 0;

        if (isSimulated && i === simBenchIndex) {
          if (widthDelta) w = b.w + widthDelta;
          if (depthDelta) { yPos = b.y - depthDelta; color = "#1a2010"; }
          color = "#b78645";
          emissive = "#f57f17";
          emissiveIntensity = 0.6;
        }

        return (
          <mesh key={i} position={[0, yPos - h / 2, 0]} receiveShadow>
            <boxGeometry args={[w, h, b.l]} />
            <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

function TwinEquipment({ relocate, isSimulated, equipmentTarget }) {
  const pieces = [
    { id: "EX-01", pos: [28, -45, 10], color: "#ffb300" },
    { id: "EX-02", pos: [15, -34, -18], color: "#ffb300" },
    { id: "DT-05", pos: [28, -34, -10], color: "#e65100" },
    { id: "DT-08", pos: [18, -34, -30], color: "#e65100" },
    { id: "DR-01", pos: [-14, -22, 6], color: "#f57c00" },
  ];

  return (
    <group>
      {pieces.map((eq) => {
        let pos = eq.pos;
        let glow = false;
        if (isSimulated && relocate && eq.id === "EX-01") {
          pos = equipmentTarget
            ? [equipmentTarget.x, -22, equipmentTarget.z]
            : [-18, -22, 8];
          glow = true;
        }
        return (
          <group key={eq.id} position={pos}>
            <mesh castShadow>
              <boxGeometry args={[6, 5, 4]} />
              <meshStandardMaterial color={glow ? "#4caf50" : eq.color} emissive={glow ? "#2e7d32" : "#000"} emissiveIntensity={glow ? 0.8 : 0} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function TwinScene({ scenarioId, simBenchIndex, widthDelta, depthDelta, isSimulated, simulationResult }) {
  const relocate = scenarioId === "equip-relocation";
  return (
    <Canvas
      shadows
      camera={{ position: [110, 90, 130], fov: 45 }}
      style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #0a1a0e 0%, #142018 100%)" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[60, 100, 60]} intensity={1.2} castShadow />
      <OrbitControls enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2 - 0.05} minDistance={30} maxDistance={300} />
      <TwinTerrain colorize={isSimulated} />
      <TwinBenches simBenchIndex={simBenchIndex} widthDelta={widthDelta} depthDelta={depthDelta} isSimulated={isSimulated} />
      <TwinEquipment relocate={relocate} isSimulated={isSimulated} equipmentTarget={simulationResult?.simulated_geometry} />
      {isSimulated && scenarioId === "haul-reroute" && (
        <Line points={[[-90, 3, -70], [-45, 3, -40], [5, 3, 5], [70, 3, 45]]} color="#f4b942" lineWidth={4} />
      )}
      {/* Boundary ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <ringGeometry args={[91, 94, 64]} />
        <meshBasicMaterial color={isSimulated ? "#b78645" : "#315d43"} transparent opacity={0.5} />
      </mesh>
    </Canvas>
  );
}

// ─── Change metric chip ──────────────────────────────────────────────────
function DeltaChip({ icon: Icon, label, value, highlight, title }) {
  return (
    <div className={`delta-chip ${highlight ? "delta-highlight" : ""}`} title={title}>
      <Icon size={16} color={highlight ? "#b78645" : "#315d43"} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function SimulationMetricChip({ metric, index }) {
  const Icon = /volume|area/i.test(metric.name) ? Package
    : /equipment|relocation/i.test(metric.name) ? Truck
      : /road|ramp/i.test(metric.name) ? Map
        : /production|efficiency|congestion/i.test(metric.name) ? TrendingUp
          : Sliders;
  const format = (value) => value === null
    ? "Not estimated"
    : `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)}${metric.unit ? ` ${metric.unit}` : ""}`;
  const value = metric.change === null
    ? "Not estimated from available inputs"
    : `Current ${format(metric.current_value)} → Simulated ${format(metric.simulated_value)} · Δ ${format(metric.change)}`;

  return <DeltaChip icon={Icon} label={metric.name} value={value} highlight={index % 2 === 0} title={metric.basis} />;
}

// ─── Main Page ────────────────────────────────────────────────────────────
export function DigitalTwinPage() {
  const [selectedScenario, setSelectedScenario] = useState(SIMULATION_SCENARIOS[0]);
  const [expansionMeters, setExpansionMeters] = useState(10);
  const [simActive, setSimActive] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationError, setSimulationError] = useState("");

  const scenario = selectedScenario;
  const c = scenario.id === "bench5-expand"
    ? {
        ...scenario.changes,
        volumeChange: `+${(48_500 * expansionMeters / 10).toLocaleString()} m³`,
        areaChange: `+${(0.012 * expansionMeters).toFixed(2)} km²`,
        productionImpact: `+${Math.round(1.2 * expansionMeters)}% coal recovery`,
      }
    : scenario.changes;

  async function runSimulation() {
    setSimulating(true);
    setSimActive(false);
    setSimulationError("");
    try {
      const result = await simulateMineScenario("mine-a", {
        scenario_id: scenario.id,
        expansion_m: expansionMeters,
        depth_increment_m: 8,
      });
      setSimulationResult(result);
      setSimActive(true);
    } catch {
      setSimulationResult(null);
      setSimulationError("Spatial API unavailable. Showing local demonstration estimates.");
      setSimActive(true);
    } finally {
      setSimulating(false);
    }
  }

  function resetSim() {
    setSimActive(false);
    setSimulationResult(null);
    setSimulationError("");
  }

  // Map scenario to bench index
  const scenarioBenchMap = {
    "bench5-expand": { benchIndex: 4, widthDelta: 10, depthDelta: 0 },
    "depth-increase": { benchIndex: 7, widthDelta: 0, depthDelta: 8 },
    "equip-relocation": { benchIndex: 2, widthDelta: 0, depthDelta: 0 },
    "haul-reroute": { benchIndex: null, widthDelta: 0, depthDelta: 0 },
  };
  const simParams = scenarioBenchMap[scenario.id] || { benchIndex: null, widthDelta: 0, depthDelta: 0 };
  if (scenario.id === "bench5-expand") simParams.widthDelta = expansionMeters;
  const simulatedWidth = simulationResult?.simulated_geometry?.width_m;
  if (scenario.id === "bench5-expand" && simulatedWidth !== undefined) simParams.widthDelta = simulatedWidth - 38;

  return (
    <>
      <header className="page-header">
        <div>
          <div className="eyebrow">DIGITAL TWIN SIMULATOR · FEATURE 2</div>
          <h1>Mine "What-If" Scenario Engine</h1>
          <p>Select a scenario, run the simulation, and compare <strong>CURRENT</strong> vs <strong>SIMULATED</strong> mine state side-by-side with quantified impact metrics.</p>
        </div>
        <div className="header-status">
          <Layers3 size={17} />
          <span>{simActive ? "Simulation Active" : "Awaiting Scenario"}</span>
        </div>
      </header>

      {/* ── Scenario Selector ── */}
      <section className="panel twin-control-panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">SCENARIO ENGINE</div>
            <h2>Select What-If Scenario</h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {simActive && (
              <button className="secondary-button" onClick={resetSim}>
                <RefreshCw size={15} /> Reset
              </button>
            )}
            <button
              className="primary-button"
              onClick={runSimulation}
              disabled={simulating}
            >
              {simulating ? (
                <><RefreshCw size={15} className="spin" /> Simulating...</>
              ) : (
                <><Play size={15} /> Run Simulation</>
              )}
            </button>
          </div>
        </div>

        <div className="scenario-grid">
          {SIMULATION_SCENARIOS.map((s) => (
            <button
              key={s.id}
              className={`scenario-card ${selectedScenario.id === s.id ? "scenario-active" : ""}`}
              onClick={() => { setSelectedScenario(s); setSimActive(false); setSimulationResult(null); setSimulationError(""); }}
            >
              <strong>{s.label}</strong>
              <p>{s.description}</p>
            </button>
          ))}
        </div>
        {scenario.id === "bench5-expand" && (
          <label className="scenario-parameter">
            <span>Bench 5 expansion</span>
            <input
              type="range"
              min="4"
              max="20"
              step="2"
              value={expansionMeters}
              onChange={(event) => {
                setExpansionMeters(Number(event.target.value));
                setSimActive(false);
                setSimulationResult(null);
              }}
            />
            <output>{expansionMeters} m</output>
          </label>
        )}
      </section>

      {/* ── 3D Split Viewer ── */}
      <div className="twin-viewer-row">
        <div className="twin-viewport-wrapper">
          <div className="twin-label current-label">CURRENT STATE</div>
          <TwinScene
            scenarioId={scenario.id}
            simBenchIndex={simParams.benchIndex}
            widthDelta={simParams.widthDelta}
            depthDelta={simParams.depthDelta}
            isSimulated={false}
          />
        </div>

        <div className="twin-divider">
          <ArrowRight size={28} color="#b78645" />
        </div>

        <div className="twin-viewport-wrapper">
          <div className={`twin-label simulated-label ${simActive ? "sim-active-label" : ""}`}>
            {simActive ? "SIMULATED STATE" : "RUN SIMULATION →"}
          </div>
          <TwinScene
            scenarioId={scenario.id}
            simBenchIndex={simParams.benchIndex}
            widthDelta={simParams.widthDelta}
            depthDelta={simParams.depthDelta}
            isSimulated={simActive}
          />
          {!simActive && !simulating && (
            <div className="twin-overlay-hint">
              <Play size={28} color="#fff" opacity={0.4} />
            </div>
          )}
          {simulating && (
            <div className="twin-overlay-hint sim-running">
              <div className="sim-spinner" />
              <span>Computing simulation...</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Impact Metrics ── */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">SIMULATION IMPACT ANALYSIS</div>
            <h2>Estimated Changes — <em>{scenario.label}</em></h2>
          </div>
        </div>
        <div className="delta-metrics-grid">
          {simulationResult ? simulationResult.metrics.map((metric, index) => (
            <SimulationMetricChip key={metric.name} metric={metric} index={index} />
          )) : <>
            <DeltaChip icon={Package} label="Volume Change" value={c.volumeChange} highlight />
            <DeltaChip icon={Map} label="Area Change" value={c.areaChange} />
            <DeltaChip icon={TrendingUp} label="Production Impact" value={c.productionImpact} highlight />
            <DeltaChip icon={Truck} label="Equipment Impact" value={c.equipmentImpact} />
            <DeltaChip icon={Map} label="Road / Ramp Impact" value={c.roadImpact} />
            <DeltaChip icon={Clock} label="Time to Benefit" value={c.timeToBenefit} />
          </>}
        </div>
        {simulationResult && (
          <div className="simulation-assumptions">
            <strong>Calculation basis · {simulationResult.data_source}</strong>
            <ul>{simulationResult.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul>
          </div>
        )}
        {simulationError && <p className="twin-note">{simulationError}</p>}
        {!simActive && (
          <p className="twin-note">⚠️ Run the simulation to compare current vs simulated 3D views above.</p>
        )}
        {simActive && (
          <p className="twin-note twin-note-success">Simulation complete. Highlighted geometry reflects the proposed scenario.</p>
        )}
      </section>
    </>
  );
}
