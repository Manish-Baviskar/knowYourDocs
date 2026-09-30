import React, { useMemo } from "react";
import * as THREE from "three";

export function HaulRoads() {
  const roadCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-120, 2, 130),
      new THREE.Vector3(20, -10, 110),
      new THREE.Vector3(90, -22, 20),
      new THREE.Vector3(-20, -34, -40),
      new THREE.Vector3(-35, -46, 20),
      new THREE.Vector3(10, -58, -10),
    ]);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(roadCurve, 64, 5, 8, false);
  }, [roadCurve]);

  return (
    <group>
      <mesh geometry={tubeGeometry} receiveShadow>
        <meshStandardMaterial color="#594d3c" roughness={0.9} />
      </mesh>
    </group>
  );
}
