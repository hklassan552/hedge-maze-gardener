import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import { CHAPTER_NAMES, FLOWERS_PER_GARDEN, pad2 } from '../constants/config';
import theme from '../constants/theme';
import { IconButton } from '../components/Buttons';
import GameControls from '../components/GameControls';
import GardenBackground from '../components/GardenBackground';
import MazeBoard from '../components/MazeBoard';
import PausePanel from '../components/PausePanel';
import ScreenHeader from '../components/ScreenHeader';
import { chapterIndexOf } from '../game/levels';
import type { CellIndex, WalkPlan } from '../game/types';
import { useGardenSession } from '../hooks/useGardenSession';

/** Maze View: trim hedges inside the allowance, then send the hedgehog with GO. */
function GameScreen({
  gardenId,
  initialTrimmed,
  onDraftChange,
  onGo,
  onHome,
  onHelp,
}: {
  gardenId: number;
  initialTrimmed: CellIndex[];
  onDraftChange: (gardenId: number, trimmed: CellIndex[]) => void;
  onGo: (plan: WalkPlan) => void;
  onHome: (trimmed: CellIndex[]) => void;
  onHelp: () => void;
}) {
  const session = useGardenSession(gardenId, initialTrimmed);
  const [paused, setPaused] = useState(false);
  const enter = useRef(new Animated.Value(0)).current;
  const latestTrimmed = useRef(session.trimmed);

  latestTrimmed.current = session.trimmed;

  useEffect(() => {
    enter.setValue(0);
    Animated.timing(enter, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter, gardenId]);

  useEffect(() => {
    onDraftChange(gardenId, session.trimmed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.trimmed]);

  const handleGo = useCallback(() => {
    onGo(session.plan());
  }, [onGo, session]);

  const handleHome = useCallback(() => {
    onHome(latestTrimmed.current);
  }, [onHome]);

  const handleHelp = useCallback(() => {
    setPaused(false);
    onHelp();
  }, [onHelp]);

  return (
    <GardenBackground variant="game">
      <View style={styles.root}>
        <ScreenHeader
          title={'Garden ' + pad2(gardenId)}
          subtitle={CHAPTER_NAMES[chapterIndexOf(gardenId)]}
          leftSlot={
            <IconButton
              source={assets.iconHome}
              onPress={handleHome}
              accessibilityLabel="Save and return to the garden gate"
            />
          }
          rightSlot={
            <IconButton
              source={assets.iconPause}
              onPress={() => setPaused(true)}
              accessibilityLabel="Pause the garden"
            />
          }
          status={
            <View style={styles.statusRow}>
              <Text style={styles.trims}>{'Trims left: ' + session.trimsLeft}</Text>
              <Text style={styles.flowers}>{'Flowers: 0/' + FLOWERS_PER_GARDEN}</Text>
            </View>
          }
        />

        <View style={styles.area}>
          <Animated.View
            pointerEvents="box-none"
            style={{
              opacity: enter,
              transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
            }}>
            <MazeBoard
              level={session.level}
              trimmed={session.trimmed}
              mode="edit"
              route={[]}
              revealed={0}
              takenFlowers={[]}
              onCellPress={session.trim}
            />
          </Animated.View>
          <View style={styles.boardStatus}>
            <Text style={styles.boardStatusText} numberOfLines={1}>
              {'Trimmed ' + session.trimmed.length + ' of ' + session.level.allowance + ' allowed hedges'}
            </Text>
          </View>
        </View>

        <GameControls
          statusText={session.statusText}
          canUndo={session.canUndo}
          onUndo={session.undo}
          onReset={session.reset}
          onGo={handleGo}
        />

        <PausePanel
          visible={paused}
          mode="edit"
          onResume={() => setPaused(false)}
          onHelp={handleHelp}
          onMenu={handleHome}
        />
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
  trims: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  flowers: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardStatus: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardStatusText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: theme.colors.text.muted,
  },
});

export default GameScreen;
