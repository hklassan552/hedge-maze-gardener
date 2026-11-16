import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CHAPTER_NAMES, CHAPTER_SIZE, IS_COMPACT } from '../constants/config';
import theme from '../constants/theme';
import { chapterGardenIds } from '../game/levels';
import { SecondaryButton } from './Buttons';
import GardenTile from './GardenTile';
import RaisedPanel from './RaisedPanel';

/** One chapter page of ten gardens, with its own 48dp paging row. */
function GardenSelector({
  chapterIndex,
  selectedId,
  unlockedId,
  completedIds,
  onSelect,
  onPage,
}: {
  chapterIndex: number;
  selectedId: number;
  unlockedId: number;
  completedIds: number[];
  onSelect: (id: number) => void;
  onPage: (nextIndex: number) => void;
}) {
  const ids = chapterGardenIds(chapterIndex);
  const topRow = ids.slice(0, CHAPTER_SIZE / 2);
  const bottomRow = ids.slice(CHAPTER_SIZE / 2);

  const renderRow = (row: number[]) => (
    <View style={styles.tileRow}>
      {row.map(id => (
        <GardenTile
          key={id}
          gardenId={id}
          status={completedIds.indexOf(id) !== -1 ? 'completed' : id <= unlockedId ? 'open' : 'locked'}
          selected={id === selectedId}
          onPress={onSelect}
        />
      ))}
    </View>
  );

  return (
    <RaisedPanel compact={IS_COMPACT} accessibilityLabel="Garden selector">
      <View style={styles.headRow}>
        <SecondaryButton
          label="PREV"
          onPress={() => onPage(chapterIndex - 1)}
          disabled={chapterIndex <= 0}
          accessibilityLabel="Previous chapter"
          style={styles.pager}
        />
        <View style={styles.headMiddle}>
          <Text style={styles.chapter} numberOfLines={1}>
            {CHAPTER_NAMES[chapterIndex]}
          </Text>
          <Text style={styles.range} numberOfLines={1}>
            {'Gardens ' + ids[0] + '-' + ids[ids.length - 1]}
          </Text>
        </View>
        <SecondaryButton
          label="NEXT"
          onPress={() => onPage(chapterIndex + 1)}
          disabled={chapterIndex >= CHAPTER_NAMES.length - 1}
          accessibilityLabel="Next chapter"
          style={styles.pager}
        />
      </View>
      {renderRow(topRow)}
      {renderRow(bottomRow)}
    </RaisedPanel>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  headMiddle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pager: {
    width: 92,
  },
  chapter: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  range: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  tileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

export default React.memo(GardenSelector);
