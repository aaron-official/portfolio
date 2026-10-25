"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { ChatRobot } from "./models/ChatRobot";

// The 3D robot on the chat button. It lives in its own file so devices that can't or shouldn't run WebGL never download three.js.
export default function RobotCanvas({ showRobot, hovered, onReady }: { showRobot: boolean; hovered: boolean; onReady: () => void }) {
  // r3f force-loses a canvas's WebGL context when it unmounts. In dev, StrictMode and Fast Refresh remount while reusing the same <canvas>,
  // which left the robot blank. A new key gives a fresh <canvas> after every effect pass and after any real context loss.
  const [canvasKey, setCanvasKey] = useState(0);
  useEffect(() => setCanvasKey((k) => k + 1), []);

  if (canvasKey === 0) return null;
  return (
    <Canvas
      key={canvasKey}
      style={{ width: "100%", height: "100%" }}
      // measure the layout size: the button scales in with a CSS animation, and a transformed measurement left the robot tiny
      resize={{ offsetSize: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          setCanvasKey((k) => k + 1);
        });
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 1, 8]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
      {showRobot && <ChatRobot hovered={hovered} onReady={onReady} />}
    </Canvas>
  );
}
