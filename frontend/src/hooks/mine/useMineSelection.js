import { useState } from "react";

export function useMineSelection() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  function handleSelect(item) {
    setSelectedItem(item);
  }

  function clearSelection() {
    setSelectedItem(null);
  }

  return {
    selectedItem,
    hoveredItem,
    setHoveredItem,
    handleSelect,
    clearSelection,
  };
}
