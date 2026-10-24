"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Scene from "../components/Scene";
import Chat from "../components/Chat";

export type TimeOfDay = "morning" | "midday" | "night";

export default function Home() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("midday");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
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
    <>
      <main>
        <Canvas shadows camera={{ position: [0, 12, 18], fov: 45 }}>
          <color attach="background" args={[ENV_COLORS[timeOfDay]]} />
          <fog attach="fog" args={[ENV_COLORS[timeOfDay], 10, 30]} />
          
          <PerspectiveCamera makeDefault position={[0, 12, 18]} fov={45} />
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2.2} 
            minPolarAngle={Math.PI / 4}
            maxDistance={25}
            minDistance={10}
          />

          <Environment preset={timeOfDay === "night" ? "night" : "city"} />
          <Scene timeOfDay={timeOfDay} isChatOpen={isChatOpen} />
        </Canvas>
      </main>

      <Chat isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </>
  );
}
