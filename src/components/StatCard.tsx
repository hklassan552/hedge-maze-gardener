import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ColorValue } from 'react-native';
import theme from '../constants/theme';

type IconProps = {
  size?: string | number;
  color?: ColorValue;
  strokeWidth?: string | number;
};
type LucideIcon = React.ComponentType<IconProps>;

/**
 * The same card everywhere statistics appear. Pills differentiate by tone colour
 * and text only — never by a different sprite, so every pill keeps one silhouette.
 * `width: '100%'` (not flex) keeps the card at its content height inside a flex slot.
 */
function StatCard({
  Icon,
  value,
  label,
  tone,
  compact,
}: {
  Icon: LucideIcon;
  value: string;
  label: string;
  tone: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.card, compact ? styles.cardCompact : null, { borderColor: tone + '66' }]}>
      <View style={[styles.iconWrap, compact ? styles.iconWrapCompact : null, { backgroundColor: tone + '22' }]}>
        <Icon size={compact ? 20 : 22} color={tone} strokeWidth={2.5} />
      </View>
      <Text style={[styles.value, compact ? styles.valueCompact : null, { color: tone }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 2,
    backgroundColor: theme.colors.bg.tertiary,
    ...theme.shadows.clay,
  },
  cardCompact: {
    paddingVertical: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconWrapCompact: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: 2,
  },
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
  },
  valueCompact: {
    fontSize: 18,
    lineHeight: 22,
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
});

export default React.memo(StatCard);
