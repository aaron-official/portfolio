"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Three.js and the digital twin model (about 700 KB together) are fetched only after the page has finished loading and the browser is idle, and only on devices that can run WebGL.
const Chat = dynamic(() => import("./Chat"), { ssr: false });

const GREETINGS = [
  "Finally, a page with no fox on it.",
  "Made it off the island. The fox is still out there.",
  "Sorry I'm late, the island's wifi is terrible.",
  "Aaron's digital twin here. I'm 450 KB, so thank you for waiting.",
  "I'm Aaron's digital twin. I only say what's in his CV, so no tall tales.",
  "Escaped the island. Ask me about Aaron before the fox finds me.",
  "Asking me is free. The fox charges extra.",
  "Hi, I'm Aaron's twin, fresh off the island. Ask me anything about his work.",
];

const NUDGES: Record<string, string> = {
  work: "Want more on any of these? Ask me about this work and Aaron's other projects.",
  footer: "Made it to the bottom? Bold. I'm Aaron's digital twin, and I can tell you way more than a footer can. Go on, ask.",
};

type SlowConnection = { saveData?: boolean; effectiveType?: string };

export function LandingChat() {
  const [load, setLoad] = useState(false);
  const [lite, setLite] = useState(false);
  const [worldOpen, setWorldOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);

  // the island has its own robot, and phones only allow a few WebGL contexts, so this one steps aside while the island is open
  useEffect(() => {
    const onWorld = (e: Event) => setWorldOpen((e as CustomEvent<boolean>).detail);
    window.addEventListener("world-toggle", onWorld);
    return () => window.removeEventListener("world-toggle", onWorld);
  }, []);

  // the twin comments when the visitor reaches the work section and again at the footer
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const text = NUDGES[entry.target.id];
          if (text) setNudge(text);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    Object.keys(NUDGES).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // on data saver or very slow connections the twin still shows up, just with a photo instead of the 3D robot
    const c = (navigator as Navigator & { connection?: SlowConnection }).connection;
    if (c?.saveData || (c?.effectiveType && /(^|-)2g$/.test(c.effectiveType))) setLite(true);

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      const go = () => !cancelled && setLoad(true);
      if ("requestIdleCallback" in window) window.requestIdleCallback(go, { timeout: 4000 });
      else timer = setTimeout(go, 1500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      clearTimeout(timer);
    };
  }, []);

  // hidden, not unmounted, while the island is open so the conversation survives the visit
  return load ? (
    <div hidden={worldOpen}>
      <Chat isOpen={isOpen} setIsOpen={setIsOpen} greetings={GREETINGS} nudge={nudge} lite={lite || worldOpen} />
    </div>
  ) : null;
}
