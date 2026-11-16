import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Full-row toggle with an explicit On/Off value for screen readers. */
function SettingsRow({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description?: string;
  value: boolean;
  onToggle: (next: boolean) => void;
}) {
  const handlePress = useCallback(() => onToggle(!value), [onToggle, value]);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      accessibilityValue={{ text: value ? 'On' : 'Off' }}
      style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {description ? (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>
      <View style={[styles.pill, value ? styles.pillOn : null]}>
        <Text style={[styles.pillText, value ? styles.pillTextOn : null]}>{value ? 'ON' : 'OFF'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  text: {
    flex: 1,
    paddingRight: 12,
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.text.muted,
  },
  pill: {
    width: 64,
    height: 40,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 2,
    borderColor: theme.colors.ui.divider,
  },
  pillOn: {
    backgroundColor: theme.colors.garden.magentaDeep,
    borderColor: theme.colors.garden.magenta,
  },
  pillText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  pillTextOn: {
    color: theme.colors.text.primary,
  },
});

export default React.memo(SettingsRow);
