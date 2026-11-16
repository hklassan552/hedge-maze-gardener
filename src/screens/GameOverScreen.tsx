import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Flower2, Play, Scissors } from 'lucide-react-native';
import assets from '../assets';
import { COUNT_UP_MS, GARDEN_COUNT, IS_COMPACT, pad2 } from '../constants/config';
import theme from '../constants/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import GardenBackground from '../components/GardenBackground';
import PetalCelebration from '../components/PetalCelebration';
import RaisedPanel from '../components/RaisedPanel';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import type { RoundResult } from '../game/types';

/** Garden Result: one screen for the successful round and one for a blocked route. */
function GameOverScreen({
  result,
  reducedMotion,
  onPlayAgain,
  onNextGarden,
  onKeepTrimming,
  onMenu,
  onFlowerBed,
}: {
  result: RoundResult;
  reducedMotion: boolean;
  onPlayAgain: () => void;
  onNextGarden: () => void;
  onKeepTrimming: () => void;
  onMenu: () => void;
  onFlowerBed: () => void;
}) {
  const success = result.outcome === 'success';
  const enter = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const [shown, setShown] = useState(reducedMotion ? result.roundScore : 0);

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    if (reducedMotion || result.roundScore <= 0) {
      setShown(result.roundScore);
      return;
    }
    const steps = 12;
    const tick = Math.max(16, Math.round(COUNT_UP_MS / steps));
    let n = 0;
    const timer = setInterval(() => {
      n += 1;
      setShown(Math.round((result.roundScore * n) / steps));
      if (n >= steps) {
        clearInterval(timer);
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.04, duration: 90, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 90, useNativeDriver: true }),
        ]).start();
      }
    }, tick);
    return () => clearInterval(timer);
  }, [pulse, reducedMotion, result.roundScore]);

  const isLastGarden = result.gardenId >= GARDEN_COUNT;
  const creditLine = success
    ? result.creditedDelta > 0
      ? 'Added to your collection: ' + result.creditedDelta + ' petals'
      : 'Best matched · 0 new petals'
    : 'No petals this time. The burrow is still waiting.';

  return (
    <GardenBackground variant="result">
      <View style={styles.root}>
        <ScreenHeader
          title={success ? 'Home, sweet burrow!' : 'A little more trimming'}
          subtitle={'Garden ' + pad2(result.gardenId)}
        />

        <View style={styles.body}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.cardWrap,
              {
                opacity: enter,
                transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
              },
            ]}>
            <RaisedPanel compact={IS_COMPACT}>
              <View style={styles.vignette}>
                <Image source={assets.hedgehog} style={styles.vignetteHog} />
                {success ? <Image source={assets.burrow} style={styles.vignetteBurrow} /> : null}
              </View>

              <Animated.Text style={[styles.score, { transform: [{ scale: pulse }] }]}>
                {shown + ' petals'}
              </Animated.Text>
              <Text style={styles.creditLine} numberOfLines={2}>
                {creditLine}
              </Text>
              <Text style={styles.bestLine} numberOfLines={1}>
                {'Saved best for this garden: ' +
                  Math.max(result.previousBest, success ? result.roundScore : 0) +
                  ' petals'}
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.statSlot}>
                  <StatCard
                    Icon={Flower2}
                    value={String(result.flowersCrossed)}
                    label="Flowers crossed"
                    tone={theme.colors.garden.petal}
                    compact={IS_COMPACT}
                  />
                </View>
                <View style={styles.statSlot}>
                  <StatCard
                    Icon={Scissors}
                    value={String(result.trimsLeft)}
                    label="Trims left"
                    tone={theme.colors.garden.leaf}
                    compact={IS_COMPACT}
                  />
                </View>
              </View>

              {success && result.newSpecies.length > 0 ? (
                <View style={styles.unlock}>
                  <Text style={styles.unlockText} numberOfLines={1}>
                    {'New flower: ' + result.newSpecies.join(', ')}
                  </Text>
                </View>
              ) : null}

              {success ? null : (
                <Text style={styles.blockedText} numberOfLines={2}>
                  There is no open path to the burrow yet.
                </Text>
              )}
            </RaisedPanel>
            <PetalCelebration active={success} reducedMotion={reducedMotion} />
          </Animated.View>
        </View>

        <View style={styles.actions}>
          {success ? (
            <PrimaryButton
              label={isLastGarden ? 'FLOWER BED' : 'NEXT GARDEN'}
              Icon={isLastGarden ? Flower2 : Play}
              onPress={isLastGarden ? onFlowerBed : onNextGarden}
              accessibilityLabel={isLastGarden ? 'Open the flower bed' : 'Open the next garden'}
            />
          ) : (
            <PrimaryButton
              label="KEEP TRIMMING"
              Icon={Scissors}
              onPress={onKeepTrimming}
              accessibilityLabel="Return to the garden you were trimming"
            />
          )}
          <View style={styles.actionGap} />
          <SecondaryButton
            label={success ? 'PLAY AGAIN' : 'TRY AGAIN'}
            onPress={onPlayAgain}
            accessibilityLabel="Start this garden again with the full allowance"
          />
          <View style={styles.actionGap} />
          <SecondaryButton
            label="GARDEN GATE"
            onPress={onMenu}
            accessibilityLabel="Return to the garden gate"
          />
        </View>
      </View>
    </GardenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    justifyContent: 'center',
  },
  cardWrap: {
    width: '100%',
  },
  vignette: {
    height: IS_COMPACT ? 56 : 92,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
  },
  vignetteHog: {
    width: IS_COMPACT ? 48 : 76,
    height: IS_COMPACT ? 48 : 76,
    resizeMode: 'contain',
  },
  vignetteBurrow: {
    width: IS_COMPACT ? 46 : 72,
    height: IS_COMPACT ? 46 : 72,
    resizeMode: 'contain',
  },
  score: {
    marginTop: 6,
    fontSize: IS_COMPACT ? 32 : 40,
    lineHeight: IS_COMPACT ? 38 : 44,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  creditLine: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.garden.petal,
    textAlign: 'center',
  },
  bestLine: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.4,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  statsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  statSlot: {
    flex: 1,
  },
  unlock: {
    marginTop: 12,
    height: 48,
    borderRadius: theme.radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(192, 40, 224, 0.18)',
    borderWidth: 2,
    borderColor: theme.colors.garden.magenta,
  },
  unlockText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  blockedText: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
  },
  actionGap: {
    height: 10,
  },
});

export default GameOverScreen;
