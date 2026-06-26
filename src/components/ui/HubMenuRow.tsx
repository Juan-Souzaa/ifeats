import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { useThemeColors } from './useThemeColors';

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

export function HubMenuRow({ icon, label, onPress }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: c.shell, borderColor: c.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: c.chipMutedBg }]}>
        <MaterialIcons name={icon} size={22} color={palette.primary} />
      </View>
      <Text style={[styles.label, { color: c.text }]} numberOfLines={1}>
        {label}
      </Text>
      <MaterialIcons name="chevron-right" size={22} color={c.muted} />
    </Pressable>
  );
}

export function HubSectionTitle({ children }: { children: string }): React.JSX.Element {
  const c = useThemeColors();
  return <Text style={[styles.section, { color: c.sub }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  section: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: 16, fontWeight: '600' },
});
