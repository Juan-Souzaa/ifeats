import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { palette } from '../../theme/colors';
import { radius } from '../../theme/spacing';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, loading, disabled }: Props): React.JSX.Element {
  const off = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        styles.btn,
        off && styles.btnOff,
        pressed && !off && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.white} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnOff: { opacity: 0.5 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  label: { color: palette.white, fontSize: 16, fontWeight: '800' },
});
