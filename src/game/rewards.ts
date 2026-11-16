import { SCORE_BASE, SCORE_PER_FLOWER, SCORE_PER_TRIM_LEFT } from '../constants/config';

/** Successful round score. A blocked route always scores 0. */
export const roundScore = (flowersCrossed: number, trimsLeft: number): number =>
  SCORE_BASE + SCORE_PER_FLOWER * flowersCrossed + SCORE_PER_TRIM_LEFT * trimsLeft;

/** Only an improvement over this garden's saved best is credited. */
export const creditedDelta = (score: number, previousBest: number): number =>
  Math.max(0, score - previousBest);
