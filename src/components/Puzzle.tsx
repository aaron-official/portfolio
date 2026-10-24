"use client";

import { useCallback, useEffect, useState } from "react";

const N = 3;
const TOTAL = N * N;
const SOLVED = Array.from({ length: TOTAL }, (_, i) => i); // value TOTAL-1 is the gap

function neighbours(gap: number) {
  const r = Math.floor(gap / N);
  const c = gap % N;
  const out: number[] = [];
  if (r > 0) out.push(gap - N);
  if (r < N - 1) out.push(gap + N);
  if (c > 0) out.push(gap - 1);
  if (c < N - 1) out.push(gap + 1);
  return out;
}

// shuffle by making random legal moves, so the result is always solvable
function shuffled(): number[] {
  const t = [...SOLVED];
  let gap = TOTAL - 1;
  let prev = -1;
  for (let i = 0; i < 80; i++) {
    const opts = neighbours(gap).filter((n) => n !== prev);
    const next = opts[Math.floor(Math.random() * opts.length)];
    [t[gap], t[next]] = [t[next], t[gap]];
    prev = gap;
    gap = next;
  }
  return t.every((v, i) => v === i) ? shuffled() : t;
}

export function Puzzle({ className }: { className?: string }) {
  const [tiles, setTiles] = useState<number[]>(SOLVED);
  const [ready, setReady] = useState(false);
  const [moves, setMoves] = useState(0);

  const shuffle = useCallback(() => {
    setTiles(shuffled());
    setMoves(0);
  }, []);

  useEffect(() => {
    shuffle();
    setReady(true);
    new Image().src = "/headshot-color.webp"; // warm the cache for the reveal
  }, [shuffle]);

  const gap = tiles.indexOf(TOTAL - 1);
  const solved = ready && tiles.every((v, i) => v === i);

  const move = (pos: number) => {
    if (solved || !neighbours(gap).includes(pos)) return;
    const t = [...tiles];
    [t[gap], t[pos]] = [t[pos], t[gap]];
    setTiles(t);
    setMoves((m) => m + 1);
  };

  return (
    <figure className={className}>
      <div className={`pz-board${solved ? " is-solved" : ""}`} role="group" aria-label="Sliding puzzle of Aaron's portrait">
        {tiles.map((v, pos) => {
          if (v === TOTAL - 1 && !solved) return null;
          const x = (v % N) * (100 / (N - 1));
          const y = Math.floor(v / N) * (100 / (N - 1));
          return (
            <button
              key={v}
              type="button"
              className="pz-tile"
              style={{
                left: `${(pos % N) * (100 / N)}%`,
                top: `${Math.floor(pos / N) * (100 / N)}%`,
                backgroundPosition: `${x}% ${y}%`,
              }}
              onClick={() => move(pos)}
              aria-label={`Tile ${v + 1}`}
              tabIndex={solved ? -1 : 0}
            />
          );
        })}
      </div>
      <figcaption className="mono pz-cap" aria-live="polite">
        {solved ? (
          <>
            <span>Solved in {moves} moves. Hi, I&apos;m Aaron.</span>
            <button type="button" onClick={shuffle}>Again ↻</button>
          </>
        ) : (
          <>
            <span>Solve me{moves ? ` · ${moves}` : ""}</span>
            <button type="button" onClick={shuffle}>Shuffle ↻</button>
          </>
        )}
      </figcaption>
    </figure>
  );
}
