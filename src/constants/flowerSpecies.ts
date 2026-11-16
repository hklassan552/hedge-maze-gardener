export type FlowerShape =
  | 'daisy'
  | 'clover'
  | 'buttercup'
  | 'forgetmenot'
  | 'poppy'
  | 'violet'
  | 'iris'
  | 'rose'
  | 'sunflower'
  | 'bluebell';

export type FlowerSpecies = {
  id: FlowerShape;
  name: string;
  threshold: number;
  petal: string;
  centre: string;
  shape: string;
};

/** Thresholds are lifetime credited petals. Unlocks are permanent and automatic. */
export const FLOWER_SPECIES: FlowerSpecies[] = [
  { id: 'daisy', name: 'Daisy', threshold: 10, petal: '#F4F7F0', centre: '#FFD95A', shape: 'Eight rounded petals' },
  { id: 'clover', name: 'Clover', threshold: 40, petal: '#7FD16A', centre: '#F2B6FF', shape: 'Three heart leaves' },
  { id: 'buttercup', name: 'Buttercup', threshold: 90, petal: '#FFD95A', centre: '#F0A52E', shape: 'Five cupped petals' },
  { id: 'forgetmenot', name: 'Forget-me-not', threshold: 160, petal: '#9CC7F2', centre: '#FFE98A', shape: 'Five petals, ring centre' },
  { id: 'poppy', name: 'Poppy', threshold: 260, petal: '#F26B6B', centre: '#2A1410', shape: 'Four broad petals' },
  { id: 'violet', name: 'Violet', threshold: 400, petal: '#C08CF0', centre: '#FFE98A', shape: 'Two upper, three lower' },
  { id: 'iris', name: 'Iris', threshold: 600, petal: '#8C7BF0', centre: '#FFD95A', shape: 'Three up, three falling' },
  { id: 'rose', name: 'Rose', threshold: 850, petal: '#F27CA8', centre: '#C0407A', shape: 'Concentric petal layers' },
  { id: 'sunflower', name: 'Sunflower', threshold: 1150, petal: '#FFC53D', centre: '#5C3A14', shape: 'Twelve narrow petals' },
  { id: 'bluebell', name: 'Bluebell', threshold: 1500, petal: '#7FA8F0', centre: '#3C5CA8', shape: 'Three hanging bells' },
];

export const unlockedSpecies = (totalPetals: number): FlowerSpecies[] =>
  FLOWER_SPECIES.filter(s => totalPetals >= s.threshold);

export const unlockedCount = (totalPetals: number): number =>
  FLOWER_SPECIES.reduce((n, s) => (totalPetals >= s.threshold ? n + 1 : n), 0);

export const nextSpecies = (totalPetals: number): FlowerSpecies | null =>
  FLOWER_SPECIES.find(s => totalPetals < s.threshold) || null;

/** Species newly crossed when the lifetime total moves from `before` to `after`. */
export const speciesCrossed = (before: number, after: number): FlowerSpecies[] =>
  FLOWER_SPECIES.filter(s => before < s.threshold && after >= s.threshold);
