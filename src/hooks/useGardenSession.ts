import { useCallback, useEffect, useMemo, useState } from 'react';
import { getLevel } from '../game/levels';
import { openMapFrom, shortestRoute } from '../game/pathfinding';
import type { CellIndex, Level, WalkPlan } from '../game/types';

export type TapFeedback = 'none' | 'stone' | 'no-trims' | 'open';

export type Session = {
  level: Level;
  trimmed: CellIndex[];
  trimsLeft: number;
  canUndo: boolean;
  feedback: TapFeedback;
  statusText: string;
  trim: (cell: CellIndex) => void;
  undo: () => void;
  reset: () => void;
  plan: () => WalkPlan;
};

/** Editing state for one garden: trim history, allowance and the GO snapshot. */
export function useGardenSession(gardenId: number, initialTrimmed: CellIndex[]): Session {
  const level = useMemo(() => getLevel(gardenId), [gardenId]);
  const [trimmed, setTrimmed] = useState<CellIndex[]>(initialTrimmed);
  const [feedback, setFeedback] = useState<TapFeedback>('none');

  useEffect(() => {
    setTrimmed(initialTrimmed);
    setFeedback('none');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  useEffect(() => {
    if (feedback === 'none') {
      return;
    }
    const timer = setTimeout(() => setFeedback('none'), 1400);
    return () => clearTimeout(timer);
  }, [feedback]);

  const trimsLeft = Math.max(0, level.allowance - trimmed.length);

  const trim = useCallback(
    (cell: CellIndex) => {
      const terrain = level.terrain[cell];
      if (terrain === 'stone') {
        setFeedback('stone');
        return;
      }
      if (terrain === 'grass') {
        setFeedback('open');
        return;
      }
      setTrimmed(prev => {
        if (prev.indexOf(cell) !== -1) {
          return prev;
        }
        if (level.allowance - prev.length <= 0) {
          setFeedback('no-trims');
          return prev;
        }
        return prev.concat(cell);
      });
    },
    [level],
  );

  const undo = useCallback(() => {
    setTrimmed(prev => (prev.length ? prev.slice(0, prev.length - 1) : prev));
  }, []);

  const reset = useCallback(() => {
    setTrimmed([]);
    setFeedback('none');
  }, []);

  const plan = useCallback((): WalkPlan => {
    const route = shortestRoute(openMapFrom(level.terrain, trimmed), level.start, level.burrow);
    return {
      gardenId: level.id,
      attemptId: String(Date.now()) + '-' + trimmed.length,
      route,
      flowerCells: level.flowers.filter(f => route.indexOf(f) !== -1),
      trimsLeft: Math.max(0, level.allowance - trimmed.length),
    };
  }, [level, trimmed]);

  let statusText = 'Trim hedges, then tap GO.';
  if (feedback === 'stone') {
    statusText = 'Stone stays put.';
  } else if (feedback === 'no-trims') {
    statusText = 'No trims left. Undo or try GO.';
  } else if (feedback === 'open') {
    statusText = 'That path is already open.';
  } else if (trimmed.length > 0) {
    statusText = 'Tap GO to try the open paths.';
  }

  return {
    level,
    trimmed,
    trimsLeft,
    canUndo: trimmed.length > 0,
    feedback,
    statusText,
    trim,
    undo,
    reset,
    plan,
  };
}
