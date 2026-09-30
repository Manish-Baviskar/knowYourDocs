import React from "react";

export function MineGrid() {
  return (
    <group position={[0, 0.2, 0]}>
      <gridHelper args={[320, 32, "#315d43", "#8da293"]} />
    </group>
  );
}
