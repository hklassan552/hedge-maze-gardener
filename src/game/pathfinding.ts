import { GRID } from '../constants/config';
import type { CellIndex, Terrain } from './types';

export const rowOf = (i: CellIndex) => Math.floor(i / GRID);
export const colOf = (i: CellIndex) => i % GRID;
export const idxOf = (r: number, c: number) => r * GRID + c;

/** Fixed tie-break order: up, right, down, left. */
const DELTAS: Array<[number, number]> = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

export function neighbours(i: CellIndex): CellIndex[] {
  const r = rowOf(i);
  const c = colOf(i);
  const out: CellIndex[] = [];
  for (let d = 0; d < DELTAS.length; d++) {
    const nr = r + DELTAS[d][0];
    const nc = c + DELTAS[d][1];
    if (nr >= 0 && nr < GRID && nc >= 0 && nc < GRID) {
      out.push(idxOf(nr, nc));
    }
  }
  return out;
}

function reconstruct(prev: Int8Array | Int16Array, from: CellIndex, to: CellIndex): CellIndex[] {
  const route: CellIndex[] = [];
  let cur: number = to;
  let guard = 0;
  while (cur !== -1 && guard++ < GRID * GRID + 2) {
    route.push(cur);
    if (cur === from) {
      break;
    }
    cur = prev[cur];
  }
  route.reverse();
  return route[0] === from ? route : [];
}

/**
 * Breadth-first search over currently open cells.
 * Neighbours are examined up, right, down, left; the first predecessor is kept,
 * which is the complete tie-break rule. Returns [] when no route exists.
 */
export function shortestRoute(open: boolean[], start: CellIndex, burrow: CellIndex): CellIndex[] {
  if (!open[start] || !open[burrow]) {
    return [];
  }
  const prev = new Int16Array(GRID * GRID).fill(-1);
  const seen = new Uint8Array(GRID * GRID);
  const queue: CellIndex[] = [start];
  seen[start] = 1;
  for (let head = 0; head < queue.length; head++) {
    const cur = queue[head];
    if (cur === burrow) {
      return reconstruct(prev, start, burrow);
    }
    const ns = neighbours(cur);
    for (let k = 0; k < ns.length; k++) {
      const n = ns[k];
      if (!seen[n] && open[n]) {
        seen[n] = 1;
        prev[n] = cur;
        queue.push(n);
      }
    }
  }
  return [];
}

export const openMapFrom = (terrain: Terrain[], trimmed: CellIndex[]): boolean[] => {
  const cut = new Set(trimmed);
  return terrain.map((t, i) => t === 'grass' || (t === 'hedge' && cut.has(i)));
};

export type Witness = { trims: number; route: CellIndex[] };

/**
 * Cheapest route when hedges may be cut: entering grass costs 0, entering a hedge
 * costs 1, stone is impassable. Minimises trims first, then route length, then the
 * fixed up/right/down/left neighbour order.
 */
export function cheapestWitness(terrain: Terrain[], start: CellIndex, burrow: CellIndex): Witness | null {
  const N = GRID * GRID;
  const INF = Number.MAX_SAFE_INTEGER;
  const cost = new Array<number>(N).fill(INF);
  const steps = new Array<number>(N).fill(INF);
  const prev = new Int16Array(N).fill(-1);
  const done = new Uint8Array(N);

  if (terrain[start] === 'stone' || terrain[burrow] === 'stone') {
    return null;
  }
  cost[start] = terrain[start] === 'hedge' ? 1 : 0;
  steps[start] = 0;

  for (let iter = 0; iter < N; iter++) {
    let best = -1;
    for (let i = 0; i < N; i++) {
      if (done[i] || cost[i] === INF) {
        continue;
      }
      if (best === -1 || cost[i] < cost[best] || (cost[i] === cost[best] && steps[i] < steps[best])) {
        best = i;
      }
    }
    if (best === -1) {
      break;
    }
    done[best] = 1;
    if (best === burrow) {
      break;
    }
    const ns = neighbours(best);
    for (let k = 0; k < ns.length; k++) {
      const n = ns[k];
      if (terrain[n] === 'stone' || done[n]) {
        continue;
      }
      const nc = cost[best] + (terrain[n] === 'hedge' ? 1 : 0);
      const nsSteps = steps[best] + 1;
      if (nc < cost[n] || (nc === cost[n] && nsSteps < steps[n])) {
        cost[n] = nc;
        steps[n] = nsSteps;
        prev[n] = best;
      }
    }
  }

  if (cost[burrow] === INF) {
    return null;
  }
  const route = reconstruct(prev, start, burrow);
  return route.length ? { trims: cost[burrow], route } : null;
}
