"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

// Efeito 1: O Fundo Fluido Orgânico (Massivo, sem bordas)
function FluidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    // 500x300 garante que as bordas nunca sejam vistas pela câmera
    return new THREE.PlaneGeometry(500, 300, 100, 80);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * 0.15;
      const positions = meshRef.current.geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Ondulação suave e oceânica
        const z = 
          Math.sin(x * 0.02 + time) * 10 + 
          Math.cos(y * 0.02 + time) * 10 + 
          Math.sin((x + y) * 0.01 - time) * 5;
        
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -50]}>
      <bufferGeometry attach="geometry" {...geometry} />
      <meshStandardMaterial 
        color="#022c22"
        emissive="#064e3b"
        roughness={0.6}
        metalness={0.4}
      />
    </mesh>
  );
}

// Efeito 2: Partículas Flutuantes de Alta Tecnologia (Constelação de Dados)
function FloatingParticles() {
  const ref = useRef<any>();
  // 3000 pontos * 3 eixos. O código antigo usava 5000 (não múltiplo de 3)
  const sphere = useMemo(() => random.inSphere(new Float32Array(3000 * 3), { radius: 45 }), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.02;
      ref.current.rotation.y -= delta * 0.03;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#2DD4BF"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{ background: '#020617' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        {/* Fog profundo misturando as bordas com o background */}
        <fog attach="fog" args={["#020617", 15, 90]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 15]} intensity={2.5} color="#14b8a6" />
        <pointLight position={[-10, -10, -10]} intensity={3.5} color="#0f766e" />
        
        <FluidBackground />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
