import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import type { RestauranteStackParamList } from '../navigation/types';
import { useRestaurantePedidoDetalheViewModel } from '../hooks/useRestaurantePedidoDetalheViewModel';
import { PedidoInfoRow } from '../components/pedido/PedidoInfoRow';
import { PedidoItensCard } from '../components/pedido/PedidoItensCard';
import {
  Card,
  ErrorBanner,
  PedidoTimeline,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  StatusChip,
  useThemeColors,
} from '../components/ui';
import { formatMetodoPagamento, formatStatusPagamento } from '../utils/pedidoStatus';
import { labelClientePedido } from '../utils/clientePedido';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<RestauranteStackParamList, 'RestaurantePedidoDetalhe'>;

export function RestaurantePedidoDetalheScreen({ navigation, route }: Props): React.JSX.Element {
  const { pedidoId } = route.params;
  const c = useThemeColors();
  const vm = useRestaurantePedidoDetalheViewModel(pedidoId);

  if (vm.loading) {
    return (
      <ScreenShell title="Pedido" onBack={() => navigation.goBack()} scroll={false}>
        <ActivityIndicator color={palette.primary} size="large" style={{ marginTop: 40 }} />
      </ScreenShell>
    );
  }

  if (!vm.pedido) {
    return (
      <ScreenShell title="Pedido" onBack={() => navigation.goBack()}>
        <ErrorBanner message={vm.error ?? 'Pedido não encontrado.'} />
      </ScreenShell>
    );
  }

  const p = vm.pedido;
  const podeConfirmar = p.status === 'CREATED';
  const podePreparar = p.status === 'CONFIRMED';
  const podeCancelar = p.status !== 'DELIVERED' && p.status !== 'CANCELED';
  const podeReembolsar = p.status === 'CANCELED' && vm.pagamento?.status === 'PAID';

  return (
    <ScreenShell title={`Pedido #${p.id}`} onBack={() => navigation.goBack()}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}

      <View style={styles.header}>
        <StatusChip status={p.status} />
        <Text style={{ color: c.sub, fontSize: 13, marginTop: spacing.sm }}>
          {new Date(p.criadoEm).toLocaleString('pt-BR')}
        </Text>
      </View>

      {p.status !== 'CANCELED' ? (
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={[styles.sec, { color: c.text }]}>Acompanhamento</Text>
          <PedidoTimeline status={p.status} compact />
        </Card>
      ) : null}

      <View style={{ marginTop: spacing.md }}>
        <PedidoItensCard pedido={p} />
      </View>

      <Card style={{ marginTop: spacing.md }}>
        <Text style={[styles.sec, { color: c.text }]}>Pagamento</Text>
        <PedidoInfoRow icon="payment" label="Forma de pagamento" value={formatMetodoPagamento(p.metodoPagamento)} />
        {p.metodoPagamento === 'CASH' && p.troco != null ? (
          <PedidoInfoRow
            icon="attach-money"
            label="Troco para"
            value={p.troco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          />
        ) : null}
        {vm.pagamento ? (
          <PedidoInfoRow icon="receipt" label="Status do pagamento" value={formatStatusPagamento(vm.pagamento.status)} />
        ) : null}
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text style={[styles.sec, { color: c.text }]}>Cliente e entrega</Text>
        <PedidoInfoRow
          icon="person"
          label="Cliente"
          value={labelClientePedido(p, vm.cliente)}
        />
        {p.enderecoEntrega ? (
          <PedidoInfoRow icon="location-on" label="Endereço de entrega" value={p.enderecoEntrega} />
        ) : null}
        {p.entregador ? (
          <PedidoInfoRow icon="delivery-dining" label="Entregador" value={p.entregador.nome} />
        ) : null}
        {p.tempoEstimadoEntrega ? (
          <PedidoInfoRow icon="schedule" label="Previsão" value={p.tempoEstimadoEntrega} />
        ) : null}
      </Card>

      {p.observacoes ? (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={[styles.sec, { color: c.text }]}>Observações</Text>
          <Text style={{ color: c.sub, lineHeight: 20 }}>{p.observacoes}</Text>
        </Card>
      ) : null}

      <View style={{ gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.xxl }}>
        {podeConfirmar ? (
          <PrimaryButton label="Confirmar pedido" onPress={() => void vm.confirmar()} loading={vm.busy} />
        ) : null}
        {podePreparar ? (
          <PrimaryButton label="Iniciar preparo" onPress={() => void vm.preparar()} loading={vm.busy} />
        ) : null}
        {podeReembolsar ? (
          <SecondaryButton
            label="Solicitar reembolso"
            onPress={() =>
              Alert.prompt('Solicitar reembolso', 'Informe o motivo do reembolso:', (motivo) => {
                if (motivo?.trim()) void vm.reembolsar(motivo.trim());
              })
            }
            disabled={vm.busy}
          />
        ) : null}
        {podeCancelar ? (
          <SecondaryButton
            label="Cancelar pedido"
            onPress={() =>
              Alert.alert('Cancelar pedido', 'Tem certeza que deseja cancelar este pedido?', [
                { text: 'Voltar', style: 'cancel' },
                { text: 'Cancelar pedido', style: 'destructive', onPress: () => void vm.cancelar() },
              ])
            }
            disabled={vm.busy}
          />
        ) : null}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'flex-start' },
  sec: { fontSize: 16, fontWeight: '800', marginBottom: spacing.md },
});
