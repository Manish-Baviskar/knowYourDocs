import React from "react";
import { BENCHES_DATA, BOREHOLES_DATA } from "../../data/mine/terrainData";

export function Benches({ onSelectBench }) {
  return (
    <group>
      {BENCHES_DATA.map((bench) => (
        <group key={bench.level} position={[0, bench.y - bench.thickness / 2, 0]}>
          <mesh
            receiveShadow
            castShadow
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectBench) onSelectBench(bench);
            }}
          >
            <boxGeometry args={[bench.width, bench.thickness, bench.length]} />
            <meshStandardMaterial color={bench.color} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Borehole Drill Rig Markers */}
      {BOREHOLES_DATA.map((bh) => (
        <group key={bh.id} position={[bh.x, 2, bh.z]}>
          {/* Borehole shaft line down to pit */}
          <mesh position={[0, -50, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 100, 8]} />
            <meshStandardMaterial color="#ff9800" opacity={0.6} transparent />
          </mesh>

          {/* Marker Beacon */}
          <mesh position={[0, 6, 0]}>
            <coneGeometry args={[2, 6, 4]} />
            <meshStandardMaterial color="#ff9800" emissive="#ff9800" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
