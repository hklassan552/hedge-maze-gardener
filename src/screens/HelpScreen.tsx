import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import assets from '../assets';
import { IS_COMPACT, TRIM_MS } from '../constants/config';
import theme from '../constants/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import GardenBackground from '../components/GardenBackground';
import PageControls from '../components/PageControls';
import RaisedPanel from '../components/RaisedPanel';
import ScreenHeader from '../components/ScreenHeader';

const PAGES = [
  {
    title: 'Trim a hedge.',
    body: 'Tap a green hedge to clear it. Each hedge costs one trim. UNDO gives that trim back.',
    art: assets.topiary,
  },
  {
    title: 'Let the hedgehog walk.',
    body:
      'Tap GO when you are ready. The hedgehog follows the shortest open path, moving up, right, down or left. Stone cannot be cut.',
    art: assets.hedgehog,
  },
  {
    title: 'Grow your flowers.',
    body:
      'Flowers on the chosen path give petals. Save trims for extra petals. Better garden scores help your flower bed grow.',
    art: assets.blossom,
  },
];

/** Three teaching pages with explicit paging and a demonstration of the trim. */
function HelpScreen({ onDone }: { onDone: () => void }) {
  const [page, setPage] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const demo = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fade, page]);

  const showTrim = () => {
    demo.setValue(1);
    Animated.sequence([
      Animated.timing(demo, { toValue: 0, duration: TRIM_MS, useNativeDriver: true }),
      Animated.timing(demo, { toValue: 1, duration: 260, delay: 220, useNativeDriver: true }),
    ]).start();
  };

  const current = PAGES[page];
  const artSize = IS_COMPACT ? 96 : 150;

  return (
    <GardenBackground variant="support">
      <View style={styles.root}>
        <ScreenHeader
          title="How to help"
          subtitle={'Page ' + (page + 1) + ' of ' + PAGES.length}
          leftSlot={<SecondaryButton label="BACK" small onPress={onDone} accessibilityLabel="Go back" style={styles.back} />}
        />

        <View style={styles.body}>
          <RaisedPanel compact={IS_COMPACT} style={styles.card}>
            <Animated.View style={{ opacity: fade }} pointerEvents="box-none">
              <View style={[styles.art, { height: artSize }]}>
                <Animated.Image
                  source={current.art}
                  style={[
                    { width: artSize, height: artSize, resizeMode: 'contain' },
                    page === 0 ? { opacity: demo, transform: [{ scale: demo }] } : null,
                  ]}
                />
              </View>
              <Text style={styles.title} numberOfLines={2}>
                {current.title}
              </Text>
              <Text style={styles.copy} numberOfLines={4}>
                {current.body}
              </Text>
              {page === 0 ? (
                <View style={styles.demoAction}>
                  <SecondaryButton label="SHOW TRIM" onPress={showTrim} accessibilityLabel="Show the trim animation" />
                </View>
              ) : null}
              {page === 1 ? (
                <Text style={styles.note} numberOfLines={2}>
                  Equal paths are checked up, right, down, then left.
                </Text>
              ) : null}
            </Animated.View>
          </RaisedPanel>

          <View style={styles.paging}>
            <PageControls
              page={page}
              pageCount={PAGES.length}
              onPrevious={() => setPage(p => Math.max(0, p - 1))}
              onNext={() => setPage(p => Math.min(PAGES.length - 1, p + 1))}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="GOT IT" Icon={Check} onPress={onDone} accessibilityLabel="Close help" />
        </View>
      </View>
    </GardenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { width: 48 },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
  },
  art: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 8,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  copy: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.4,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  demoAction: {
    marginTop: 12,
  },
  paging: {
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
  },
});

export default HelpScreen;
