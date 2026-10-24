"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

export function ChatRobot({ hovered, onReady }: { hovered: boolean; onReady?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/RobotExpressive.glb");
  const { actions } = useAnimations(animations, group);

  // Clone the scene so it doesn't share state/scale with WanderingRobot
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // This component only renders once the model has loaded, so mounting means the robot is ready
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // Autonomous waving state
  const [autoWave, setAutoWave] = useState(false);

  useEffect(() => {
    // Randomly wave every 10-20 seconds
    const interval = setInterval(() => {
      setAutoWave(true);
      setTimeout(() => setAutoWave(false), 3000); // Wave lasts 3 seconds
    }, 10000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, []);

  const isWaving = hovered || autoWave;

  useEffect(() => {
    if (!actions) return;
    
    const idleAction = actions["Idle"];
    const waveAction = actions["Wave"];
    
    if (isWaving && waveAction) {
      waveAction.reset().fadeIn(0.2).play();
      if (idleAction) idleAction.fadeOut(0.2);
    } else if (idleAction) {
      idleAction.reset().fadeIn(0.2).play();
      if (waveAction) waveAction.fadeOut(0.2);
    }

    return () => {
      if (idleAction) idleAction.fadeOut(0.2);
      if (waveAction) waveAction.fadeOut(0.2);
    };
  }, [isWaving, actions]);

  return (
    <group ref={group} dispose={null} position={[0, -2.5, 0]} scale={[1.2, 1.2, 1.2]}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload("/models/RobotExpressive.glb");
