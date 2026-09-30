import React from "react";
import { Header } from "../components/Header";
import { MineExplorer } from "../components/mine/MineExplorer";
import { LayerPanel } from "../panels/mine/LayerPanel";
import { ObjectDetails } from "../panels/mine/ObjectDetails";
import { MineStats } from "../panels/mine/MineStats";
import { MeasurementPanel } from "../panels/mine/MeasurementPanel";
import { useMineData } from "../hooks/mine/useMineData";

export function MineExplorerPage({ selectedMine }) {
  const {
    currentMine,
    layers,
    toggleLayer,
    equipmentList,
    selectedObjectId,
    selectedObject,
    selectObject,
    viewMode,
    setViewMode,
  } = useMineData(selectedMine ? selectedMine.id : "mine-a");

  const activeCount = equipmentList.filter((item) => item.status === "ACTIVE").length;

  return (
    <>
      <Header
        eyebrow="CMPDI DIGITAL MINE INTELLIGENCE"
        title="3D Mine Explorer"
        description={`Interactive 3D visualization for ${currentMine.name} (${currentMine.location}). Explore stepped benches, haul road transportation, borehole data, and live mining equipment fleet.`}
      />

      <MineStats
        mine={currentMine}
        equipmentCount={equipmentList.length}
        activeCount={activeCount}
      />

      <div className="explorer-grid">
        <div className="explorer-main-column">
          <MineExplorer
            layers={layers}
            viewMode={viewMode}
            equipmentList={equipmentList}
            selectedObjectId={selectedObjectId}
            onSelectObject={selectObject}
          />

          <div className="explorer-bottom-row">
            <LayerPanel
              layers={layers}
              toggleLayer={toggleLayer}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            <MeasurementPanel />
          </div>
        </div>

        <div className="explorer-side-column">
          <ObjectDetails
            selectedObject={selectedObject}
            onClose={() => selectObject(null)}
          />
        </div>
      </div>
    </>
  );
}
