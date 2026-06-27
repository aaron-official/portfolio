"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Fox } from "./Fox";

interface WanderingFoxProps {
  initialPosition: [number, number, number];
  bounds: number; // How far it can wander from center
}

export function WanderingFox({ initialPosition, bounds }: WanderingFoxProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animation, setAnimation] = useState<"idle" | "walk" | "run">("idle");
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2])
  );
  
  // Logic to pick a new random destination periodically
  useEffect(() => {
    const pickNewTarget = () => {
      // Pick a random point within the bounds, offset by initialPosition
      const randomAngle = Math.random() * Math.PI * 2;
      const randomRadius = Math.random() * bounds;
      
      const newX = initialPosition[0] + Math.cos(randomAngle) * randomRadius;
      const newZ = initialPosition[2] + Math.sin(randomAngle) * randomRadius;
      
      setTargetPosition(new THREE.Vector3(newX, initialPosition[1], newZ));
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        pickNewTarget();
      }
    }, 4000 + Math.random() * 4000); // Pick a new target every 4-8 seconds

    return () => clearInterval(interval);
  }, [bounds, initialPosition]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const currentPos = groupRef.current.position;
    const distanceToTarget = currentPos.distanceTo(targetPosition);
    
    // Manage animations based on distance
    if (distanceToTarget > 0.5) {
      if (animation !== "walk") setAnimation("walk");
      
      // Slower speed factor for NPCs
      currentPos.lerp(targetPosition, 0.5 * delta);
      
      // Rotate the character to face movement direction
      const direction = new THREE.Vector3().subVectors(targetPosition, currentPos);
      if (direction.lengthSq() > 0.01) {
        const targetRotation = Math.atan2(direction.x, direction.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 5 * delta);
      }
    } else {
      if (animation !== "idle") setAnimation("idle");
    }
  });

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* Scale the NPC fox smaller than the player */}
      <Fox 
        currentAnimation={animation} 
        position={[0, 0.2, 0]} 
        scale={[0.25, 0.25, 0.25]} 
      />
    </group>
  );
}
