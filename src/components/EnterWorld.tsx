"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CanvasBoundary } from "./CanvasBoundary";

// Three.js, the models and the chat widget only download after the click.
const World = dynamic(() => import("./World"), {
  ssr: false,
  loading: () => <div className="world-loading">Loading 3D world… (~3 MB)</div>,
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
      {open && (
        <CanvasBoundary
          fallback={
            <div className="world-loading">
              <div className="world-message">
                <p>The island couldn&apos;t load on this device or network.</p>
                <button className="world-exit-inline" onClick={() => setOpen(false)}>← Back to lite site</button>
              </div>
            </div>
          }
        >
          <World onExit={() => setOpen(false)} />
        </CanvasBoundary>
      )}
    </>
  );
}
