import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ClienteStackParamList } from '../navigation/types';
import type { PrioridadeTicket, TipoTicket } from '../types/api';
import { useClienteTicketCriarViewModel } from '../hooks/useClienteTicketCriarViewModel';
import { Card, ErrorBanner, PrimaryButton, ScreenShell, useThemeColors } from '../components/ui';
import { formatPrioridadeTicket, formatTipoTicket } from '../utils/ticketStatus';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<ClienteStackParamList, 'ClienteTicketCriar'>;

const TIPOS: TipoTicket[] = ['RECLAMACAO', 'SUPORTE_TECNICO', 'SUGESTAO'];
const PRIORIDADES: PrioridadeTicket[] = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

export function ClienteTicketCriarScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useClienteTicketCriarViewModel();

  return (
    <ScreenShell title="Novo ticket" onBack={() => navigation.goBack()}>
      {vm.error ? <ErrorBanner message={vm.error} /> : null}
      <Card>
        <Field label="Título" value={vm.titulo} onChangeText={vm.setTitulo} color={c} />
        <Field
          label="Descrição"
          value={vm.descricao}
          onChangeText={vm.setDescricao}
          multiline
          color={c}
        />
        <Text style={[styles.label, { color: c.sub }]}>Tipo</Text>
        <View style={styles.chips}>
          {TIPOS.map((t) => (
            <Chip
              key={t}
              label={formatTipoTicket(t)}
              selected={vm.tipo === t}
              onPress={() => vm.setTipo(t)}
            />
          ))}
        </View>
        <Text style={[styles.label, { color: c.sub, marginTop: spacing.md }]}>Prioridade</Text>
        <View style={styles.chips}>
          {PRIORIDADES.map((p) => (
            <Chip
              key={p}
              label={formatPrioridadeTicket(p)}
              selected={vm.prioridade === p}
              onPress={() => vm.setPrioridade(p)}
            />
          ))}
        </View>
      </Card>
      <View style={{ marginTop: spacing.lg }}>
        <PrimaryButton
          label="Abrir ticket"
          loading={vm.submitting}
          onPress={async () => {
            const id = await vm.criar();
            if (id) navigation.replace('ClienteTicketDetalhe', { ticketId: id });
          }}
        />
      </View>
    </ScreenShell>
  );
}

function Field({
  label,
  value,
  onChangeText,
  color,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  color: ReturnType<typeof useThemeColors>;
} & React.ComponentProps<typeof TextInput>): React.JSX.Element {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: color.sub }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={color.muted}
        style={[styles.input, { borderColor: color.border, color: color.text }]}
        {...rest}
      />
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}): React.JSX.Element {
  const c = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? 'rgba(236,73,19,0.15)' : c.border },
      ]}
    >
      <Text
        style={{
          color: selected ? palette.primary : c.sub,
          fontSize: 12,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: spacing.sm },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, minHeight: 44 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
});
