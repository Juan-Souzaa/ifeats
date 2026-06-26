import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { AdminStackParamList } from '../navigation/types';
import { useAdminRestaurantesListViewModel } from '../hooks/useAdminCatalogoViewModel';
import { AtivoBadge } from '../components/admin/AtivoBadge';
import { ModeracaoFiltroChips } from '../components/admin/ModeracaoFiltroChips';
import {
  Card,
  EmptyState,
  ErrorBanner,
  ModeracaoStatusChip,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SkeletonList,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminRestaurantes'>;

function confirmarDesativacao(nome: string, onConfirm: () => void): void {
  Alert.alert(
    'Desativar restaurante',
    `Deseja desativar ${nome}? Ele deixará de aparecer para os clientes. Pedidos em andamento ou pratos ativos impedem a desativação.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Desativar', style: 'destructive', onPress: onConfirm },
    ]
  );
}

function restauranteAtivo(ativo: boolean | undefined): boolean {
  return ativo !== false;
}

export function AdminRestaurantesScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAdminRestaurantesListViewModel();

  return (
    <ScreenShell title="Restaurantes" onBack={() => navigation.goBack()} scroll={false}>
      <ModeracaoFiltroChips value={vm.filtro} onChange={vm.setFiltro} />
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}
      {vm.loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={vm.items}
          keyExtractor={(r) => String(r.id)}
          refreshControl={
            <RefreshControl refreshing={vm.loading} onRefresh={() => void vm.refresh()} tintColor={palette.primary} />
          }
          contentContainerStyle={vm.items.length === 0 ? styles.empty : styles.list}
          ListEmptyComponent={
            <EmptyState icon="restaurant" title="Nenhum restaurante" subtitle="Não há registros para este filtro." />
          }
          renderItem={({ item }) => {
            const ativo = restauranteAtivo(item.ativo);
            return (
              <Card style={styles.card}>
                <View style={styles.header}>
                  <Text style={[styles.nome, { color: c.text }]}>{item.nome}</Text>
                  <View style={styles.badges}>
                    <ModeracaoStatusChip status={item.status} />
                    {!ativo ? <AtivoBadge ativo={false} /> : null}
                  </View>
                </View>
                <Text style={{ color: c.sub, fontSize: 13 }}>{item.email}</Text>
                <Text style={{ color: c.sub, fontSize: 13 }}>{item.telefone}</Text>
                <Text style={{ color: c.muted, fontSize: 12, marginTop: spacing.xs }} numberOfLines={2}>
                  {item.endereco}
                </Text>
                {item.status === 'PENDING_APPROVAL' ? (
                  <View style={styles.actions}>
                    <PrimaryButton
                      label="Aprovar"
                      onPress={() => void vm.aprovar(item.id)}
                      loading={vm.busyId === item.id}
                      disabled={vm.busyId != null && vm.busyId !== item.id}
                    />
                    <SecondaryButton
                      label="Rejeitar"
                      onPress={() => void vm.rejeitar(item.id)}
                      disabled={vm.busyId != null}
                    />
                  </View>
                ) : null}
                {item.status === 'APPROVED' && ativo ? (
                  <View style={styles.actions}>
                    <SecondaryButton
                      label="Desativar"
                      onPress={() => confirmarDesativacao(item.nome, () => void vm.desativar(item.id))}
                      disabled={vm.busyId != null}
                    />
                  </View>
                ) : null}
              </Card>
            );
          }}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  empty: { flexGrow: 1 },
  list: { paddingBottom: spacing.xxl },
  card: { marginBottom: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  badges: { alignItems: 'flex-end', gap: spacing.xs },
  nome: { fontSize: 17, fontWeight: '800', flex: 1 },
  actions: { marginTop: spacing.md, gap: spacing.sm },
});
