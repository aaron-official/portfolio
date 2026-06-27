"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function Sky() {
  const sky = useGLTF("/models/sky.glb");
  const skyRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (skyRef.current) {
      skyRef.current.rotation.y += 0.05 * delta; // Slow, ambient rotation
    }
  });

  return (
    <mesh ref={skyRef}>
      <primitive object={sky.scene} />
    </mesh>
  );
}

useGLTF.preload("/models/sky.glb");
