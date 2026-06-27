"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export function Plane(props: any) {
  const ref = useRef<THREE.Mesh>(null);
  const { scene, animations } = useGLTF("/models/plane.glb");
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if (actions["Take 001"]) {
      actions["Take 001"].play();
    }
  }, [actions]);

  return (
    <mesh {...props} ref={ref}>
      <primitive object={scene} />
    </mesh>
  );
}

useGLTF.preload("/models/plane.glb");
