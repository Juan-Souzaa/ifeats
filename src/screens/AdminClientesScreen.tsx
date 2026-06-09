import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { AdminStackParamList } from '../navigation/types';
import { useAdminClientesListViewModel } from '../hooks/useAdminCatalogoViewModel';
import { AtivoBadge } from '../components/admin/AtivoBadge';
import {
  Card,
  EmptyState,
  ErrorBanner,
  ScreenShell,
  SecondaryButton,
  SkeletonList,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminClientes'>;

function confirmarDesativacao(nome: string, onConfirm: () => void): void {
  Alert.alert(
    'Desativar cliente',
    `Deseja desativar o cadastro de ${nome}? O cliente não poderá mais usar a plataforma.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Desativar', style: 'destructive', onPress: onConfirm },
    ]
  );
}

export function AdminClientesScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAdminClientesListViewModel();

  return (
    <ScreenShell title="Clientes" onBack={() => navigation.goBack()} scroll={false}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}
      {vm.loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={vm.items}
          keyExtractor={(cliente) => String(cliente.id)}
          refreshControl={
            <RefreshControl refreshing={vm.loading} onRefresh={() => void vm.refresh()} tintColor={palette.primary} />
          }
          contentContainerStyle={vm.items.length === 0 ? styles.empty : styles.list}
          ListEmptyComponent={
            <EmptyState icon="people" title="Nenhum cliente" subtitle="Não há clientes cadastrados na plataforma." />
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.header}>
                <Text style={[styles.nome, { color: c.text }]}>{item.nome}</Text>
                <AtivoBadge ativo={item.ativo} />
              </View>
              <Text style={{ color: c.sub, fontSize: 13 }}>{item.email}</Text>
              <Text style={{ color: c.sub, fontSize: 13 }}>{item.telefone}</Text>
              {item.endereco ? (
                <Text style={{ color: c.muted, fontSize: 12, marginTop: spacing.xs }} numberOfLines={2}>
                  {item.endereco}
                </Text>
              ) : null}
              {item.ativo ? (
                <View style={styles.actions}>
                  <SecondaryButton
                    label="Desativar"
                    onPress={() => confirmarDesativacao(item.nome, () => void vm.desativar(item.id))}
                    disabled={vm.busyId != null}
                  />
                </View>
              ) : null}
            </Card>
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  nome: { fontSize: 17, fontWeight: '800', flex: 1 },
  actions: { marginTop: spacing.md },
});
