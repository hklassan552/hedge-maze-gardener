export type Terrain = 'grass' | 'hedge' | 'stone';

/** Cells are addressed by index = row * 5 + col (zero-based). */
export type CellIndex = number;

export type Level = {
  id: number;
  chapter: number;
  terrain: Terrain[]; // 25 entries
  start: CellIndex;
  burrow: CellIndex;
  flowers: CellIndex[]; // exactly 3
  allowance: number;
};

export type Outcome = 'success' | 'blocked';

export type RoundResult = {
  gardenId: number;
  outcome: Outcome;
  roundScore: number;
  creditedDelta: number;
  previousBest: number;
  flowersCrossed: number;
  trimsLeft: number;
  newSpecies: string[];
  unlockedNext: number | null;
};

export type WalkPlan = {
  gardenId: number;
  attemptId: string;
  route: CellIndex[];
  flowerCells: CellIndex[]; // flowers that lie on the route
  trimsLeft: number;
};

export type Progress = {
  bests: Record<number, number>;
  completed: number[];
  unlocked: number;
  totalPetals: number;
};
