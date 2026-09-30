import React from "react";
import * as THREE from "three";

export function MineBoundary() {
  const points = [
    new THREE.Vector3(-140, 2, -180),
    new THREE.Vector3(140, 2, -180),
    new THREE.Vector3(140, 2, 180),
    new THREE.Vector3(-140, 2, 180),
    new THREE.Vector3(-140, 2, -180),
  ];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  const pillars = [
    [-140, -180],
    [140, -180],
    [140, 180],
    [-140, 180],
    [0, -180],
    [0, 180],
    [-140, 0],
    [140, 0],
  ];

  return (
    <group>
      {/* Perimeter Line */}
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineDashedMaterial({ color: "#b78645", dashSize: 4, gapSize: 2 }))} />

      {/* Boundary Pillars */}
      {pillars.map(([x, z], idx) => (
        <group key={idx} position={[x, 6, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.2, 1.6, 12, 8]} />
            <meshStandardMaterial color="#b78645" roughness={0.4} />
          </mesh>
          <mesh position={[0, 7, 0]}>
            <sphereGeometry args={[1.5, 8, 8]} />
            <meshStandardMaterial color="#ff9800" emissive="#ff9800" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
