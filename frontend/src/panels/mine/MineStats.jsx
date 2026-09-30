import React from "react";
import { Mountain, Layers, Truck, Activity } from "lucide-react";

export function MineStats({ mine, equipmentCount, activeCount }) {
  return (
    <div className="mine-stats-panel">
      <div className="stat-pill">
        <Mountain size={16} />
        <div>
          <span>Max Pit Depth</span>
          <strong>{mine.depth} m</strong>
        </div>
      </div>

      <div className="stat-pill">
        <Layers size={16} />
        <div>
          <span>Bench Levels</span>
          <strong>{mine.benchesCount || 6} Benches</strong>
        </div>
      </div>

      <div className="stat-pill">
        <Truck size={16} />
        <div>
          <span>Mining Fleet</span>
          <strong>{equipmentCount} Assets</strong>
        </div>
      </div>

      <div className="stat-pill">
        <Activity size={16} />
        <div>
          <span>Operational Ratio</span>
          <strong>{activeCount}/{equipmentCount} Active</strong>
        </div>
      </div>
    </div>
  );
}
