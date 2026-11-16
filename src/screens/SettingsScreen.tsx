import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { IS_COMPACT } from '../constants/config';
import theme from '../constants/theme';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import GardenBackground from '../components/GardenBackground';
import RaisedPanel from '../components/RaisedPanel';
import ScreenHeader from '../components/ScreenHeader';
import SettingsRow from '../components/SettingsRow';
import type { Preferences } from '../game/progressStore';

/** Audio, motion and the guarded progress reset. No permissions or links. */
function SettingsScreen({
  preferences,
  onChange,
  onReset,
  onDone,
}: {
  preferences: Preferences;
  onChange: (patch: Partial<Preferences>) => void;
  onReset: () => void;
  onDone: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <GardenBackground variant="support">
      <View style={styles.root}>
        <ScreenHeader
          title="Settings"
          leftSlot={<SecondaryButton label="BACK" small onPress={onDone} accessibilityLabel="Go back" style={styles.back} />}
        />

        <View style={styles.body}>
          <RaisedPanel compact={IS_COMPACT} style={styles.card}>
            <SettingsRow
              label="Music"
              description="Quiet garden loop at 20%"
              value={preferences.music}
              onToggle={next => onChange({ music: next })}
            />
            <SettingsRow
              label="Sound effects"
              description="Snips, chimes and arrivals at 35%"
              value={preferences.sound}
              onToggle={next => onChange({ sound: next })}
            />
            <SettingsRow
              label="Reduced motion"
              description="Fades instead of travel and particles"
              value={preferences.reducedMotion}
              onToggle={next => onChange({ reducedMotion: next })}
            />
          </RaisedPanel>

          <RaisedPanel compact={IS_COMPACT} style={styles.card}>
            <Text style={styles.resetTitle}>Reset garden progress</Text>
            <Text style={styles.resetBody} numberOfLines={3}>
              Clears completed gardens, best scores, petals and saved trims. Audio and motion
              choices are kept.
            </Text>
            <View style={styles.resetAction}>
              <SecondaryButton
                label="RESET PROGRESS"
                onPress={() => setConfirming(true)}
                accessibilityLabel="Reset all garden progress"
              />
            </View>
          </RaisedPanel>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="DONE" Icon={Check} onPress={onDone} accessibilityLabel="Return to the garden gate" />
        </View>

        <Modal visible={confirming} transparent animationType="fade" onRequestClose={() => setConfirming(false)}>
          <View style={styles.backdrop}>
            <RaisedPanel style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>Reset all gardens and flowers?</Text>
              <Text style={styles.confirmBody} numberOfLines={3}>
                This clears completed gardens, best scores, petals and saved trims.
              </Text>
              <View style={styles.confirmActions}>
                <PrimaryButton
                  label="KEEP MY GARDEN"
                  onPress={() => setConfirming(false)}
                  accessibilityLabel="Keep my garden progress"
                />
                <View style={styles.confirmGap} />
                <SecondaryButton
                  label="RESET EVERYTHING"
                  onPress={() => {
                    setConfirming(false);
                    onReset();
                  }}
                  accessibilityLabel="Reset everything"
                />
              </View>
            </RaisedPanel>
          </View>
        </Modal>
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
  },
  card: {
    width: '100%',
    marginBottom: 14,
  },
  resetTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  resetBody: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  resetAction: {
    marginTop: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(19, 34, 16, 0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 360,
  },
  confirmTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  confirmBody: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  confirmActions: {
    marginTop: 16,
  },
  confirmGap: {
    height: 10,
  },
});

export default SettingsScreen;
