import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type BackgroundVariant = 'loader' | 'menu' | 'game' | 'walk' | 'result' | 'support';

type Config = { colors: string[]; opacity: number; locations?: number[] };

const VARIANTS: Record<BackgroundVariant, Config> = {
  loader: { colors: theme.gradients.loader, opacity: 0.9 },
  menu: { colors: theme.gradients.menu, opacity: 0.68 },
  game: { colors: theme.gradients.game, opacity: 0.86 },
  walk: { colors: theme.gradients.walk, opacity: 0.88 },
  result: { colors: theme.gradients.result, opacity: 0.78 },
  support: { colors: theme.gradients.menu, opacity: 0.9 },
};

/**
 * The single shared artwork plus a per-screen gradient and a quiet leaf layer.
 * Screens are told apart by the overlay, never by a different image.
 */
function GardenBackground({
  variant,
  children,
}: {
  variant: BackgroundVariant;
  children: React.ReactNode;
}) {
  const config = VARIANTS[variant];
  const diagonal = variant === 'menu' || variant === 'result';

  return (
    <ImageBackground source={assets.bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={config.colors}
        start={diagonal ? { x: 0, y: 0 } : { x: 0.5, y: 0 }}
        end={diagonal ? { x: 1, y: 1 } : { x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: config.opacity }]}
      />
      {variant === 'loader' ? (
        <View style={styles.loaderVeil} pointerEvents="none" />
      ) : null}
      <View style={styles.leafLayer} pointerEvents="none">
        <View style={[styles.leaf, styles.leafTopLeft]} />
        <View style={[styles.leaf, styles.leafTopRight]} />
        <View style={[styles.leaf, styles.leafBottomLeft]} />
        <View style={[styles.leaf, styles.leafBottomRight]} />
      </View>
      {variant === 'walk' ? <View style={styles.walkGlow} pointerEvents="none" /> : null}
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  content: {
    flex: 1,
  },
  loaderVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.bg.primary,
    opacity: 0.88,
  },
  leafLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  leaf: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: theme.colors.garden.hedge,
    opacity: 0.05,
  },
  leafTopLeft: { top: -70, left: -60 },
  leafTopRight: { top: 90, right: -90 },
  leafBottomLeft: { bottom: 120, left: -100 },
  leafBottomRight: { bottom: -80, right: -50 },
  walkGlow: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.garden.leaf,
    opacity: 0.08,
  },
});

export default React.memo(GardenBackground);
