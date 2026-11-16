import React, { useCallback } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import assets from '../assets';
import { BOARD_BORDER, BOARD_PAD, BOARD_W, GRID, TILE } from '../constants/config';
import theme from '../constants/theme';
import { colOf, rowOf } from '../game/pathfinding';
import type { CellIndex, Level } from '../game/types';
import MazeCell from './MazeCell';
import type { CellEntity } from './MazeCell';

export const cellOffset = (cell: CellIndex) => ({
  x: colOf(cell) * TILE,
  y: rowOf(cell) * TILE,
});

/** Measured 5x5 surface. Outer size follows BOARD_FRAME so tiles never overhang. */
function MazeBoard({
  level,
  trimmed,
  mode,
  route,
  revealed,
  takenFlowers,
  walkerTranslate,
  onCellPress,
}: {
  level: Level;
  trimmed: CellIndex[];
  mode: 'edit' | 'walk';
  route: CellIndex[];
  revealed: number;
  takenFlowers: CellIndex[];
  walkerTranslate?: Animated.ValueXY;
  onCellPress?: (cell: CellIndex) => void;
}) {
  const handlePress = useCallback(
    (cell: CellIndex) => {
      if (onCellPress) {
        onCellPress(cell);
      }
    },
    [onCellPress],
  );

  const staticOffset = cellOffset(level.start);
  const walkerSize = Math.round(TILE * 0.72);
  const walkerPad = Math.round((TILE - walkerSize) / 2);

  const cells = [];
  for (let i = 0; i < GRID * GRID; i++) {
    const terrain = level.terrain[i];
    const isTrimmed = trimmed.indexOf(i) !== -1;
    const isFlower = level.flowers.indexOf(i) !== -1;
    let entity: CellEntity = 'none';
    if (i === level.burrow) {
      entity = 'burrow';
    } else if (isFlower) {
      entity = 'flower';
    }
    const onRoute = mode === 'walk' && route.slice(0, revealed + 1).indexOf(i) !== -1;
    const terrainWord = terrain === 'hedge' && !isTrimmed ? 'hedge' : terrain === 'stone' ? 'stone' : 'open path';
    cells.push(
      <MazeCell
        key={i}
        terrain={terrain}
        trimmed={isTrimmed}
        entity={entity}
        tileSize={TILE}
        disabled={mode !== 'edit'}
        onRoute={onRoute}
        flowerTaken={takenFlowers.indexOf(i) !== -1}
        label={'Row ' + (rowOf(i) + 1) + ', column ' + (colOf(i) + 1) + ', ' + terrainWord}
        onPress={() => handlePress(i)}
      />,
    );
  }

  return (
    <View style={styles.frame}>
      <View style={styles.grid}>{cells}</View>

      {mode === 'walk' ? (
        <View style={styles.overlay} pointerEvents="none">
          {route.slice(0, revealed + 1).map(cell => {
            const off = cellOffset(cell);
            return (
              <View
                key={'dot' + cell}
                style={[
                  styles.routeDot,
                  { left: off.x + TILE / 2 - 3, top: off.y + TILE / 2 - 3 },
                ]}
              />
            );
          })}
        </View>
      ) : null}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.walker,
          {
            width: walkerSize,
            height: walkerSize,
            transform: walkerTranslate
              ? [{ translateX: walkerTranslate.x }, { translateY: walkerTranslate.y }]
              : [{ translateX: staticOffset.x + walkerPad }, { translateY: staticOffset.y + walkerPad }],
          },
        ]}>
        <Image source={assets.hedgehog} style={styles.walkerImage} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: BOARD_W,
    height: BOARD_W,
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.ui.borderStrong,
    borderRadius: theme.radius.panel,
    backgroundColor: 'rgba(19, 34, 16, 0.72)',
    ...theme.shadows.panel,
  },
  grid: {
    width: TILE * GRID,
    height: TILE * GRID,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  overlay: {
    position: 'absolute',
    left: BOARD_PAD + BOARD_BORDER,
    top: BOARD_PAD + BOARD_BORDER,
    width: TILE * GRID,
    height: TILE * GRID,
  },
  routeDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.text.primary,
    opacity: 0.85,
  },
  walker: {
    position: 'absolute',
    left: BOARD_PAD + BOARD_BORDER,
    top: BOARD_PAD + BOARD_BORDER,
  },
  walkerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default MazeBoard;
