"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Kampala",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Kampala",
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function LocalTime() {
  const [t, setT] = useState("");
  const [d, setD] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setT(fmt.format(now));
      setD(dateFmt.format(now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const [h, m] = t ? t.split(":") : ["--", "--"];
  return (
    <div suppressHydrationWarning>
      <time>{h}<span className="colon">:</span>{m} EAT</time>
      <br />
      <span className="date">{d}</span>
    </div>
  );
}
