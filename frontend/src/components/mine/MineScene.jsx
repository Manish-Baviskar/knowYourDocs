import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MineLighting } from "./MineLighting";
import { MineGrid } from "./MineGrid";
import { MineBoundary } from "./MineBoundary";
import { Terrain } from "./Terrain";
import { Benches } from "./Benches";
import { HaulRoads } from "./HaulRoads";
import { Equipment } from "./Equipment";

export function MineScene({ layers, viewMode, equipmentList, selectedObjectId, onSelectObject, onSelectBench }) {
  return (
    <Canvas
      shadows
      camera={{ position: [140, 110, 180], fov: 45 }}
      style={{ width: "100%", height: "100%", background: "#1b2820" }}
      onPointerDown={(e) => {
        // Clear selection if clicking empty scene space
        if (e.target === e.currentTarget && onSelectObject) {
          onSelectObject(null);
        }
      }}
    >
      <MineLighting />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={30}
        maxDistance={400}
      />

      {layers.grid && <MineGrid />}
      {layers.boundary && <MineBoundary />}
      {layers.terrain && <Terrain viewMode={viewMode} />}
      {layers.benches && <Benches onSelectBench={onSelectBench} />}
      {layers.haulRoads && <HaulRoads />}
      {layers.equipment && (
        <Equipment
          equipmentList={equipmentList}
          selectedId={selectedObjectId}
          onSelect={onSelectObject}
        />
      )}
    </Canvas>
  );
}
