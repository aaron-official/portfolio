"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Three.js, the models and the chat widget only download after the click.
const World = dynamic(() => import("./World"), {
  ssr: false,
  loading: () => <div className="world-loading">Loading 3D world… (~5 MB)</div>,
});

export function EnterWorld({ className, children }: { className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && <World onExit={() => setOpen(false)} />}
    </>
  );
}
