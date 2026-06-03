import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { ClientePedidosStackParamList } from '../navigation/types';
import { useClientePedidoDetalheViewModel } from '../hooks/useClientePedidoDetalheViewModel';
import {
  Card,
  ErrorBanner,
  MoneyText,
  PedidoTimeline,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  StatusChip,
  useThemeColors,
} from '../components/ui';
import { timelineIndex } from '../utils/pedidoStatus';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<ClientePedidosStackParamList, 'ClientePedidoDetalhe'>;

export function ClientePedidoDetalheScreen({ navigation, route }: Props): React.JSX.Element {
  const { pedidoId } = route.params;
  const c = useThemeColors();
  const vm = useClientePedidoDetalheViewModel(pedidoId);

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
  const idx = timelineIndex(p.status);
  const podeCancelar = p.status === 'CREATED' || p.status === 'CONFIRMED';
  const podeRastrear = p.status === 'OUT_FOR_DELIVERY';
  const podeAvaliar = p.status === 'DELIVERED' && !vm.avaliacao;

  return (
    <ScreenShell title={`Pedido #${p.id}`} onBack={() => navigation.goBack()}>
      {vm.error ? <ErrorBanner message={vm.error} /> : null}
      <StatusChip status={p.status} />

      {p.status !== 'CANCELED' ? (
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={[styles.sec, { color: c.text }]}>Acompanhamento</Text>
          <PedidoTimeline status={p.status} compact />
        </Card>
      ) : null}

      <Card style={{ marginTop: spacing.md }}>
        <Text style={[styles.sec, { color: c.text }]}>Itens</Text>
        {p.itens?.map((i) => (
          <View key={i.id} style={styles.itemRow}>
            <Text style={{ color: c.text, flex: 1 }}>
              {i.quantidade}x {i.pratoNome}
            </Text>
            <MoneyText value={i.subtotal} />
          </View>
        ))}
        <View style={[styles.divider, { backgroundColor: c.border }]} />
        <View style={styles.itemRow}>
          <Text style={{ color: c.sub }}>Taxa entrega</Text>
          <MoneyText value={p.taxaEntrega} />
        </View>
        <View style={styles.itemRow}>
          <Text style={{ color: c.text, fontWeight: '800' }}>Total</Text>
          <MoneyText value={p.total} accent />
        </View>
      </Card>

      {p.enderecoEntrega ? (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={[styles.sec, { color: c.text }]}>Entrega</Text>
          <Text style={{ color: c.sub, lineHeight: 20 }}>{p.enderecoEntrega}</Text>
        </Card>
      ) : null}

      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
        {podeRastrear ? (
          <PrimaryButton
            label="Rastrear entrega"
            onPress={() => navigation.navigate('ClienteRastreamento', { pedidoId: p.id })}
          />
        ) : null}
        {podeAvaliar ? (
          <PrimaryButton
            label="Avaliar pedido"
            onPress={() =>
              navigation.navigate('ClienteAvaliarPedido', {
                pedidoId: p.id,
                restauranteId: p.restauranteId,
              })
            }
          />
        ) : null}
        {vm.avaliacao ? (
          <Card>
            <Text style={{ color: c.success, fontWeight: '700' }}>Você já avaliou este pedido</Text>
            <View style={{ marginTop: spacing.sm }}>
              <SecondaryButton
                label="Editar avaliação"
                onPress={() =>
                  navigation.navigate('ClienteAvaliarPedido', {
                    pedidoId: p.id,
                    restauranteId: p.restauranteId,
                    avaliacaoId: vm.avaliacao!.id,
                  })
                }
              />
            </View>
          </Card>
        ) : null}
        {podeCancelar ? (
          <SecondaryButton label="Cancelar pedido" onPress={() => void vm.cancelar()} disabled={vm.busy} />
        ) : null}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sec: { fontSize: 16, fontWeight: '800', marginBottom: spacing.md },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  divider: { height: 1, marginVertical: spacing.md },
});
