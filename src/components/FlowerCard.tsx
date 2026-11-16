import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { IS_COMPACT } from '../constants/config';
import type { FlowerSpecies } from '../constants/flowerSpecies';
import theme from '../constants/theme';
import FlowerGlyph from './FlowerGlyph';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Species tile. Locked flowers keep their name and show an outline silhouette. */
function FlowerCard({
  species,
  totalPetals,
  unlocked,
  onPress,
}: {
  species: FlowerSpecies;
  totalPetals: number;
  unlocked: boolean;
  onPress: (species: FlowerSpecies) => void;
}) {
  const handlePress = useCallback(() => onPress(species), [onPress, species]);
  const remaining = Math.max(0, species.threshold - totalPetals);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={species.name + (unlocked ? ', grown' : ', ' + remaining + ' petals to grow')}
      style={[styles.touch, IS_COMPACT ? styles.touchCompact : null]}>
      <View style={[styles.card, unlocked ? styles.cardOpen : null]}>
        <FlowerGlyph species={species} size={IS_COMPACT ? 32 : 40} muted={!unlocked} />
        <Text style={styles.name} numberOfLines={1}>
          {species.name}
        </Text>
        <View style={styles.statusRow}>
          {unlocked ? null : <Lock size={12} color={theme.colors.text.muted} strokeWidth={3} />}
          <Text style={styles.status} numberOfLines={1}>
            {unlocked ? 'Grown' : remaining + ' petals to grow'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: {
    flex: 1,
    height: 112,
  },
  touchCompact: {
    height: 96,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 2,
    borderColor: theme.colors.ui.divider,
    ...theme.shadows.clay,
  },
  cardOpen: {
    borderColor: theme.colors.garden.hedge,
  },
  name: {
    marginTop: 6,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  statusRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  status: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});

export default React.memo(FlowerCard);
