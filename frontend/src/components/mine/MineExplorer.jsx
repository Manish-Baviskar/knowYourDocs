import React from "react";
import { MineScene } from "./MineScene";

export function MineExplorer({ layers, viewMode, equipmentList, selectedObjectId, onSelectObject, onSelectBench }) {
  return (
    <div style={{ width: "100%", height: "540px", position: "relative", borderRadius: "12px", overflow: "hidden" }}>
      <MineScene
        layers={layers}
        viewMode={viewMode}
        equipmentList={equipmentList}
        selectedObjectId={selectedObjectId}
        onSelectObject={onSelectObject}
        onSelectBench={onSelectBench}
      />
    </div>
  );
}
