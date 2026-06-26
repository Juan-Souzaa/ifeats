import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RestauranteStackParamList } from '../navigation/types';
import type { StatusPedido } from '../types/api';
import { useRestaurantePedidosViewModel } from '../hooks/useRestaurantePedidosViewModel';
import {
  Card,
  EmptyState,
  ErrorBanner,
  MoneyText,
  ScreenShell,
  SkeletonList,
  StatusChip,
  useThemeColors,
} from '../components/ui';
import { contagemItensPedido, resumoItensPedido } from '../utils/pedidoStatus';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<RestauranteStackParamList, 'RestaurantePedidos'>;

const FILTROS: { key: StatusPedido | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Todos' },
  { key: 'CREATED', label: 'Novos' },
  { key: 'CONFIRMED', label: 'Confirmados' },
  { key: 'PREPARING', label: 'Preparo' },
  { key: 'OUT_FOR_DELIVERY', label: 'A caminho' },
  { key: 'DELIVERED', label: 'Entregues' },
  { key: 'CANCELED', label: 'Cancelados' },
];

export function RestaurantePedidosScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useRestaurantePedidosViewModel();

  return (
    <ScreenShell title="Pedidos" onBack={() => navigation.goBack()} scroll={false}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {FILTROS.map((f) => {
          const on = vm.filtro === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => vm.setFiltro(f.key)}
              style={[styles.chip, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
            >
              <Text style={{ color: on ? palette.white : c.text, fontWeight: '700', fontSize: 13 }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}

      {vm.loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          style={styles.flex}
          data={vm.pedidos}
          keyExtractor={(p) => String(p.id)}
          refreshControl={
            <RefreshControl refreshing={vm.loading} onRefresh={() => void vm.refresh()} tintColor={palette.primary} />
          }
          contentContainerStyle={vm.pedidos.length === 0 ? styles.empty : styles.list}
          ListEmptyComponent={
            <EmptyState icon="receipt-long" title="Nenhum pedido" subtitle="Novos pedidos aparecerão aqui." />
          }
          renderItem={({ item }) => {
            const qtdItens = contagemItensPedido(item.itens);
            const isNovo = item.status === 'CREATED';
            return (
              <Pressable
                onPress={() => navigation.navigate('RestaurantePedidoDetalhe', { pedidoId: item.id })}
              >
                <Card style={[styles.card, isNovo && styles.cardNovo]}>
                  <View style={styles.top}>
                    <View style={styles.topLeft}>
                      <Text style={[styles.id, { color: c.text }]}>#{item.id}</Text>
                      {isNovo ? (
                        <View style={styles.novoBadge}>
                          <Text style={styles.novoText}>Novo</Text>
                        </View>
                      ) : null}
                    </View>
                    <StatusChip status={item.status} />
                  </View>
                  <Text style={{ color: c.sub, fontSize: 13, marginTop: spacing.xs }}>
                    {new Date(item.criadoEm).toLocaleString('pt-BR')}
                  </Text>
                  <Text style={{ color: c.text, fontSize: 14, marginTop: spacing.sm }} numberOfLines={2}>
                    {resumoItensPedido(item.itens)}
                  </Text>
                  <Text style={{ color: c.muted, fontSize: 12, marginTop: 4 }}>
                    {qtdItens} {qtdItens === 1 ? 'item' : 'itens'}
                    {item.enderecoEntrega ? ' · entrega' : ''}
                  </Text>
                  <View style={styles.bottom}>
                    <MoneyText value={item.total} accent />
                    <Text style={{ color: palette.primary, fontWeight: '700' }}>Ver detalhes</Text>
                  </View>
                </Card>
              </Pressable>
            );
          }}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  chips: { marginBottom: spacing.md, flexGrow: 0 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  list: { paddingBottom: spacing.xxl },
  empty: { flexGrow: 1 },
  card: { marginBottom: spacing.md },
  cardNovo: { borderWidth: 1, borderColor: 'rgba(37,99,235,0.25)' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  id: { fontSize: 17, fontWeight: '800' },
  novoBadge: {
    backgroundColor: 'rgba(37,99,235,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  novoText: { color: '#2563eb', fontSize: 11, fontWeight: '800' },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
