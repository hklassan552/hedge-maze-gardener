import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HEADER_ROW_H, HEADER_TOP_PAD } from '../constants/config';
import theme from '../constants/theme';

/**
 * The one header used by every screen. Screens differ only through the slots,
 * so padding, type sizes and the safe top inset stay identical everywhere.
 */
function ScreenHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  status,
}: {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  status?: React.ReactNode;
}) {
  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <View style={styles.side}>{leftSlot}</View>
        <View style={styles.middle}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.side}>{rightSlot}</View>
      </View>
      {status ? <View style={styles.status}>{status}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: HEADER_TOP_PAD,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: theme.colors.ui.overlay,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  row: {
    minHeight: HEADER_ROW_H,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    lineHeight: theme.typography.title.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '500',
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  status: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default React.memo(ScreenHeader);
