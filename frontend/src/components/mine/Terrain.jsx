import React, { useMemo } from "react";
import * as THREE from "three";

export function Terrain({ viewMode = "standard" }) {
  const { geometry, colors } = useMemo(() => {
    const width = 300;
    const height = 360;
    const widthSegs = 60;
    const heightSegs = 60;

    const geo = new THREE.PlaneGeometry(width, height, widthSegs, heightSegs);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const count = pos.count;
    const colorArray = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      const distFromCenter = Math.sqrt(x * x + z * z);
      let y = 0;

      // Outer rolling terrain
      if (distFromCenter > 110) {
        y = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 6 + Math.sin(x * 0.08) * 3;
      } else {
        // Excavated Open Pit
        const depthFactor = Math.pow(1 - distFromCenter / 110, 1.3);
        const steps = Math.floor(depthFactor * 5);
        y = -steps * 11 - (depthFactor * 8);
      }

      pos.setY(i, y);

      // Color mapping
      let c = new THREE.Color();
      if (viewMode === "heatmap") {
        const normY = (y + 65) / 75; // 0 (deepest) to 1 (surface)
        c.setHSL((1 - normY) * 0.65, 0.85, 0.5); // Red (deep pit) to Blue (high surface)
      } else if (viewMode === "slope") {
        const slope = Math.abs(Math.sin(x * 0.1) + Math.cos(z * 0.1));
        c.setHSL(slope * 0.3, 0.8, 0.45);
      } else {
        if (y < -30) {
          c.set("#1f2421"); // Coal seam bottom
        } else if (y < -10) {
          c.set("#7a6c53"); // Sandstone bench
        } else if (y < 2) {
          c.set("#91836c"); // Overburden
        } else {
          c.set("#526954"); // Surface vegetation
        }
      }

      colorArray[i * 3] = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
    geo.computeVertexNormals();

    return { geometry: geo, colors: colorArray };
  }, [viewMode]);

  return (
    <mesh geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.8}
        metalness={0.1}
        wireframe={viewMode === "wireframe"}
        flatShading
      />
    </mesh>
  );
}
