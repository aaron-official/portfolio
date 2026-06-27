"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Fox } from "./models/Fox";

interface PlayerProps {
  initialPosition?: [number, number, number];
  targetPosition: THREE.Vector3;
  onPositionUpdate: (pos: THREE.Vector3) => void;
}

export default function Player({ initialPosition = [0, 0, 0], targetPosition, onPositionUpdate }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animation, setAnimation] = useState<"idle" | "walk" | "run">("idle");

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const currentPos = groupRef.current.position;
    const distanceToTarget = currentPos.distanceTo(targetPosition);
    
    // Manage animations based on distance
    if (distanceToTarget > 0.1) {
      if (animation !== "walk") setAnimation("walk");
      
      // Speed factor of 3 for smooth walking
      currentPos.lerp(targetPosition, 3 * delta);
      
      // Rotate the character to face movement direction
      const direction = new THREE.Vector3().subVectors(targetPosition, currentPos);
      if (direction.lengthSq() > 0.01) {
        // We use Math.atan2 to get the angle on the XZ plane.
        // We add Math.PI because the model might be facing backward natively.
        const targetRotation = Math.atan2(direction.x, direction.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 10 * delta);
      }
    } else {
      if (animation !== "idle") setAnimation("idle");
    }

    // Report current position for POI distance checks
    onPositionUpdate(currentPos);
  });

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* Scale the fox down to fit the island nicely */}
      <Fox 
        currentAnimation={animation} 
        position={[0, 0.2, 0]} 
        scale={[0.4, 0.4, 0.4]} 
      />
    </group>
  );
}
