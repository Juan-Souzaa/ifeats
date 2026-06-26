import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../../theme/spacing';
import { useThemeColors } from './useThemeColors';

type Props = {
  label: string;
  hint?: string;
  children: ReactNode;
  style?: object;
};

export function FormField({ label, hint, children, style }: Props): React.JSX.Element {
  const c = useThemeColors();
  return (
    <View style={[styles.wrap, style]}>
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      {children}
      {hint ? <Text style={[styles.hint, { color: c.muted }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '700', marginBottom: spacing.sm },
  hint: { fontSize: 12, marginTop: spacing.xs },
});
