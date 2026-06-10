import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { AdminStackParamList } from '../navigation/types';
import { useAdminReembolsoViewModel } from '../hooks/useAdminOpsViewModel';
import {
  Card,
  ErrorBanner,
  MoneyText,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  useThemeColors,
} from '../components/ui';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminReembolso'>;

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  AUTHORIZED: 'Autorizado',
  PAID: 'Pago',
  CANCELED: 'Cancelado',
  REFUSED: 'Recusado',
  REFUNDED: 'Reembolsado',
};

export function AdminReembolsoScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAdminReembolsoViewModel();

  return (
    <ScreenShell title="Reembolsos" onBack={() => navigation.goBack()}>
      <Text style={[styles.hint, { color: c.sub }]}>
        Informe o ID do pedido cancelado com pagamento confirmado para solicitar o reembolso.
      </Text>

      {vm.error ? <ErrorBanner message={vm.error} /> : null}
      {vm.successMessage ? (
        <Text style={[styles.ok, { color: '#15803d' }]}>{vm.successMessage}</Text>
      ) : null}

      <Card>
        <Text style={[styles.label, { color: c.text }]}>ID do pedido</Text>
        <TextInput
          value={vm.pedidoId}
          onChangeText={vm.setPedidoId}
          placeholder="Ex: 123"
          placeholderTextColor={c.muted}
          keyboardType="number-pad"
          style={[styles.input, { borderColor: c.border, color: c.text, backgroundColor: c.inputBg }]}
        />
        <SecondaryButton
          label="Consultar pagamento"
          onPress={() => void vm.consultarPagamento()}
          loading={vm.loadingPagamento}
          disabled={vm.submitting}
        />
      </Card>

      {vm.pagamento ? (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={[styles.label, { color: c.text }]}>Pagamento do pedido #{vm.pagamento.pedidoId}</Text>
          <View style={styles.payRow}>
            <Text style={{ color: c.sub }}>Status</Text>
            <Text style={{ color: c.text, fontWeight: '700' }}>
              {STATUS_LABELS[vm.pagamento.status] ?? vm.pagamento.status}
            </Text>
          </View>
          <View style={styles.payRow}>
            <Text style={{ color: c.sub }}>Valor</Text>
            <MoneyText value={vm.pagamento.valor} />
          </View>
          {vm.pagamento.status === 'REFUNDED' && vm.pagamento.valorReembolsado != null ? (
            <View style={styles.payRow}>
              <Text style={{ color: c.sub }}>Reembolsado em</Text>
              <Text style={{ color: c.text, fontWeight: '600', fontSize: 13 }}>
                {vm.pagamento.dataReembolso
                  ? new Date(vm.pagamento.dataReembolso).toLocaleString('pt-BR')
                  : '—'}
              </Text>
            </View>
          ) : null}
        </Card>
      ) : null}

      <Card style={{ marginTop: spacing.md }}>
        <Text style={[styles.label, { color: c.text }]}>Motivo do reembolso</Text>
        <TextInput
          value={vm.motivo}
          onChangeText={vm.setMotivo}
          placeholder="Descreva o motivo..."
          placeholderTextColor={c.muted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[
            styles.input,
            styles.textArea,
            { borderColor: c.border, color: c.text, backgroundColor: c.inputBg },
          ]}
        />
        <PrimaryButton
          label="Solicitar reembolso"
          onPress={() => void vm.solicitar()}
          loading={vm.submitting}
          disabled={vm.loadingPagamento}
        />
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  label: { fontSize: 15, fontWeight: '700', marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    marginBottom: spacing.md,
  },
  textArea: { minHeight: 100 },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ok: { fontSize: 14, fontWeight: '600', marginBottom: spacing.md },
});
