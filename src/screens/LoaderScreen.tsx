import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import { LOADER_DURATION_MS } from '../constants/config';
import theme from '../constants/theme';
import GardenBackground from '../components/GardenBackground';

const BAR_W = 208;

/**
 * Branded splash. Deliberately darker than Garden Gate and free of chips,
 * garden tiles and the main call-to-action so the two screens never look alike.
 */
function LoaderScreen({ onFinish }: { onFinish: () => void }) {
  const logoIn = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoIn, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(titleIn, {
        toValue: 1,
        delay: 100,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: LOADER_DURATION_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onFinish, LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [logoIn, onFinish, progress, titleIn]);

  return (
    <GardenBackground variant="loader">
      <View style={styles.root}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.plaque,
            {
              opacity: logoIn,
              transform: [
                { scale: logoIn.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
              ],
            },
          ]}>
          <Image source={assets.logo} style={styles.logo} />
        </Animated.View>

        <Animated.View style={[styles.titleBlock, { opacity: titleIn }]} pointerEvents="none">
          <Text style={styles.title}>Hedge Maze</Text>
          <Text style={styles.title}>Gardener</Text>
          <Text style={styles.subtitle}>A little trim. A safe way home.</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                transform: [
                  { translateX: -BAR_W / 2 },
                  { scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [0.02, 1] }) },
                  { translateX: BAR_W / 2 },
                ],
              },
            ]}
          />
        </View>
        <Text style={styles.loading}>LOADING...</Text>
      </View>
    </GardenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  plaque: {
    width: 248,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.panel,
  },
  logo: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
  },
  titleBlock: {
    marginTop: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  barTrack: {
    marginTop: 40,
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.bg.tertiary,
    overflow: 'hidden',
  },
  barFill: {
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.garden.hedge,
  },
  loading: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
});

export default LoaderScreen;
