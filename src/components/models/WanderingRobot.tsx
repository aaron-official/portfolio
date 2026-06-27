"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

interface WanderingRobotProps {
  initialPosition: [number, number, number];
  bounds: number;
}

export function WanderingRobot({ initialPosition, bounds }: WanderingRobotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/RobotExpressive.glb");
  const { actions } = useAnimations(animations, groupRef);
  
  // Clone the scene so it doesn't share state/scale with ChatRobot
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  
  const [animation, setAnimation] = useState<"Idle" | "Walking">("Idle");
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2])
  );

  // Manage animations
  useEffect(() => {
    if (!actions) return;
    
    // Stop all current animations
    Object.values(actions).forEach(action => action?.fadeOut(0.2));
    
    // Play the new animation
    const newAction = actions[animation];
    if (newAction) {
      newAction.reset().fadeIn(0.2).play();
    }
  }, [animation, actions]);

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
    
    // Manage animations and movement based on distance
    if (distanceToTarget > 0.5) {
      if (animation !== "Walking") setAnimation("Walking");
      
      // Move towards target
      currentPos.lerp(targetPosition, 1.5 * delta);
      
      // Rotate the character to face movement direction
      const direction = new THREE.Vector3().subVectors(targetPosition, currentPos);
      if (direction.lengthSq() > 0.01) {
        const targetRotation = Math.atan2(direction.x, direction.z);
        // Add Math.PI / 2 offset if the model's default orientation is sideways, 
        // usually characters face +Z or +X. Adjust if the robot moonwalks.
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 5 * delta);
      }
    } else {
      if (animation !== "Idle") setAnimation("Idle");
    }
  });

  return (
    <group ref={groupRef} position={initialPosition} scale={[0.5, 0.5, 0.5]} dispose={null}>
      {/* Scale applied to group, not the shared scene primitive */}
      <primitive object={clone} />
    </group>
  );
}
