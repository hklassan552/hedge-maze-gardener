import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';

const SPREAD = [-96, -64, -32, -8, 12, 40, 68, 96];

/** Eight soft petals over 500ms. Transform and opacity only, so it stays on the GPU. */
function PetalCelebration({ active, reducedMotion }: { active: boolean; reducedMotion?: boolean }) {
  const drivers = useRef(SPREAD.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!active || reducedMotion) {
      return;
    }
    const animations = drivers.map((value, i) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 500,
        delay: i * 40,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    );
    drivers.forEach(value => value.setValue(0));
    const group = Animated.parallel(animations);
    group.start();
    return () => group.stop();
  }, [active, drivers, reducedMotion]);

  if (!active || reducedMotion) {
    return null;
  }

  return (
    <View style={styles.layer} pointerEvents="none">
      {drivers.map((value, i) => (
        <Animated.View
          key={i}
          style={[
            styles.petal,
            {
              opacity: value.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.9, 0] }),
              transform: [
                { translateX: SPREAD[i] },
                { translateY: value.interpolate({ inputRange: [0, 1], outputRange: [0, -120] }) },
                { scale: value.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.1] }) },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    position: 'absolute',
    width: 12,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.garden.petal,
  },
});

export default React.memo(PetalCelebration);
