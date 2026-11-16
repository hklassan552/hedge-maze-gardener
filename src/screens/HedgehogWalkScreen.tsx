import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SkipForward } from 'lucide-react-native';
import assets from '../assets';
import { ARRIVAL_MS, FLOWERS_PER_GARDEN, TILE, WALK_STEP_MS, pad2 } from '../constants/config';
import theme from '../constants/theme';
import { IconButton, PrimaryButton } from '../components/Buttons';
import GardenBackground from '../components/GardenBackground';
import MazeBoard, { cellOffset } from '../components/MazeBoard';
import PausePanel from '../components/PausePanel';
import ScreenHeader from '../components/ScreenHeader';
import { getLevel } from '../game/levels';
import type { CellIndex, WalkPlan } from '../game/types';

const WALKER_PAD = Math.round((TILE - Math.round(TILE * 0.72)) / 2);

const offsetFor = (cell: CellIndex) => {
  const off = cellOffset(cell);
  return { x: off.x + WALKER_PAD, y: off.y + WALKER_PAD };
};

/** The locked route animation. Editing is frozen; only the saved route is followed. */
function HedgehogWalkScreen({
  plan,
  trimmed,
  reducedMotion,
  onArrive,
  onHelp,
  onMenu,
}: {
  plan: WalkPlan;
  trimmed: CellIndex[];
  reducedMotion: boolean;
  onArrive: (flowersCrossed: number) => void;
  onHelp: () => void;
  onMenu: () => void;
}) {
  const level = useMemo(() => getLevel(plan.gardenId), [plan.gardenId]);
  const route = plan.route;
  const translate = useRef(new Animated.ValueXY(offsetFor(route[0]))).current;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const stepRef = useRef(0);
  const aliveRef = useRef(true);
  const pausedRef = useRef(false);
  const arrivedRef = useRef(false);

  const flowersUpTo = useCallback(
    (upto: number) => route.slice(0, upto + 1).filter(c => plan.flowerCells.indexOf(c) !== -1),
    [plan.flowerCells, route],
  );

  const finish = useCallback(() => {
    if (arrivedRef.current) {
      return;
    }
    arrivedRef.current = true;
    setTimeout(() => {
      if (aliveRef.current) {
        onArrive(plan.flowerCells.length);
      }
    }, ARRIVAL_MS);
  }, [onArrive, plan.flowerCells.length]);

  const runStep = useCallback(() => {
    if (!aliveRef.current || arrivedRef.current) {
      return;
    }
    const next = stepRef.current + 1;
    if (next >= route.length) {
      finish();
      return;
    }
    Animated.timing(translate, {
      toValue: offsetFor(route[next]),
      duration: reducedMotion ? 60 : WALK_STEP_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!aliveRef.current || !finished) {
        return;
      }
      stepRef.current = next;
      setIndex(next);
      if (pausedRef.current) {
        return;
      }
      runStep();
    });
  }, [finish, reducedMotion, route, translate]);

  useEffect(() => {
    aliveRef.current = true;
    runStep();
    return () => {
      aliveRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resume = useCallback(() => {
    setPaused(false);
    pausedRef.current = false;
    runStep();
  }, [runStep]);

  const pause = useCallback(() => {
    setPaused(true);
    pausedRef.current = true;
  }, []);

  const skip = useCallback(() => {
    pausedRef.current = true;
    translate.stopAnimation(() => {
      const last = route.length - 1;
      stepRef.current = last;
      setIndex(last);
      translate.setValue(offsetFor(route[last]));
      finish();
    });
  }, [finish, route, translate]);

  const collected = flowersUpTo(index).length;

  return (
    <GardenBackground variant="walk">
      <View style={styles.root}>
        <ScreenHeader
          title="On the way home"
          subtitle={'Garden ' + pad2(plan.gardenId)}
          rightSlot={
            <IconButton source={assets.iconPause} onPress={pause} accessibilityLabel="Pause the walk" />
          }
          status={
            <View style={styles.statusRow}>
              <Text style={styles.trims}>{'Trims left: ' + plan.trimsLeft}</Text>
              <Text style={styles.flowers}>{'Flowers: ' + collected + '/' + FLOWERS_PER_GARDEN}</Text>
            </View>
          }
        />

        <View style={styles.area}>
          <MazeBoard
            level={level}
            trimmed={trimmed}
            mode="walk"
            route={route}
            revealed={index}
            takenFlowers={flowersUpTo(index)}
            walkerTranslate={translate}
          />
          <View style={styles.boardStatus}>
            <Text style={styles.boardStatusText} numberOfLines={1}>
              {'Step ' + (index + 1) + ' of ' + route.length}
            </Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.hint} numberOfLines={2}>
            Following the shortest open path
          </Text>
          <PrimaryButton
            label="SKIP WALK"
            Icon={SkipForward}
            onPress={skip}
            accessibilityLabel="Skip to the end of the walk"
          />
        </View>

        <PausePanel visible={paused} mode="walk" onResume={resume} onHelp={onHelp} onMenu={onMenu} />
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
  panel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopLeftRadius: theme.radius.panel,
    borderTopRightRadius: theme.radius.panel,
    borderTopWidth: 2,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.bg.tertiary,
  },
  hint: {
    minHeight: 20,
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default HedgehogWalkScreen;
