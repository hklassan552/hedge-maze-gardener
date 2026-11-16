import { useCallback, useRef, useState } from 'react';
import { GARDEN_COUNT } from '../constants/config';
import { speciesCrossed } from '../constants/flowerSpecies';
import { creditedDelta, roundScore } from '../game/rewards';
import {
  defaultPreferences,
  emptyProgress,
  loadSave,
  resetSave,
  writeSave,
} from '../game/progressStore';
import type { Preferences } from '../game/progressStore';
import type { CellIndex, Progress, RoundResult } from '../game/types';

export type CommitInput = {
  gardenId: number;
  attemptId: string;
  flowersCrossed: number;
  trimsLeft: number;
};

export function useGardenProgress() {
  const saved = loadSave();
  const [progress, setProgress] = useState<Progress>(saved.progress);
  const [drafts, setDrafts] = useState<Record<number, CellIndex[]>>(saved.drafts);
  const [preferences, setPreferences] = useState<Preferences>(saved.preferences);
  const committedAttempts = useRef<Set<string>>(new Set());

  const persist = useCallback(
    (
      nextProgress: Progress,
      nextDrafts: Record<number, CellIndex[]>,
      nextPrefs: Preferences,
      lastSelected: number,
    ) => {
      writeSave({
        schemaVersion: 1,
        progress: nextProgress,
        drafts: nextDrafts,
        lastSelected,
        preferences: nextPrefs,
      });
    },
    [],
  );

  const saveDraft = useCallback(
    (gardenId: number, trimmed: CellIndex[]) => {
      setDrafts(prev => {
        const next = { ...prev, [gardenId]: trimmed };
        persist(progress, next, preferences, gardenId);
        return next;
      });
    },
    [persist, preferences, progress],
  );

  const clearDraft = useCallback(
    (gardenId: number) => {
      setDrafts(prev => {
        const next = { ...prev };
        delete next[gardenId];
        persist(progress, next, preferences, gardenId);
        return next;
      });
    },
    [persist, preferences, progress],
  );

  /** One reward transaction per garden id + attempt id, however often it is called. */
  const commitSuccess = useCallback(
    (input: CommitInput): RoundResult => {
      const { gardenId, attemptId, flowersCrossed, trimsLeft } = input;
      const key = gardenId + ':' + attemptId;
      const previousBest = progress.bests[gardenId] || 0;
      const score = roundScore(flowersCrossed, trimsLeft);
      const delta = creditedDelta(score, previousBest);
      const unlockedNext = gardenId < GARDEN_COUNT ? gardenId + 1 : null;

      if (committedAttempts.current.has(key)) {
        return {
          gardenId,
          outcome: 'success',
          roundScore: score,
          creditedDelta: 0,
          previousBest,
          flowersCrossed,
          trimsLeft,
          newSpecies: [],
          unlockedNext,
        };
      }
      committedAttempts.current.add(key);

      const totalBefore = progress.totalPetals;
      const totalAfter = totalBefore + delta;
      const nextProgress: Progress = {
        bests: { ...progress.bests, [gardenId]: Math.max(previousBest, score) },
        completed: progress.completed.indexOf(gardenId) !== -1
          ? progress.completed
          : progress.completed.concat(gardenId),
        unlocked: Math.min(GARDEN_COUNT, Math.max(progress.unlocked, gardenId + 1)),
        totalPetals: totalAfter,
      };
      const nextDrafts = { ...drafts };
      delete nextDrafts[gardenId];

      setProgress(nextProgress);
      setDrafts(nextDrafts);
      persist(nextProgress, nextDrafts, preferences, gardenId);

      return {
        gardenId,
        outcome: 'success',
        roundScore: score,
        creditedDelta: delta,
        previousBest,
        flowersCrossed,
        trimsLeft,
        newSpecies: speciesCrossed(totalBefore, totalAfter).map(s => s.name),
        unlockedNext,
      };
    },
    [drafts, persist, preferences, progress],
  );

  const updatePreferences = useCallback(
    (patch: Partial<Preferences>) => {
      setPreferences(prev => {
        const next = { ...prev, ...patch };
        persist(progress, drafts, next, 1);
        return next;
      });
    },
    [drafts, persist, progress],
  );

  const resetProgress = useCallback(() => {
    const next = resetSave();
    committedAttempts.current = new Set();
    setProgress(next.progress || emptyProgress());
    setDrafts({});
    setPreferences(next.preferences || defaultPreferences());
  }, []);

  return {
    progress,
    drafts,
    preferences,
    saveDraft,
    clearDraft,
    commitSuccess,
    updatePreferences,
    resetProgress,
  };
}
