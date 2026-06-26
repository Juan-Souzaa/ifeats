import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from './useThemeColors';
import { palette } from '../../theme/colors';
import { PrimaryButton } from './PrimaryButton';
import { spacing } from '../../theme/spacing';

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconCircle, { backgroundColor: c.chipMutedBg }]}>
        <MaterialIcons name={icon} size={48} color={palette.primary} />
      </View>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.sub, { color: c.sub }]}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  sub: { fontSize: 14, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
  action: { marginTop: spacing.xl, width: '100%', maxWidth: 280 },
});
