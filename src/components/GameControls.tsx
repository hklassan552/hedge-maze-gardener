import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RotateCcw, Scissors, Undo2 } from 'lucide-react-native';
import theme from '../constants/theme';
import { PrimaryButton, SecondaryButton } from './Buttons';

/** Bottom action panel. The hint sits above the actions, never beneath them. */
function GameControls({
  statusText,
  canUndo,
  onUndo,
  onReset,
  onGo,
}: {
  statusText: string;
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  onGo: () => void;
}) {
  return (
    <LinearGradient
      colors={theme.gradients.panel}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.panel}>
      <Text style={styles.hint} numberOfLines={2}>
        {statusText}
      </Text>
      <View style={styles.row}>
        <SecondaryButton
          label="UNDO"
          Icon={Undo2}
          onPress={onUndo}
          disabled={!canUndo}
          accessibilityLabel="Undo the last trim"
          style={styles.half}
        />
        <SecondaryButton
          label="RESET"
          Icon={RotateCcw}
          onPress={onReset}
          accessibilityLabel="Reset this garden"
          style={styles.half}
        />
      </View>
      <PrimaryButton
        label="GO"
        Icon={Scissors}
        onPress={onGo}
        accessibilityLabel="Send the hedgehog along the open path"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  panel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopLeftRadius: theme.radius.panel,
    borderTopRightRadius: theme.radius.panel,
    borderTopWidth: 2,
    borderColor: theme.colors.ui.border,
  },
  hint: {
    minHeight: 20,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  half: {
    flex: 1,
  },
});

export default React.memo(GameControls);
