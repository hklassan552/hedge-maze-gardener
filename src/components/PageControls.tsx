import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { SecondaryButton } from './Buttons';

/** Explicit paging: two 48dp targets and a readable page label between them. */
function PageControls({
  page,
  pageCount,
  label,
  onPrevious,
  onNext,
}: {
  page: number;
  pageCount: number;
  label?: string;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.row}>
      <SecondaryButton
        label="PREV"
        onPress={onPrevious}
        disabled={page <= 0}
        accessibilityLabel="Previous page"
        style={styles.side}
      />
      <View style={styles.middle}>
        <Text style={styles.label} numberOfLines={1}>
          {label || page + 1 + ' of ' + pageCount}
        </Text>
      </View>
      <SecondaryButton
        label="NEXT"
        onPress={onNext}
        disabled={page >= pageCount - 1}
        accessibilityLabel="Next page"
        style={styles.side}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  side: {
    width: 100,
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default React.memo(PageControls);
