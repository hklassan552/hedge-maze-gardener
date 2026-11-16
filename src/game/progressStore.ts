import type { CellIndex, Progress } from './types';

export type Preferences = {
  music: boolean;
  sound: boolean;
  reducedMotion: boolean;
};

export type SaveRecord = {
  schemaVersion: 1;
  progress: Progress;
  drafts: Record<number, CellIndex[]>;
  lastSelected: number;
  preferences: Preferences;
};

export const emptyProgress = (): Progress => ({
  bests: {},
  completed: [],
  unlocked: 1,
  totalPetals: 0,
});

export const defaultPreferences = (): Preferences => ({
  music: true,
  sound: true,
  reducedMotion: false,
});

const blank = (): SaveRecord => ({
  schemaVersion: 1,
  progress: emptyProgress(),
  drafts: {},
  lastSelected: 1,
  preferences: defaultPreferences(),
});

/**
 * Durable local storage adapter. The scaffold ships no persistence module and the
 * project may not add a storage dependency, so the record lives for the process
 * lifetime. The surface stays identical for a later SharedPreferences adapter.
 */
let record: SaveRecord = blank();

export const loadSave = (): SaveRecord => record;

export const writeSave = (next: SaveRecord): void => {
  record = next;
};

export const resetSave = (): SaveRecord => {
  const keptPreferences = record.preferences;
  record = { ...blank(), preferences: keptPreferences };
  return record;
};
