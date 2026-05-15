import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from './useThemeColors';
import { spacing, radius } from '../../theme/spacing';

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorBanner({ message, onRetry }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <View style={[styles.banner, { backgroundColor: c.errorBg, borderColor: c.error }]}>
      <MaterialIcons name="error-outline" size={22} color={c.error} />
      <Text style={[styles.text, { color: c.error, flex: 1 }]}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} hitSlop={8}>
          <Text style={[styles.retry, { color: c.error }]}>Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  text: { fontSize: 14, lineHeight: 20 },
  retry: { fontSize: 13, fontWeight: '700' },
});
