/**
 * Hedge Maze Gardener — root navigation only.
 * The state machine lives here; maze and scoring logic live under src/game.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Easing, StatusBar, StyleSheet, View } from 'react-native';
import { CHAPTER_SIZE, CROSSFADE_MS, GARDEN_COUNT } from './src/constants/config';
import theme from './src/constants/theme';
import { chapterIndexOf } from './src/game/levels';
import type { CellIndex, RoundResult, WalkPlan } from './src/game/types';
import type { Preferences } from './src/game/progressStore';
import { useGardenProgress } from './src/hooks/useGardenProgress';
import FlowerBedScreen from './src/screens/FlowerBedScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import HedgehogWalkScreen from './src/screens/HedgehogWalkScreen';
import HelpScreen from './src/screens/HelpScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Screen = 'loader' | 'menu' | 'game' | 'walk' | 'gameover' | 'flowerbed' | 'help' | 'settings';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [selectedId, setSelectedId] = useState(1);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [walkPlan, setWalkPlan] = useState<WalkPlan | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [attemptKey, setAttemptKey] = useState(0);
  const returnTo = useRef<Screen>('menu');
  const fade = useRef(new Animated.Value(1)).current;

  const {
    progress,
    drafts,
    preferences,
    saveDraft,
    clearDraft,
    commitSuccess,
    updatePreferences,
    resetProgress,
  } = useGardenProgress();

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: CROSSFADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fade, screen]);

  const goMenu = useCallback(() => setScreen('menu'), []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'loader' || screen === 'menu') {
        return false;
      }
      if (screen === 'help' || screen === 'settings' || screen === 'flowerbed') {
        setScreen(returnTo.current);
        return true;
      }
      if (screen === 'gameover' && result && result.outcome === 'blocked') {
        setScreen('game');
        return true;
      }
      goMenu();
      return true;
    });
    return () => sub.remove();
  }, [goMenu, result, screen]);

  const openGarden = useCallback(
    (id: number, fresh: boolean) => {
      if (fresh) {
        clearDraft(id);
      }
      setSelectedId(id);
      setChapterIndex(chapterIndexOf(id));
      setAttemptKey(k => k + 1);
      setWalkPlan(null);
      setScreen('game');
    },
    [clearDraft],
  );

  const handleGo = useCallback(
    (plan: WalkPlan) => {
      if (plan.route.length === 0) {
        setResult({
          gardenId: plan.gardenId,
          outcome: 'blocked',
          roundScore: 0,
          creditedDelta: 0,
          previousBest: progress.bests[plan.gardenId] || 0,
          flowersCrossed: 0,
          trimsLeft: plan.trimsLeft,
          newSpecies: [],
          unlockedNext: null,
        });
        setScreen('gameover');
        return;
      }
      setWalkPlan(plan);
      setScreen('walk');
    },
    [progress.bests],
  );

  const handleArrive = useCallback(
    (flowersCrossed: number) => {
      if (!walkPlan) {
        return;
      }
      setResult(
        commitSuccess({
          gardenId: walkPlan.gardenId,
          attemptId: walkPlan.attemptId,
          flowersCrossed,
          trimsLeft: walkPlan.trimsLeft,
        }),
      );
      setScreen('gameover');
    },
    [commitSuccess, walkPlan],
  );

  const openSupport = useCallback((target: Screen) => {
    returnTo.current = 'menu';
    setScreen(target);
  }, []);

  const openSupportFrom = useCallback((target: Screen, from: Screen) => {
    returnTo.current = from;
    setScreen(target);
  }, []);

  const handlePreferences = useCallback(
    (patch: Partial<Preferences>) => updatePreferences(patch),
    [updatePreferences],
  );

  const handleDraftChange = useCallback(
    (gardenId: number, trimmed: CellIndex[]) => saveDraft(gardenId, trimmed),
    [saveDraft],
  );

  let content: React.ReactNode = null;

  if (screen === 'loader') {
    content = <LoaderScreen onFinish={goMenu} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        progress={progress}
        selectedId={selectedId}
        chapterIndex={chapterIndex}
        onSelect={setSelectedId}
        onPage={index => setChapterIndex(Math.min(Math.max(0, index), GARDEN_COUNT / CHAPTER_SIZE - 1))}
        onPlay={() => openGarden(selectedId, false)}
        onFlowerBed={() => openSupport('flowerbed')}
        onHelp={() => openSupport('help')}
        onSettings={() => openSupport('settings')}
      />
    );
  } else if (screen === 'game') {
    content = (
      <GameScreen
        key={'garden-' + selectedId + '-' + attemptKey}
        gardenId={selectedId}
        initialTrimmed={drafts[selectedId] || []}
        onDraftChange={handleDraftChange}
        onGo={handleGo}
        onHome={() => goMenu()}
        onHelp={() => openSupportFrom('help', 'game')}
      />
    );
  } else if (screen === 'walk' && walkPlan) {
    content = (
      <HedgehogWalkScreen
        key={'walk-' + walkPlan.attemptId}
        plan={walkPlan}
        trimmed={drafts[walkPlan.gardenId] || []}
        reducedMotion={preferences.reducedMotion}
        onArrive={handleArrive}
        onHelp={() => openSupportFrom('help', 'walk')}
        onMenu={goMenu}
      />
    );
  } else if (screen === 'gameover' && result) {
    content = (
      <GameOverScreen
        result={result}
        reducedMotion={preferences.reducedMotion}
        onPlayAgain={() => openGarden(result.gardenId, true)}
        onNextGarden={() => openGarden(Math.min(GARDEN_COUNT, result.gardenId + 1), true)}
        onKeepTrimming={() => setScreen('game')}
        onMenu={goMenu}
        onFlowerBed={() => openSupport('flowerbed')}
      />
    );
  } else if (screen === 'flowerbed') {
    content = <FlowerBedScreen totalPetals={progress.totalPetals} onBack={() => setScreen(returnTo.current)} />;
  } else if (screen === 'help') {
    content = <HelpScreen onDone={() => setScreen(returnTo.current)} />;
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        preferences={preferences}
        onChange={handlePreferences}
        onReset={() => {
          resetProgress();
          setSelectedId(1);
          setChapterIndex(0);
          goMenu();
        }}
        onDone={() => setScreen(returnTo.current)}
      />
    );
  } else {
    content = (
      <MenuScreen
        progress={progress}
        selectedId={selectedId}
        chapterIndex={chapterIndex}
        onSelect={setSelectedId}
        onPage={setChapterIndex}
        onPlay={() => openGarden(selectedId, false)}
        onFlowerBed={() => openSupport('flowerbed')}
        onHelp={() => openSupport('help')}
        onSettings={() => openSupport('settings')}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View style={[styles.layer, { opacity: fade }]} pointerEvents="box-none">
        {content}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  layer: {
    flex: 1,
  },
});

export default App;
