import React, { useCallback, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorValue, ImageSourcePropType } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

type IconProps = {
  size?: string | number;
  color?: ColorValue;
  strokeWidth?: string | number;
};
type LucideIcon = React.ComponentType<IconProps>;

function usePressScale() {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() => {
    Animated.timing(scale, { toValue: 0.97, duration: 90, useNativeDriver: true }).start();
  }, [scale]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);
  return { scale, pressIn, pressOut };
}

/** 56dp gradient action. Pressable is the parent so Android release taps survive. */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  Icon,
  accessibilityLabel,
  tone = 'accent',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  Icon?: LucideIcon;
  accessibilityLabel?: string;
  tone?: 'accent' | 'leaf';
}) {
  const { scale, pressIn, pressOut } = usePressScale();
  const colors = tone === 'leaf' ? theme.gradients.hedge : theme.gradients.action;

  return (
    <Pressable
      style={styles.primaryTouch}
      hitSlop={HIT}
      disabled={disabled}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel || label}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.primaryShell, { transform: [{ scale }] }, disabled ? styles.dim : theme.shadows.action]}>
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.primaryFill}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={theme.colors.text.primary} strokeWidth={2.4} /> : null}
            <Text style={styles.primaryLabel} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

/** 48dp outlined action. */
export function SecondaryButton({
  label,
  onPress,
  disabled,
  Icon,
  accessibilityLabel,
  style,
  small,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  Icon?: LucideIcon;
  accessibilityLabel?: string;
  style?: object;
  small?: boolean;
}) {
  const { scale, pressIn, pressOut } = usePressScale();
  const tint = disabled ? theme.colors.text.secondary : theme.colors.text.primary;

  return (
    <Pressable
      style={[styles.secondaryTouch, style]}
      hitSlop={HIT}
      disabled={disabled}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel || label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.secondaryShell,
          small ? styles.secondaryShellSmall : null,
          { transform: [{ scale }] },
          disabled ? styles.outlineDim : null,
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={tint} strokeWidth={2.2} /> : null}
          <Text
            style={[styles.secondaryLabel, small ? styles.secondaryLabelSmall : null, { color: tint }]}
            numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

/** 48dp square target holding one 24dp glyph — either a lucide icon or a contract PNG. */
export function IconButton({
  onPress,
  Icon,
  source,
  accessibilityLabel,
  disabled,
  tone = 'surface',
}: {
  onPress: () => void;
  Icon?: LucideIcon;
  source?: ImageSourcePropType;
  accessibilityLabel: string;
  disabled?: boolean;
  tone?: 'surface' | 'accent';
}) {
  const { scale, pressIn, pressOut } = usePressScale();

  return (
    <Pressable
      style={styles.iconTouch}
      hitSlop={HIT}
      disabled={disabled}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.iconShell,
          tone === 'accent' ? styles.iconShellAccent : null,
          { transform: [{ scale }] },
        ]}>
        {source ? <Image source={source} style={styles.iconImage} /> : null}
        {Icon ? <Icon size={ICON} color={theme.colors.text.primary} strokeWidth={2.2} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryTouch: {
    width: '100%',
    height: 56,
  },
  primaryShell: {
    width: '100%',
    height: 56,
    borderRadius: theme.radius.md,
  },
  primaryFill: {
    width: '100%',
    height: 56,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  primaryLabel: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  secondaryTouch: {
    minWidth: 48,
    height: 48,
  },
  secondaryShell: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 2,
    borderColor: theme.colors.ui.borderStrong,
  },
  secondaryLabel: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  secondaryShellSmall: {
    paddingHorizontal: 6,
  },
  secondaryLabelSmall: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  outlineDim: {
    backgroundColor: theme.colors.bg.secondary,
    borderColor: theme.colors.ui.divider,
  },
  dim: {
    opacity: 0.55,
  },
  iconTouch: {
    width: 48,
    height: 48,
  },
  iconShell: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 2,
    borderColor: theme.colors.ui.borderStrong,
  },
  iconShellAccent: {
    backgroundColor: theme.colors.garden.magentaDeep,
    borderColor: theme.colors.garden.magenta,
  },
  iconImage: {
    width: ICON,
    height: ICON,
    resizeMode: 'contain',
  },
});

export default PrimaryButton;
