import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { palette } from '../../theme/colors';
import { useThemeColors } from './useThemeColors';
import { radius } from '../../theme/spacing';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function SecondaryButton({ label, onPress, loading, disabled }: Props): React.JSX.Element {
  const c = useThemeColors();
  const off = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        styles.btn,
        { borderColor: c.border, backgroundColor: c.chipMutedBg },
        off && styles.btnOff,
        pressed && !off && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.primary} />
      ) : (
        <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnOff: { opacity: 0.5 },
  pressed: { opacity: 0.88 },
  label: { fontSize: 15, fontWeight: '700' },
});
