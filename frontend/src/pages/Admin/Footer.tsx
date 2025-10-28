import React, { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

// CartoonPerson same as before (omit for brevity)

function CartoonPerson({
  position,
  name,
  shirtColor = "#fff",
  pantsColor = "#6594BD",
  hairColor = "#222",
  skinColor = "#FFDAB9",
}) {
  return (
    <group position={position}>
      {/* Head */}
      <mesh position={[0, 1.07, 0]}>
        <sphereGeometry args={[0.23, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.2, 0.02]} rotation={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.21, 28, 28, 0, Math.PI * 2, 0, Math.PI * 0.67]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.06, 1.13, 0.2]}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshStandardMaterial color="#252525" />
      </mesh>
      <mesh position={[0.06, 1.13, 0.19]}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshStandardMaterial color="#252525" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.18, 0.34, 0.12]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.15, 0.9, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.028, 0.028, 0.21, 10]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      <mesh position={[0.15, 0.9, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[0.028, 0.028, 0.21, 10]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.05, 0.38, 0]}>
        <boxGeometry args={[0.06, 0.21, 0.095]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>
      <mesh position={[0.05, 0.38, 0]}>
        <boxGeometry args={[0.06, 0.21, 0.095]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.05, 0.19, 0.05]}>
        <boxGeometry args={[0.065, 0.045, 0.125]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.05, 0.19, 0.05]}>
        <boxGeometry args={[0.065, 0.045, 0.125]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Name label */}
      <Html position={[0, 1.32, 0]}>
        <div
          style={{
            color: "#3CBEAC",
            fontWeight: 800,
            letterSpacing: ".05em",
            fontSize: "1.1rem",
            textShadow: "0 0 8px #EFAF76, 0 0 2px #000",
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

// Simple rotating box instead of house
function RotatingBox({ onClick }) {
  const ref = React.useRef();
  useFrame(({ clock }) => {
    if(ref.current){
      ref.current.rotation.x = clock.getElapsedTime() * 0.45;
      ref.current.rotation.y = clock.getElapsedTime() * 0.65;
    }
  });
  return (
    <mesh ref={ref} onClick={onClick} style={{cursor: "pointer"}}>
      <boxGeometry args={[2, 1.5, 2]} />
      <meshStandardMaterial
        color="#3CBEAC"
        metalness={0.6}
        roughness={0.15}
        emissive="#EFAF76"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

export default function Footer3D() {
  const [membersVisible, setMembersVisible] = useState(false);
  const R = 2.3;
  const memberData = [
    { name: "Ojit", angle: 0 },
    { name: "Kuldeep", angle: Math.PI / 2 },
    { name: "Rachit", angle: Math.PI },
    { name: "Rangoli", angle: (3 * Math.PI) / 2, shirtColor: "#EFAF76" },
  ].map((m) => ({
    ...m,
    position: [R * Math.cos(m.angle), 0, R * Math.sin(m.angle)],
  }));

  return (
    <footer className="relative w-full h-[300px] bg-[#FAF7F6] overflow-hidden">
      <Canvas camera={{ position: [0, 2.5, 7], fov: 48 }}>
        <hemisphereLight skyColor="#3CBEAC" groundColor="#285570" intensity={0.59} />
        <directionalLight position={[6, 7, 6]} color="#EFAF76" intensity={0.29} />
        <spotLight
          position={[-4, 8, 5]}
          angle={0.45}
          penumbra={1}
          color="#FFFBEF"
          intensity={0.45}
          castShadow
        />
        {!membersVisible ? (
          <RotatingBox onClick={() => setMembersVisible(true)} />
        ) : (
          memberData.map((m) => (
            <CartoonPerson
              key={m.name}
              name={m.name}
              position={m.position}
              shirtColor={m.shirtColor}
            />
          ))
        )}
      </Canvas>
      <div className="absolute bottom-3 w-full text-center text-sm font-bold text-[#285570] opacity-90 pointer-events-none tracking-wide select-none">
        {membersVisible ? "Meet the team!" : "Click the box to reveal team members"}
      </div>
    </footer>
  );
}
