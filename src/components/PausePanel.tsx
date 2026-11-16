import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { HelpCircle, Home, Play } from 'lucide-react-native';
import theme from '../constants/theme';
import { PrimaryButton, SecondaryButton } from './Buttons';
import RaisedPanel from './RaisedPanel';

/** Pause modal shared by the editing board and the walk. */
function PausePanel({
  visible,
  mode,
  onResume,
  onHelp,
  onMenu,
}: {
  visible: boolean;
  mode: 'edit' | 'walk';
  onResume: () => void;
  onHelp: () => void;
  onMenu: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onResume}>
      <View style={styles.backdrop}>
        <RaisedPanel style={styles.card}>
          <Text style={styles.title}>Paused</Text>
          <Text style={styles.body}>
            {mode === 'walk'
              ? 'The hedgehog is waiting where it stopped.'
              : 'Your trimmed garden is kept exactly as it is.'}
          </Text>
          <View style={styles.actions}>
            <PrimaryButton label="RESUME" Icon={Play} onPress={onResume} accessibilityLabel="Resume the garden" />
            <View style={styles.spacer} />
            <SecondaryButton label="HELP" Icon={HelpCircle} onPress={onHelp} accessibilityLabel="Open help" />
            <View style={styles.spacer} />
            <SecondaryButton
              label="GARDEN GATE"
              Icon={Home}
              onPress={onMenu}
              accessibilityLabel="Return to the garden gate"
            />
          </View>
        </RaisedPanel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(19, 34, 16, 0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    lineHeight: theme.typography.title.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  body: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  actions: {
    marginTop: 16,
  },
  spacer: {
    height: 10,
  },
});

export default React.memo(PausePanel);
