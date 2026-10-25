"use client";

import { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Html, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import Player from "./Player";
import "../lib/draco";
import { Island } from "./models/Island";
import { Sky } from "./models/Sky";
import { Bird } from "./models/Bird";
import { WanderingFox } from "./models/WanderingFox";
import { WanderingRobot } from "./models/WanderingRobot";
import { TimeOfDay } from "./World";
import { ContactForm } from "./ContactForm";

// Remapped coordinates to spread details all over the highland
const POIS = [
  { id: "about", position: new THREE.Vector3(-12, 1, 6), label: "About Me" },
  { id: "contact", position: new THREE.Vector3(12, 1, -2), label: "Contact Me" }
];

const POI_CONTENT: Record<string, React.ReactNode> = {
  about: (
    <div className="hologram-ui">
      <h2>About Aaron</h2>
      <p>Software engineer in Kampala, building mobile-money payment systems and AI tools since 2021.</p>
      <ul>
        <li>Software Engineer</li>
        <li>Fintech Systems</li>
        <li>Full-Stack</li>
        <li>AI Engineer</li>
      </ul>
      <p style={{ marginTop: '16px', fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.6)' }}>
        Ask my Digital Twin in the corner about my career journey and featured projects!
      </p>
    </div>
  ),
  contact: (
    <ContactForm />
  )
};

interface SceneProps {
  timeOfDay: TimeOfDay;
  isChatOpen: boolean;
}

export default function Scene({ timeOfDay, isChatOpen }: SceneProps) {
  // Start player near the About Me POI so it opens automatically
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(-10, 0, 5));
  const [activePoi, setActivePoi] = useState<string | null>("about");

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Only register clicks on the island mesh
    e.stopPropagation();
    // Set target where user clicked
    setTargetPosition(new THREE.Vector3(e.point.x, 0, e.point.z));
  };

  const handlePlayerMove = (pos: THREE.Vector3) => {
    let closestPoi = null;
    const minDistance = 4.0; // Activation radius

    for (const poi of POIS) {
      // Calculate distance ignoring Y axis for generous triggering
      const dist = Math.hypot(pos.x - poi.position.x, pos.z - poi.position.z);
      if (dist < minDistance) {
        closestPoi = poi.id;
        break;
      }
    }

    if (activePoi !== closestPoi) {
      setActivePoi(closestPoi);
    }
  };

  // Dynamic Lighting Configuration
  const lighting = {
    morning: { ambient: 0.4, sunColor: "#ffd27f", sunPos: [15, 5, 10] as [number, number, number], intensity: 1.2 },
    midday: { ambient: 0.6, sunColor: "#fdfbd3", sunPos: [10, 20, 10] as [number, number, number], intensity: 1.5 },
    night: { ambient: 0.15, sunColor: "#a2b9e7", sunPos: [-15, 10, -10] as [number, number, number], intensity: 0.5 }
  };
  const activeLight = lighting[timeOfDay];

  return (
    <group>
      <ambientLight intensity={activeLight.ambient} />
      <directionalLight 
        position={activeLight.sunPos} 
        intensity={activeLight.intensity} 
        color={activeLight.sunColor}
        castShadow 
      />
      
      <Sky />

      <Island 
        position={[0, -1, 0]} 
        scale={[0.5, 0.5, 0.5]} 
        onPointerDown={handlePointerDown} 
      />

      {/* Ambient Animated Objects */}
      <Bird />

      {/* NPCs */}
      <WanderingFox initialPosition={[5, 0, 5]} bounds={12} />
      <WanderingFox initialPosition={[-6, 0, 4]} bounds={12} />
      <WanderingFox initialPosition={[2, 0, -8]} bounds={12} />
      
      {/* Dynamic Chat Robot */}
      {isChatOpen && (
        <WanderingRobot initialPosition={[-6, 0, 8]} bounds={4} />
      )}

      <Player initialPosition={[-10, 0, 5]} targetPosition={targetPosition} onPositionUpdate={handlePlayerMove} />

      {/* Render POI Markers and Holograms */}
      {POIS.map(poi => (
        <group key={poi.id} position={poi.position}>
          {/* Floating UI Marker */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1, 1.2, 32]} />
            <meshBasicMaterial color={activePoi === poi.id ? "#fff" : "#ff5722"} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          
          {activePoi !== poi.id && (
            <Billboard position={[0, 2, 0]}>
              <Text
                fontSize={0.6}
                color="#ff5722"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#fff"
                font="/fonts/Epilogue-Bold.ttf"
              >
                {poi.label}
              </Text>
            </Billboard>
          )}

          {activePoi === poi.id && (
            <Html
              position={[0, 3, 0]}
              center
              zIndexRange={[100, 0]}
              distanceFactor={15}
            >
              {POI_CONTENT[poi.id]}
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
