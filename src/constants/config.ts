import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const SCREEN_WIDTH = SCREEN_W;
export const SCREEN_HEIGHT = SCREEN_H;

/** Compact arrangement for 320x640dp class devices. */
export const IS_COMPACT = SCREEN_W < 340 || SCREEN_H < 680;

/** Branded splash duration. Must stay at 8000 — shorter values race the UI capture. */
export const LOADER_DURATION_MS = 8000;

/** Maze geometry — see rules #4 / #5. */
export const GRID = 5;
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 8
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const TILE = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / GRID);
export const BOARD_W = TILE * GRID + 2 * BOARD_FRAME;

/** Header geometry. */
export const HEADER_TOP_PAD = 44;
export const HEADER_ROW_H = 56;
export const STATUS_ROW_H = 20;

/** Catalogue. */
export const GARDEN_COUNT = 100;
export const CHAPTER_SIZE = 10;
export const CHAPTER_COUNT = GARDEN_COUNT / CHAPTER_SIZE;
export const FLOWERS_PER_GARDEN = 3;

/** Scoring. */
export const SCORE_BASE = 10;
export const SCORE_PER_FLOWER = 5;
export const SCORE_PER_TRIM_LEFT = 2;

/** Animation timings (ms). */
export const WALK_STEP_MS = 220;
export const TRIM_MS = 180;
export const ARRIVAL_MS = 180;
export const CROSSFADE_MS = 220;
export const COUNT_UP_MS = 250;

export const CHAPTER_NAMES = [
  'Gate Meadow',
  'Daisy Turn',
  'Clover Corner',
  'Fern Lane',
  'Rose Walk',
  'Iris Court',
  'Poppy Terrace',
  'Violet Hollow',
  'Sunflower Rise',
  'Home Garden',
];

export const pad2 = (n: number) => (n < 10 ? '0' + n : String(n));
