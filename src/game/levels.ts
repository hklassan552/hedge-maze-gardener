import { CHAPTER_SIZE, GARDEN_COUNT, GRID } from '../constants/config';
import { cheapestWitness, idxOf, shortestRoute } from './pathfinding';
import type { CellIndex, Level, Terrain } from './types';

const N = GRID * GRID;
const MAX_CANDIDATES = 4096;

/** 32-bit linear congruential generator, seeded per garden + candidate index. */
function makeRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const terrainKey = (t: Terrain[]) => t.map(c => (c === 'grass' ? '.' : c === 'hedge' ? '#' : 'X')).join('');

const openGrassOnly = (t: Terrain[]) => t.map(c => c === 'grass');
const openCuttable = (t: Terrain[]) => t.map(c => c !== 'stone');

const chapterOf = (id: number) => Math.ceil(id / CHAPTER_SIZE);

function requiredRange(chapter: number): [number, number] {
  if (chapter <= 3) {
    return [1, 2];
  }
  if (chapter <= 7) {
    return [2, 3];
  }
  return [2, 4];
}

/**
 * Three flowers on the first, middle and last distinct non-endpoint grass cells of
 * the witness route. Returns null when the route offers fewer than three.
 */
function flowersOn(route: CellIndex[], terrain: Terrain[], start: CellIndex, burrow: CellIndex): CellIndex[] | null {
  const candidates = route.filter(c => c !== start && c !== burrow && terrain[c] === 'grass');
  if (candidates.length < 3) {
    return null;
  }
  const first = candidates[0];
  const last = candidates[candidates.length - 1];
  const middle = candidates[Math.floor(candidates.length / 2)];
  const unique = Array.from(new Set([first, middle, last]));
  return unique.length === 3 ? [first, middle, last] : null;
}

/** Authored opening garden. Cutting (2,4) opens an eight-step edge route past all three flowers. */
function garden1(): Level {
  const rows = ['S....', '.###.', '#####', '.#.#.', '....B'];
  const terrain: Terrain[] = [];
  rows.forEach(row => {
    for (let c = 0; c < GRID; c++) {
      terrain.push(row[c] === '#' ? 'hedge' : 'grass');
    }
  });
  return {
    id: 1,
    chapter: 1,
    terrain,
    start: idxOf(0, 0),
    burrow: idxOf(4, 4),
    flowers: [idxOf(0, 2), idxOf(1, 4), idxOf(3, 4)],
    allowance: 2,
  };
}

/** Deterministic fallback: five hedges barring row 2, extra hedges encoding the garden id. */
function fallbackGarden(id: number): Level {
  const terrain: Terrain[] = new Array(N).fill('grass');
  for (let c = 0; c < GRID; c++) {
    terrain[idxOf(2, c)] = 'hedge';
  }
  const bitCells: CellIndex[] = [idxOf(0, 0), idxOf(0, 1), idxOf(0, 2), idxOf(1, 0), idxOf(1, 2), idxOf(3, 1), idxOf(4, 3)];
  for (let b = 0; b < bitCells.length; b++) {
    if ((id >> b) & 1) {
      terrain[bitCells[b]] = 'hedge';
    }
  }
  const start = idxOf(0, 4);
  const burrow = idxOf(4, 0);
  terrain[start] = 'grass';
  terrain[burrow] = 'grass';
  const witness = cheapestWitness(terrain, start, burrow);
  const route = witness ? witness.route : [];
  const flowers = flowersOn(route, terrain, start, burrow) || [idxOf(1, 4), idxOf(3, 3), idxOf(3, 4)];
  return {
    id,
    chapter: chapterOf(id),
    terrain,
    start,
    burrow,
    flowers,
    allowance: witness ? Math.max(1, witness.trims) : 1,
  };
}

function buildCandidate(id: number, candidate: number): Terrain[] {
  const chapter = chapterOf(id);
  const stoneP = 0.04 + 0.01 * (chapter - 1);
  const hedgeP = 0.4 + 0.015 * (chapter - 1);
  const rng = makeRng((7919 * id + 104729 * candidate) >>> 0);
  const terrain: Terrain[] = new Array(N);
  for (let i = 0; i < N; i++) {
    const draw = rng();
    terrain[i] = draw < stoneP ? 'stone' : draw < stoneP + hedgeP ? 'hedge' : 'grass';
  }
  terrain[idxOf(0, 0)] = 'grass';
  terrain[idxOf(4, 4)] = 'grass';
  return terrain;
}

function generateGarden(id: number, used: Set<string>): Level {
  const chapter = chapterOf(id);
  const [kMin, kMax] = requiredRange(chapter);
  const start = idxOf(0, 0);
  const burrow = idxOf(4, 4);

  for (let candidate = 1; candidate <= MAX_CANDIDATES; candidate++) {
    const terrain = buildCandidate(id, candidate);
    const key = terrainKey(terrain);
    if (used.has(key)) {
      continue;
    }
    let grass = 0;
    let hedge = 0;
    for (let i = 0; i < N; i++) {
      if (terrain[i] === 'grass') {
        grass++;
      } else if (terrain[i] === 'hedge') {
        hedge++;
      }
    }
    if (grass < 7 || hedge < 5) {
      continue;
    }
    if (!shortestRoute(openCuttable(terrain), start, burrow).length) {
      continue;
    }
    if (shortestRoute(openGrassOnly(terrain), start, burrow).length) {
      continue; // an already-open route would make trimming pointless
    }
    const witness = cheapestWitness(terrain, start, burrow);
    if (!witness || witness.trims < kMin || witness.trims > kMax) {
      continue;
    }
    const flowers = flowersOn(witness.route, terrain, start, burrow);
    if (!flowers) {
      continue;
    }
    used.add(key);
    return {
      id,
      chapter,
      terrain,
      start,
      burrow,
      flowers,
      allowance: id <= 20 ? witness.trims + 1 : witness.trims,
    };
  }

  const fallback = fallbackGarden(id);
  used.add(terrainKey(fallback.terrain));
  return fallback;
}

function buildCatalogue(): Level[] {
  const used = new Set<string>();
  const first = garden1();
  used.add(terrainKey(first.terrain));
  const levels: Level[] = [first];
  for (let id = 2; id <= GARDEN_COUNT; id++) {
    levels.push(generateGarden(id, used));
  }
  return levels;
}

let catalogue: Level[] | null = null;

export function getCatalogue(): Level[] {
  if (!catalogue) {
    catalogue = buildCatalogue();
  }
  return catalogue;
}

export function getLevel(id: number): Level {
  const list = getCatalogue();
  const clamped = Math.min(Math.max(1, id), GARDEN_COUNT);
  return list[clamped - 1];
}

export const chapterIndexOf = (id: number) => Math.floor((id - 1) / CHAPTER_SIZE);
export const chapterGardenIds = (chapterIndex: number) =>
  Array.from({ length: CHAPTER_SIZE }, (_, i) => chapterIndex * CHAPTER_SIZE + i + 1);
