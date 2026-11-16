import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import { TRIM_MS } from '../constants/config';
import theme from '../constants/theme';
import type { Terrain } from '../game/types';

export type CellEntity = 'none' | 'hedgehog-start' | 'burrow' | 'flower';

/** One maze tile: grass, inflated topiary or stone, plus any resident entity. */
function MazeCell({
  terrain,
  trimmed,
  entity,
  tileSize,
  disabled,
  onRoute,
  flowerTaken,
  label,
  onPress,
}: {
  terrain: Terrain;
  trimmed: boolean;
  entity: CellEntity;
  tileSize: number;
  disabled: boolean;
  onRoute: boolean;
  flowerTaken: boolean;
  label: string;
  onPress: () => void;
}) {
  const hedgeLife = useRef(new Animated.Value(trimmed ? 0 : 1)).current;
  const flowerPop = useRef(new Animated.Value(1)).current;
  const open = terrain === 'grass' || trimmed;

  useEffect(() => {
    Animated.timing(hedgeLife, {
      toValue: trimmed ? 0 : 1,
      duration: TRIM_MS,
      useNativeDriver: true,
    }).start();
  }, [hedgeLife, trimmed]);

  useEffect(() => {
    if (!flowerTaken) {
      return;
    }
    Animated.sequence([
      Animated.timing(flowerPop, { toValue: 1.12, duration: 90, useNativeDriver: true }),
      Animated.timing(flowerPop, { toValue: 0, duration: 90, useNativeDriver: true }),
    ]).start();
  }, [flowerPop, flowerTaken]);

  const inner = tileSize - 6;
  const entitySize = Math.round(tileSize * 0.72);
  const flowerSize = Math.round(tileSize * 0.45);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.cell, { width: tileSize, height: tileSize }]}>
      <View
        style={[
          styles.base,
          { width: inner, height: inner },
          open ? styles.grass : null,
          onRoute ? styles.routeTint : null,
        ]}>
        {open ? <View style={styles.grassInset} pointerEvents="none" /> : null}
      </View>

      {terrain === 'stone' ? (
        <View style={[styles.stone, { width: inner, height: inner }]} pointerEvents="none">
          <View style={[styles.stoneBar, styles.stoneBarA]} />
          <View style={[styles.stoneBar, styles.stoneBarB]} />
        </View>
      ) : null}

      {terrain === 'hedge' ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.hedge,
            { width: inner, height: inner, opacity: hedgeLife, transform: [{ scale: hedgeLife }] },
          ]}>
          <LinearGradient
            colors={theme.gradients.hedge}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.hedgeFill}>
            <View style={styles.hedgeHighlight} />
            <Image source={assets.topiary} style={{ width: inner - 8, height: inner - 8, resizeMode: 'contain' }} />
          </LinearGradient>
        </Animated.View>
      ) : null}

      {entity === 'burrow' ? (
        <Image
          source={assets.burrow}
          style={{ width: entitySize, height: entitySize, resizeMode: 'contain' }}
        />
      ) : null}

      {entity === 'flower' ? (
        <Animated.Image
          source={assets.blossom}
          style={{
            width: flowerSize,
            height: flowerSize,
            resizeMode: 'contain',
            transform: [{ scale: flowerPop }],
          }}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  base: {
    position: 'absolute',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.garden.stone,
  },
  grass: {
    backgroundColor: theme.colors.bg.tertiary,
  },
  routeTint: {
    backgroundColor: '#357A45',
    borderWidth: 1,
    borderColor: theme.colors.garden.hedge,
  },
  grassInset: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 7,
    backgroundColor: 'rgba(64, 171, 42, 0.13)',
  },
  stone: {
    position: 'absolute',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(234, 240, 233, 0.40)',
  },
  stoneBar: {
    position: 'absolute',
    width: '66%',
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(234, 240, 233, 0.40)',
  },
  stoneBarA: { transform: [{ rotate: '45deg' }] },
  stoneBarB: { transform: [{ rotate: '-45deg' }] },
  hedge: {
    position: 'absolute',
    borderRadius: theme.radius.tile,
    overflow: 'hidden',
  },
  hedgeFill: {
    flex: 1,
    borderRadius: theme.radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#246218',
  },
  hedgeHighlight: {
    position: 'absolute',
    top: 3,
    left: 6,
    right: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(234, 240, 233, 0.22)',
  },
});

export default React.memo(MazeCell);
