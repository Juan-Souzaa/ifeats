import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { EntregadorPedidoModo, EntregadorStackParamList } from '../navigation/types';
import { useEntregadorPedidosViewModel } from '../hooks/useEntregadorPedidosViewModel';
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

type Props = NativeStackScreenProps<EntregadorStackParamList, 'EntregadorArea'>;

const TABS = [
  { key: 'disponiveis' as const, label: 'Disponíveis' },
  { key: 'ativas' as const, label: 'Em rota' },
  { key: 'historico' as const, label: 'Histórico' },
];

const TAB_TO_MODO: Record<'disponiveis' | 'ativas' | 'historico', EntregadorPedidoModo> = {
  disponiveis: 'disponivel',
  ativas: 'ativa',
  historico: 'historico',
};

export function EntregadorAreaScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useEntregadorPedidosViewModel();

  return (
    <ScreenShell title="Entregas" scroll={false} onBack={() => navigation.goBack()}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}

      <View style={styles.tabs}>
        {TABS.map((t) => {
          const on = vm.tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => vm.setTab(t.key)}
              style={[styles.tab, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
            >
              <Text style={{ color: on ? palette.white : c.text, fontWeight: '700', fontSize: 12 }}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {vm.loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          style={styles.flex}
          data={vm.lista}
          keyExtractor={(p) => String(p.id)}
          refreshControl={
            <RefreshControl refreshing={vm.loading} onRefresh={() => void vm.refresh()} tintColor={palette.primary} />
          }
          contentContainerStyle={vm.lista.length === 0 ? styles.empty : styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="delivery-dining"
              title={
                vm.tab === 'disponiveis'
                  ? 'Nenhum pedido disponível'
                  : vm.tab === 'ativas'
                    ? 'Nenhuma entrega em rota'
                    : 'Nenhuma entrega no histórico'
              }
              subtitle="Atualize para ver novos pedidos."
            />
          }
          renderItem={({ item }) => {
            const qtdItens = contagemItensPedido(item.itens);
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate('EntregadorPedidoDetalhe', {
                    pedidoId: item.id,
                    modo: TAB_TO_MODO[vm.tab],
                  })
                }
              >
                <Card style={styles.card}>
                  <View style={styles.top}>
                    <Text style={[styles.id, { color: c.text }]}>Pedido #{item.id}</Text>
                    <StatusChip status={item.status} />
                  </View>
                  <Text style={{ color: c.sub, fontSize: 13, marginTop: spacing.xs }}>
                    {new Date(item.criadoEm).toLocaleString('pt-BR')}
                  </Text>
                  <Text style={{ color: c.text, fontSize: 14, marginTop: spacing.sm }} numberOfLines={2}>
                    {resumoItensPedido(item.itens)}
                  </Text>
                  {item.enderecoEntrega ? (
                    <Text style={{ color: c.muted, fontSize: 12, marginTop: 4 }} numberOfLines={2}>
                      {item.enderecoEntrega}
                    </Text>
                  ) : null}
                  <View style={styles.bottom}>
                    <Text style={{ color: c.muted, fontSize: 12 }}>
                      {qtdItens} {qtdItens === 1 ? 'item' : 'itens'}
                    </Text>
                    <View style={styles.bottomRight}>
                      <MoneyText value={item.total} accent />
                      <Text style={{ color: palette.primary, fontWeight: '700', marginTop: 4 }}>Ver detalhes</Text>
                    </View>
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
  tabs: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  list: { paddingBottom: spacing.xxl },
  empty: { flexGrow: 1 },
  card: { marginBottom: spacing.md },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontSize: 16, fontWeight: '800' },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.md,
  },
  bottomRight: { alignItems: 'flex-end' },
});
