import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { AdminStackParamList } from '../navigation/types';
import { useAdminPedidosAndamentoViewModel } from '../hooks/useAdminOpsViewModel';
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
import { resumoItensPedido } from '../utils/pedidoStatus';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminPedidosAndamento'>;

export function AdminPedidosAndamentoScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAdminPedidosAndamentoViewModel();

  return (
    <ScreenShell title="Pedidos em andamento" onBack={() => navigation.goBack()} scroll={false}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}
      {vm.loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={vm.pedidos}
          keyExtractor={(p) => String(p.id)}
          refreshControl={
            <RefreshControl refreshing={vm.loading} onRefresh={() => void vm.refresh()} tintColor={palette.primary} />
          }
          contentContainerStyle={vm.pedidos.length === 0 ? styles.empty : styles.list}
          ListEmptyComponent={
            <EmptyState icon="receipt-long" title="Nenhum pedido" subtitle="Não há pedidos em andamento no momento." />
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('AdminPedidoDetalhe', { pedidoId: item.id })}>
              <Card style={styles.card}>
                <View style={styles.top}>
                  <Text style={[styles.id, { color: c.text }]}>#{item.id}</Text>
                  <StatusChip status={item.status} />
                </View>
                <Text style={{ color: c.sub, fontSize: 13 }}>
                  {new Date(item.criadoEm).toLocaleString('pt-BR')}
                </Text>
                <Text style={{ color: c.text, fontSize: 14, marginTop: spacing.sm }} numberOfLines={2}>
                  {resumoItensPedido(item.itens)}
                </Text>
                {item.enderecoEntrega ? (
                  <Text style={{ color: c.sub, fontSize: 13, marginTop: spacing.sm }} numberOfLines={2}>
                    {item.enderecoEntrega}
                  </Text>
                ) : null}
                <View style={styles.bottom}>
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
  empty: { flexGrow: 1 },
  list: { paddingBottom: spacing.xxl },
  card: { marginBottom: spacing.md },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontSize: 17, fontWeight: '800' },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
