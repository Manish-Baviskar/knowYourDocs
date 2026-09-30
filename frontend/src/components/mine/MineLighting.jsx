import React from "react";

export function MineLighting() {
  return (
    <>
      {/* Sunlight */}
      <directionalLight
        position={[100, 150, 80]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={400}
        shadow-camera-left={-180}
        shadow-camera-right={180}
        shadow-camera-top={180}
        shadow-camera-bottom={-180}
      />

      {/* Soft Fill Light */}
      <directionalLight position={[-80, 60, -80]} intensity={0.5} color="#e0ded6" />

      {/* Sky/Ground Ambient Hemisphere */}
      <hemisphereLight skyColor="#b1e1ff" groundColor="#3e382d" intensity={0.75} />

      {/* Pit Sump Light */}
      <pointLight position={[0, -45, 0]} intensity={1.2} distance={120} color="#ffbe76" />
    </>
  );
}
