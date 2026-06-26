import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ClientePedidosStackParamList } from '../navigation/types';
import type { StatusPedido } from '../types/api';
import { useClientePedidosViewModel } from '../hooks/useClientePedidosViewModel';
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
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<ClientePedidosStackParamList, 'ClientePedidos'>;

const FILTROS: { key: StatusPedido | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Todos' },
  { key: 'CREATED', label: 'Recebidos' },
  { key: 'PREPARING', label: 'Preparo' },
  { key: 'OUT_FOR_DELIVERY', label: 'A caminho' },
  { key: 'DELIVERED', label: 'Entregues' },
  { key: 'CANCELED', label: 'Cancelados' },
];

export function ClientePedidosScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useClientePedidosViewModel();

  return (
    <ScreenShell title="Meus pedidos" scroll={false}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {FILTROS.map((f) => {
          const on = vm.filtro === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => vm.setFiltro(f.key)}
              style={[
                styles.chip,
                { backgroundColor: on ? palette.primary : c.chipMutedBg },
              ]}
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
          contentContainerStyle={vm.pedidos.length === 0 ? styles.listEmpty : styles.list}
          refreshControl={
            <RefreshControl refreshing={vm.loading} onRefresh={() => void vm.refresh()} tintColor={palette.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="receipt-long"
              title="Nenhum pedido ainda"
              subtitle="Seus pedidos aparecerão aqui após finalizar uma compra."
            />
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('ClientePedidoDetalhe', { pedidoId: item.id })}>
              <Card style={styles.pedidoCard}>
                <View style={styles.pedidoTop}>
                  <Text style={[styles.pedidoId, { color: c.text }]}>Pedido #{item.id}</Text>
                  <StatusChip status={item.status} />
                </View>
                <Text style={{ color: c.sub, fontSize: 13, marginTop: spacing.xs }}>
                  {new Date(item.criadoEm).toLocaleString('pt-BR')}
                </Text>
                <View style={styles.pedidoBottom}>
                  <MoneyText value={item.total} accent />
                  <Text style={{ color: palette.primary, fontWeight: '700' }}>Ver detalhes</Text>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  chips: { maxHeight: 44, marginBottom: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, marginRight: spacing.sm },
  list: { paddingBottom: spacing.xxl },
  listEmpty: { flexGrow: 1 },
  pedidoCard: { marginBottom: spacing.md },
  pedidoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pedidoId: { fontSize: 16, fontWeight: '800' },
  pedidoBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
});
