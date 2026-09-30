import { useState } from "react";
import { INITIAL_LAYERS, MINE_BLOCKS } from "../../data/mine/mineConfig";
import { INITIAL_EQUIPMENT } from "../../data/mine/equipmentData";

export function useMineData(initialMineId = "mine-a") {
  const [currentMineId, setCurrentMineId] = useState(initialMineId);
  const [layers, setLayers] = useState(INITIAL_LAYERS);
  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [viewMode, setViewMode] = useState("standard"); // standard, heatmap, slope, wireframe
  const [cameraPreset, setCameraPreset] = useState("orbit"); // orbit, top, pit, equipment

  const currentMine = MINE_BLOCKS[currentMineId] || MINE_BLOCKS["mine-a"];

  function toggleLayer(layerName) {
    setLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  }

  function selectObject(id) {
    setSelectedObjectId(id);
  }

  const selectedObject = equipmentList.find((item) => item.id === selectedObjectId) || null;

  return {
    currentMine,
    currentMineId,
    setCurrentMineId,
    layers,
    toggleLayer,
    equipmentList,
    selectedObjectId,
    selectedObject,
    selectObject,
    viewMode,
    setViewMode,
    cameraPreset,
    setCameraPreset,
  };
}
