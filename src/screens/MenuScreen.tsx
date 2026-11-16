import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Flower2, Play, Settings as SettingsIcon, Sprout } from 'lucide-react-native';
import assets from '../assets';
import { CHAPTER_NAMES, GARDEN_COUNT, IS_COMPACT, pad2 } from '../constants/config';
import { FLOWER_SPECIES, unlockedCount } from '../constants/flowerSpecies';
import theme from '../constants/theme';
import { IconButton, PrimaryButton, SecondaryButton } from '../components/Buttons';
import GardenBackground from '../components/GardenBackground';
import GardenSelector from '../components/GardenSelector';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import { chapterIndexOf, getLevel } from '../game/levels';
import type { Progress } from '../game/types';

/** Garden Gate: brand hero, two persistent summary cards and the garden selector. */
function MenuScreen({
  progress,
  selectedId,
  chapterIndex,
  onSelect,
  onPage,
  onPlay,
  onFlowerBed,
  onHelp,
  onSettings,
}: {
  progress: Progress;
  selectedId: number;
  chapterIndex: number;
  onSelect: (id: number) => void;
  onPage: (index: number) => void;
  onPlay: () => void;
  onFlowerBed: () => void;
  onHelp: () => void;
  onSettings: () => void;
}) {
  const enter = useRef(new Animated.Value(0)).current;
  const [notice, setNotice] = useState('');
  const level = getLevel(selectedId);
  const grown = unlockedCount(progress.totalPetals);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = setTimeout(() => setNotice(''), 1800);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleSelect = useCallback(
    (id: number) => {
      if (id > progress.unlocked) {
        setNotice('Complete Garden ' + pad2(progress.unlocked) + ' first');
        return;
      }
      setNotice('');
      onSelect(id);
    },
    [onSelect, progress.unlocked],
  );

  const hint = notice
    ? notice
    : 'Garden ' + pad2(selectedId) + ' · ' + level.allowance + ' trims · ' + CHAPTER_NAMES[chapterIndexOf(selectedId)];

  return (
    <GardenBackground variant="menu">
      <View style={styles.root}>
        <ScreenHeader
          title={IS_COMPACT ? 'Hedge Maze Gardener' : 'Garden Gate'}
          rightSlot={
            <IconButton Icon={SettingsIcon} onPress={onSettings} accessibilityLabel="Open settings" />
          }
          status={
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>{progress.totalPetals + ' petals'}</Text>
              <Text style={styles.statusText}>{CHAPTER_NAMES[chapterIndex]}</Text>
            </View>
          }
        />

        <View style={styles.body}>
          {IS_COMPACT ? (
            <Text style={styles.compactSubtitle} numberOfLines={1}>
              Help a little friend get home.
            </Text>
          ) : (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.hero,
                {
                  opacity: enter,
                  transform: [
                    { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
                  ],
                },
              ]}>
              <View style={styles.heroArt}>
                <View style={styles.heroGlow} />
                <Image source={assets.gardener} style={styles.heroGardener} />
                <Image source={assets.hedgehog} style={styles.heroHedgehog} />
              </View>
              <Text style={styles.heroTitle} numberOfLines={1}>
                Hedge Maze Gardener
              </Text>
              <Text style={styles.heroSubtitle} numberOfLines={1}>
                Help a little friend get home.
              </Text>
            </Animated.View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Sprout}
                value={progress.completed.length + '/' + GARDEN_COUNT}
                label="Gardens home"
                tone={theme.colors.garden.leaf}
                compact={IS_COMPACT}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Flower2}
                value={grown + '/' + FLOWER_SPECIES.length}
                label="Flowers grown"
                tone={theme.colors.garden.petal}
                compact={IS_COMPACT}
              />
            </View>
          </View>

          <GardenSelector
            chapterIndex={chapterIndex}
            selectedId={selectedId}
            unlockedId={progress.unlocked}
            completedIds={progress.completed}
            onSelect={handleSelect}
            onPage={onPage}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint} numberOfLines={1}>
            {hint}
          </Text>
          <PrimaryButton
            label="PLAY"
            Icon={Play}
            onPress={onPlay}
            accessibilityLabel={'Play garden ' + selectedId}
          />
          <View style={styles.utilityRow}>
            <SecondaryButton
              label="FLOWERS"
              small
              onPress={onFlowerBed}
              accessibilityLabel="Open the flower bed"
              style={styles.utility}
            />
            <SecondaryButton
              label="HELP"
              small
              onPress={onHelp}
              accessibilityLabel="Open help"
              style={styles.utility}
            />
            <SecondaryButton
              label="SETTINGS"
              small
              onPress={onSettings}
              accessibilityLabel="Open settings"
              style={styles.utility}
            />
          </View>
        </View>
      </View>
    </GardenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  statusRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  hero: {
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroArt: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  heroGlow: {
    position: 'absolute',
    width: 150,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.garden.hedge,
    opacity: 0.18,
  },
  heroGardener: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  heroHedgehog: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  heroTitle: {
    marginTop: 6,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  compactSubtitle: {
    height: 20,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginVertical: 12,
  },
  statSlot: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  hint: {
    marginBottom: 8,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  utilityRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  utility: {
    flex: 1,
  },
});

export default MenuScreen;
