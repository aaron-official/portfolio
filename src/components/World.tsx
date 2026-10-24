"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Scene from "./Scene";
import Chat from "./Chat";

export type TimeOfDay = "morning" | "midday" | "night";

export default function World({ onExit }: { onExit: () => void }) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("midday");
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Canvas needs a real element to attach pointer events to; in dev (StrictMode) its own lookup can be null and crash the scene
  const [stage, setStage] = useState<HTMLElement | null>(null);
  
  // Environment Colors
  const ENV_COLORS = {
    morning: "#ffa07a", // Light salmon/orange
    midday: "#87ceeb",  // Sky blue
    night: "#0a192f"    // Deep night blue
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setTimeOfDay("morning");
    } else if (hour >= 11 && hour < 18) {
      setTimeOfDay("midday");
    } else {
      setTimeOfDay("night");
    }
  }, []);

  return (
    <div className="world-root">
      <main ref={setStage}>
        {stage && (
        <Canvas shadows eventSource={stage} camera={{ position: [-2.6, 13.8, 20.7], fov: 45 }}>
          <color attach="background" args={[ENV_COLORS[timeOfDay]]} />
          <fog attach="fog" args={[ENV_COLORS[timeOfDay], 10, 30]} />
          
          <PerspectiveCamera makeDefault position={[-2.6, 13.8, 20.7]} fov={45} />
          <OrbitControls 
            target={[-2.6, 0, 0]}
            enablePan={false} 
            maxPolarAngle={Math.PI / 2.2} 
            minPolarAngle={Math.PI / 4}
            maxDistance={25}
            minDistance={10}
          />

          <Environment preset={timeOfDay === "night" ? "night" : "city"} />
          <Scene timeOfDay={timeOfDay} isChatOpen={isChatOpen} />
        </Canvas>
        )}
      </main>

      <button className="world-exit" onClick={onExit}>← Back to lite site</button>
      <Chat isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}
