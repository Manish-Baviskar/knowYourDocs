import React from "react";
import { Eye, Layers, MapPin, Truck, Grid, Mountain } from "lucide-react";

export function LayerPanel({ layers, toggleLayer, viewMode, setViewMode }) {
  return (
    <div className="layer-panel">
      <div className="panel-title">
        <Layers size={16} />
        <span>3D VISUALIZATION LAYERS</span>
      </div>

      <div className="layer-toggle-grid">
        <label className={`layer-checkbox ${layers.terrain ? "active" : ""}`}>
          <input
            type="checkbox"
            checked={layers.terrain}
            onChange={() => toggleLayer("terrain")}
          />
          <Mountain size={14} /> Terrain Surface
        </label>

        <label className={`layer-checkbox ${layers.benches ? "active" : ""}`}>
          <input
            type="checkbox"
            checked={layers.benches}
            onChange={() => toggleLayer("benches")}
          />
          <Layers size={14} /> Stepped Benches
        </label>

        <label className={`layer-checkbox ${layers.haulRoads ? "active" : ""}`}>
          <input
            type="checkbox"
            checked={layers.haulRoads}
            onChange={() => toggleLayer("haulRoads")}
          />
          <MapPin size={14} /> Haul Roads
        </label>

        <label className={`layer-checkbox ${layers.equipment ? "active" : ""}`}>
          <input
            type="checkbox"
            checked={layers.equipment}
            onChange={() => toggleLayer("equipment")}
          />
          <Truck size={14} /> Mining Fleet
        </label>

        <label className={`layer-checkbox ${layers.boundary ? "active" : ""}`}>
          <input
            type="checkbox"
            checked={layers.boundary}
            onChange={() => toggleLayer("boundary")}
          />
          <Eye size={14} /> Mine Boundary
        </label>

        <label className={`layer-checkbox ${layers.grid ? "active" : ""}`}>
          <input
            type="checkbox"
            checked={layers.grid}
            onChange={() => toggleLayer("grid")}
          />
          <Grid size={14} /> Coordinate Grid
        </label>
      </div>

      <div className="viewmode-selector">
        <span>Terrain View Mode:</span>
        <div className="btn-group">
          <button
            className={viewMode === "standard" ? "active" : ""}
            onClick={() => setViewMode("standard")}
          >
            Realistic
          </button>
          <button
            className={viewMode === "heatmap" ? "active" : ""}
            onClick={() => setViewMode("heatmap")}
          >
            Elevation Heatmap
          </button>
          <button
            className={viewMode === "wireframe" ? "active" : ""}
            onClick={() => setViewMode("wireframe")}
          >
            Wireframe
          </button>
        </div>
      </div>
    </div>
  );
}
