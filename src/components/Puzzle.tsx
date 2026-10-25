"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const N = 3;
const MY_BEST = 34; // Aaron's own record, the number to beat
const HELP_AFTER = 100; // moves before the auto-solve option appears
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

// Shortest solution as the list of positions the gap moves through (IDA* with Manhattan distance, a few ms for 3x3).
function solve(start: number[]): number[] {
  const goal = TOTAL - 1;
  const dist = (t: number[]) => {
    let d = 0;
    t.forEach((v, i) => {
      if (v === goal) return;
      d += Math.abs(Math.floor(v / N) - Math.floor(i / N)) + Math.abs((v % N) - (i % N));
    });
    return d;
  };
  const board = [...start];
  const path: number[] = [];
  const search = (gap: number, g: number, limit: number, prev: number): number => {
    const f = g + dist(board);
    if (f > limit) return f;
    if (dist(board) === 0) return -1;
    let min = Infinity;
    for (const next of neighbours(gap)) {
      if (next === prev) continue;
      [board[gap], board[next]] = [board[next], board[gap]];
      path.push(next);
      const r = search(next, g + 1, limit, gap);
      if (r === -1) return -1;
      path.pop();
      [board[gap], board[next]] = [board[next], board[gap]];
      if (r < min) min = r;
    }
    return min;
  };
  let limit = dist(board);
  const gap0 = board.indexOf(goal);
  for (let i = 0; i < 40; i++) {
    const r = search(gap0, 0, limit, -1);
    if (r === -1) return path;
    limit = r;
  }
  return [];
}

function verdict(moves: number, helped: boolean) {
  if (helped) return `Solved for you. I did it in ${MY_BEST} moves. Your turn?`;
  if (moves < MY_BEST) return `${moves} moves. You beat my ${MY_BEST}. I'm impressed.`;
  if (moves === MY_BEST) return `${moves} moves, same as my best. Respect.`;
  return `Solved in ${moves}. I did it in ${MY_BEST}. Beat that?`;
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
  const [auto, setAuto] = useState(false);
  const [helped, setHelped] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const stopAuto = () => {
    clearInterval(timer.current);
    setAuto(false);
  };

  const shuffle = useCallback(() => {
    clearInterval(timer.current);
    setAuto(false);
    setHelped(false);
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

  useEffect(() => () => clearInterval(timer.current), []);

  // after a long struggle, offer to finish the puzzle: play the shortest solution one slide at a time
  const autoSolve = () => {
    const steps = solve(tiles);
    if (!steps.length) return;
    setAuto(true);
    setHelped(true);
    let i = 0;
    timer.current = setInterval(() => {
      const next = steps[i++];
      setTiles((prev) => {
        const g = prev.indexOf(TOTAL - 1);
        const t = [...prev];
        [t[g], t[next]] = [t[next], t[g]];
        return t;
      });
      setMoves((m) => m + 1);
      if (i >= steps.length) stopAuto();
    }, 230);
  };

  const move = (pos: number) => {
    if (solved || auto || !neighbours(gap).includes(pos)) return;
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
            <span>{verdict(moves, helped)}</span>
            <button type="button" onClick={shuffle}>Again ↻︎</button>
          </>
        ) : (
          <>
            <span>{auto ? "Solving…" : `Solve me${moves ? ` · ${moves}` : ""}`}</span>
            <span className="pz-actions">
              {moves >= HELP_AFTER && !auto && <button type="button" onClick={autoSolve}>Auto-solve ✦</button>}
              <button type="button" onClick={shuffle}>Shuffle ↻︎</button>
            </span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
