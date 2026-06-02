import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { AdminStackParamList } from '../navigation/types';
import { useAdminPedidoDetalheViewModel } from '../hooks/useAdminPedidoDetalheViewModel';
import { PedidoInfoRow } from '../components/pedido/PedidoInfoRow';
import { PedidoItensCard } from '../components/pedido/PedidoItensCard';
import {
  Card,
  ErrorBanner,
  PedidoTimeline,
  ScreenShell,
  StatusChip,
  useThemeColors,
} from '../components/ui';
import { formatMetodoPagamento, formatStatusPagamento } from '../utils/pedidoStatus';
import { labelClientePedido } from '../utils/clientePedido';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminPedidoDetalhe'>;

export function AdminPedidoDetalheScreen({ navigation, route }: Props): React.JSX.Element {
  const { pedidoId } = route.params;
  const c = useThemeColors();
  const vm = useAdminPedidoDetalheViewModel(pedidoId);

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
        {vm.pagamento ? (
          <PedidoInfoRow icon="receipt" label="Status do pagamento" value={formatStatusPagamento(vm.pagamento.status)} />
        ) : null}
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text style={[styles.sec, { color: c.text }]}>Participantes</Text>
        <PedidoInfoRow
          icon="person"
          label="Cliente"
          value={labelClientePedido(p, vm.cliente)}
        />
        <PedidoInfoRow icon="store" label="Restaurante" value={`#${p.restauranteId}`} />
        {p.entregador ? (
          <PedidoInfoRow icon="delivery-dining" label="Entregador" value={p.entregador.nome} />
        ) : null}
        {p.enderecoEntrega ? (
          <PedidoInfoRow icon="location-on" label="Endereço de entrega" value={p.enderecoEntrega} />
        ) : null}
      </Card>

      {p.observacoes ? (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={[styles.sec, { color: c.text }]}>Observações</Text>
          <Text style={{ color: c.sub, lineHeight: 20 }}>{p.observacoes}</Text>
        </Card>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'flex-start' },
  sec: { fontSize: 16, fontWeight: '800', marginBottom: spacing.md },
});
