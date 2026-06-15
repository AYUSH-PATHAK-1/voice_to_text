"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

function AudioSphere({ isActive = false }: { isActive?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
      
      const scale = isActive ? 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.05 : 1.2;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uActive;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vec3 viewDir = normalize(vPosition);
      float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.0);
      
      vec3 color = mix(vec3(0.55, 0.36, 0.96), vec3(0.23, 0.51, 0.96), vUv.y);
      color = mix(color, vec3(0.02, 0.71, 0.83), vUv.x);
      
      float pulse = sin(uTime * 2.0 + vUv.x * 5.0) * 0.5 + 0.5;
      
      gl_FragColor = vec4(color + fresnel * 0.3 + uActive * pulse * 0.1, 0.8 + fresnel * 0.2);
    }
  `;

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.2}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uActive: { value: isActive ? 1.0 : 0.5 },
        }}
        transparent
        side={THREE.DoubleSide}
      />
    </Sphere>
  );
}

function Particles() {
  const positions = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#6366f1" transparent opacity={0.6} />
    </points>
  );
}

export default function AIOrb3D({ isActive = false, className }: { isActive?: boolean; className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} color="#8b5cf6" intensity={0.5} />
        <AudioSphere isActive={isActive} />
        <Particles />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}