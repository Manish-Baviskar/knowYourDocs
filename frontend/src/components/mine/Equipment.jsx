import React from "react";

function ExcavatorModel({ color, isSelected }) {
  return (
    <group>
      {/* Base Tracks */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[7, 3, 5]} />
        <meshStandardMaterial color="#2d312e" />
      </mesh>

      {/* Cabin Body */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[6, 4, 4.5]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>

      {/* Operator Window */}
      <mesh position={[2, 5.2, 1]} castShadow>
        <boxGeometry args={[2, 2.2, 2.2]} />
        <meshStandardMaterial color="#81d4fa" opacity={0.7} transparent />
      </mesh>

      {/* Boom Arm */}
      <mesh position={[2, 5, -1]} rotation={[0, 0, -0.6]} castShadow>
        <boxGeometry args={[10, 1.2, 1.2]} />
        <meshStandardMaterial color="#e65100" />
      </mesh>

      {/* Dipper Arm */}
      <mesh position={[8, 2, -1]} rotation={[0, 0, 0.8]} castShadow>
        <boxGeometry args={[8, 1, 1]} />
        <meshStandardMaterial color="#e65100" />
      </mesh>

      {/* Bucket */}
      <mesh position={[12, -2, -1]} castShadow>
        <boxGeometry args={[2.5, 2.5, 2.2]} />
        <meshStandardMaterial color="#212121" />
      </mesh>

      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[7, 7, 0.5, 16]} />
          <meshBasicMaterial color="#ffeb3b" opacity={0.6} transparent />
        </mesh>
      )}
    </group>
  );
}

function DumpTruckModel({ color, isSelected }) {
  return (
    <group>
      {/* Wheels */}
      {[-3, 3].map((x, i) =>
        [-2.5, 2.5].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 1.5, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[1.5, 1.5, 1.2, 12]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))
      )}

      {/* Truck Chassis */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[9, 1.5, 4.5]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>

      {/* Front Cab */}
      <mesh position={[3, 4.5, 0]} castShadow>
        <boxGeometry args={[3, 3, 4.2]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>

      {/* Haul Bed Box */}
      <mesh position={[-1.5, 5, 0]} rotation={[0, 0, -0.1]} castShadow>
        <boxGeometry args={[6.5, 3.5, 4.5]} />
        <meshStandardMaterial color="#e65100" roughness={0.5} />
      </mesh>

      {isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[6.5, 6.5, 0.5, 16]} />
          <meshBasicMaterial color="#ffeb3b" opacity={0.6} transparent />
        </mesh>
      )}
    </group>
  );
}

function DrillRigModel({ isSelected }) {
  return (
    <group>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[6, 2, 4]} />
        <meshStandardMaterial color="#424242" />
      </mesh>

      {/* Vertical Derrick Mast */}
      <mesh position={[-1, 10, 0]} castShadow>
        <boxGeometry args={[1.5, 16, 1.5]} />
        <meshStandardMaterial color="#f57c00" />
      </mesh>

      {isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[5, 5, 0.5, 16]} />
          <meshBasicMaterial color="#ffeb3b" opacity={0.6} transparent />
        </mesh>
      )}
    </group>
  );
}

function DozerModel({ isSelected }) {
  return (
    <group>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[6, 3, 4]} />
        <meshStandardMaterial color="#fbc02d" />
      </mesh>
      {/* Front Blade */}
      <mesh position={[3.5, 1.8, 0]} castShadow>
        <boxGeometry args={[1, 3, 5.5]} />
        <meshStandardMaterial color="#212121" />
      </mesh>

      {isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[5, 5, 0.5, 16]} />
          <meshBasicMaterial color="#ffeb3b" opacity={0.6} transparent />
        </mesh>
      )}
    </group>
  );
}

export function Equipment({ equipmentList, selectedId, onSelect }) {
  return (
    <group>
      {equipmentList.map((item) => {
        const isSelected = item.id === selectedId;
        const color = item.status === "ACTIVE" ? "#ffb300" : "#d32f2f";

        return (
          <group
            key={item.id}
            position={item.position}
            rotation={item.rotation}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item.id);
            }}
          >
            {item.modelType === "excavator" && <ExcavatorModel color={color} isSelected={isSelected} />}
            {item.modelType === "dumper" && <DumpTruckModel color={color} isSelected={isSelected} />}
            {item.modelType === "drill" && <DrillRigModel isSelected={isSelected} />}
            {item.modelType === "dozer" && <DozerModel isSelected={isSelected} />}
            {item.modelType === "tanker" && <DumpTruckModel color="#0288d1" isSelected={isSelected} />}

            {/* Floating Status Beacon */}
            <mesh position={[0, 15, 0]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color={item.status === "ACTIVE" ? "#4caf50" : "#f44336"} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
