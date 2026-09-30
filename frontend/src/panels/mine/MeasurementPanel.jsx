import React, { useState } from "react";
import { Ruler, Maximize2, MoveVertical } from "lucide-react";

export function MeasurementPanel() {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <div className="measurement-panel">
      <div className="panel-title">
        <Ruler size={16} />
        <span>SPATIAL MEASUREMENT TOOLS</span>
      </div>

      <div className="tool-buttons">
        <button
          className={activeTool === "distance" ? "active" : ""}
          onClick={() => setActiveTool(activeTool === "distance" ? null : "distance")}
        >
          <Ruler size={14} /> Distance Tool
        </button>

        <button
          className={activeTool === "elevation" ? "active" : ""}
          onClick={() => setActiveTool(activeTool === "elevation" ? null : "elevation")}
        >
          <MoveVertical size={14} /> Elevation / Slope
        </button>

        <button
          className={activeTool === "area" ? "active" : ""}
          onClick={() => setActiveTool(activeTool === "area" ? null : "area")}
        >
          <Maximize2 size={14} /> Bench Area
        </button>
      </div>

      {activeTool && (
        <div className="measurement-readout">
          <span>Active mode: <b>{activeTool}</b></span>
          <p>Click two points on the 3D terrain to measure spatial coordinates and depth vector.</p>
        </div>
      )}
    </div>
  );
}
