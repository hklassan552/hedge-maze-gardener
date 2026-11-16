import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Lock } from 'lucide-react-native';
import theme from '../constants/theme';

export type TileStatus = 'locked' | 'open' | 'completed';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 48dp garden target. Status is carried by an icon and text, never by colour alone. */
function GardenTile({
  gardenId,
  status,
  selected,
  onPress,
}: {
  gardenId: number;
  status: TileStatus;
  selected: boolean;
  onPress: (id: number) => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.timing(scale, { toValue: 0.94, duration: 90, useNativeDriver: true }).start();
  }, [scale]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }).start();
  }, [scale]);
  const handlePress = useCallback(() => onPress(gardenId), [gardenId, onPress]);

  const statusWord = status === 'locked' ? 'locked' : status === 'completed' ? 'completed' : 'open';

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={'Garden ' + gardenId + ', ' + statusWord}
      accessibilityState={{ selected }}
      style={styles.touch}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          status === 'locked' ? styles.locked : null,
          status === 'completed' ? styles.completed : null,
          selected ? styles.selected : null,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.mark}>
          {status === 'completed' ? <Check size={12} color={theme.colors.garden.leaf} strokeWidth={3} /> : null}
          {status === 'locked' ? <Lock size={12} color={theme.colors.text.muted} strokeWidth={3} /> : null}
        </View>
        <Text
          style={[styles.number, status === 'locked' ? styles.numberLocked : null]}
          numberOfLines={1}>
          {gardenId}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: 48,
    height: 48,
  },
  tile: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.clay,
  },
  locked: {
    backgroundColor: theme.colors.bg.secondary,
    borderColor: theme.colors.ui.divider,
  },
  completed: {
    backgroundColor: '#2E7D1E',
    borderColor: theme.colors.garden.hedge,
  },
  selected: {
    borderWidth: 2,
    borderColor: theme.colors.garden.magenta,
  },
  mark: {
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  numberLocked: {
    color: theme.colors.text.muted,
  },
});

export default React.memo(GardenTile);
