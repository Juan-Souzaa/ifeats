import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import type { FiltroModeracao } from '../../hooks/useAdminCatalogoViewModel';
import { useThemeColors } from '../ui';
import { palette } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';

const OPCOES: { id: FiltroModeracao; label: string }[] = [
  { id: 'ALL', label: 'Todos' },
  { id: 'APPROVED', label: 'Aprovados' },
  { id: 'PENDING_APPROVAL', label: 'Pendentes' },
  { id: 'REJECTED', label: 'Rejeitados' },
];

type Props = {
  value: FiltroModeracao;
  onChange: (value: FiltroModeracao) => void;
};

export function ModeracaoFiltroChips({ value, onChange }: Props): React.JSX.Element {
  const c = useThemeColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.wrap}
    >
      {OPCOES.map((op) => {
        const active = value === op.id;
        return (
          <Pressable
            key={op.id}
            onPress={() => onChange(op.id)}
            style={[
              styles.chip,
              { backgroundColor: active ? palette.primary : c.chipMutedBg },
            ]}
          >
            <Text style={[styles.text, { color: active ? '#fff' : c.text }]}>{op.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md, flexGrow: 0 },
  row: { gap: spacing.sm, paddingVertical: 2 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  text: { fontSize: 13, fontWeight: '700' },
});
