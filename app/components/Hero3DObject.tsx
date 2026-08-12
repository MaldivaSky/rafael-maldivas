"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FluidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    // Aumentado drasticamente para preencher telas ultra-wide
    return new THREE.PlaneGeometry(160, 100, 120, 80);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * 0.3;
      const positions = meshRef.current.geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        const z = 
          Math.sin(x * 0.12 + time) * 2.5 + 
          Math.cos(y * 0.12 + time) * 2.5 + 
          Math.sin((x + y) * 0.08 - time) * 1.5;
        
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -15]}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshStandardMaterial 
        color="#0E9384"
        emissive="#021512"
        roughness={0.15}
        metalness={0.85}
        wireframe={false}
      />
    </mesh>
  );
}

export default function Hero3DObject() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        {/* Fog empurrado para o fundo para não recortar o mesh */}
        <fog attach="fog" args={["#070A12", 30, 80]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 20]} intensity={3.5} color="#2DD4BF" />
        <pointLight position={[-15, -10, 15]} intensity={4} color="#0B7669" />
        <FluidBackground />
      </Canvas>
    </div>
  );
}
