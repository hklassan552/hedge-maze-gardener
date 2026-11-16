import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';

/** Soft clay surface: inflated gradient body, quiet outline and a contact shadow. */
function RaisedPanel({
  children,
  compact,
  style,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  compact?: boolean;
  style?: object;
  accessibilityLabel?: string;
}) {
  return (
    <View
      style={[styles.shadow, style]}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}>
      <LinearGradient
        colors={theme.gradients.panel}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.body, compact ? styles.compact : null]}>
        <View style={styles.highlight} pointerEvents="none" />
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: theme.radius.md,
    ...theme.shadows.panel,
  },
  body: {
    borderRadius: theme.radius.md,
    padding: 16,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    overflow: 'hidden',
  },
  compact: {
    padding: 12,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'rgba(234, 240, 233, 0.10)',
  },
});

export default React.memo(RaisedPanel);
