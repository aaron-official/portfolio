"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Scene from "./Scene";
import Chat from "./Chat";
import { hasWebGL } from "../lib/webgl";

export type TimeOfDay = "morning" | "midday" | "night";

// Mounts only once everything in its Suspense boundary has loaded, which tells the page the island is up.
function Loaded({ onLoaded }: { onLoaded: () => void }) {
  useEffect(onLoaded, [onLoaded]);
  return null;
}

export function WorldMessage({ onExit, children }: { onExit: () => void; children: React.ReactNode }) {
  return (
    <div className="world-loading">
      <div className="world-message">
        <p>{children}</p>
        <button className="world-exit-inline" onClick={onExit}>← Back to lite site</button>
      </div>
    </div>
  );
}

export default function World({ onExit }: { onExit: () => void }) {
  const [webgl] = useState(hasWebGL);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const markLoaded = () => setLoaded(true);
  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => setSlow(true), 15000);
    return () => clearTimeout(t);
  }, [loaded]);

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

  if (!webgl) {
    return (
      <WorldMessage onExit={onExit}>
        This device can&apos;t run 3D graphics right now (WebGL is off or unsupported). Try turning on hardware acceleration in your browser settings, or enjoy the lite site.
      </WorldMessage>
    );
  }

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

          {/* built from local lights; the preset HDRs come from a CDN that some networks block */}
          <Environment resolution={128}>
            <Lightformer form="rect" intensity={timeOfDay === "night" ? 0.4 : 2} position={[0, 8, 0]} scale={[20, 20, 1]} rotation-x={Math.PI / 2} />
            <Lightformer form="rect" intensity={timeOfDay === "night" ? 0.3 : 1.2} position={[-10, 3, 0]} scale={[10, 10, 1]} rotation-y={Math.PI / 2} />
            <Lightformer form="rect" intensity={timeOfDay === "night" ? 0.3 : 1.2} position={[10, 3, 0]} scale={[10, 10, 1]} rotation-y={-Math.PI / 2} />
          </Environment>
          <Suspense fallback={null}>
            <Scene timeOfDay={timeOfDay} isChatOpen={isChatOpen} />
            <Loaded onLoaded={markLoaded} />
          </Suspense>
        </Canvas>
        )}
      </main>

      {!loaded && (
        <div className="world-loading">
          <p>{slow ? "Taking a while. If it never appears, your network may be blocking something." : "Loading the island…"}</p>
          {slow && <button className="world-exit-inline" onClick={onExit}>← Back to lite site</button>}
        </div>
      )}

      <button className="world-exit" onClick={onExit}>← Back to lite site</button>
      <Chat isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}
