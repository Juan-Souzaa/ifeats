import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { AdminStackParamList } from '../navigation/types';
import { useAdminEntregadoresPendentesViewModel } from '../hooks/useAdminModeracaoViewModel';
import {
  Card,
  EmptyState,
  ErrorBanner,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SkeletonList,
  useThemeColors,
} from '../components/ui';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminEntregadoresPendentes'>;

export function AdminEntregadoresPendentesScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAdminEntregadoresPendentesViewModel();

  return (
    <ScreenShell title="Entregadores pendentes" onBack={() => navigation.goBack()} scroll={false}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}
      {vm.loading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={vm.items}
          keyExtractor={(e) => String(e.id)}
          refreshControl={
            <RefreshControl refreshing={vm.loading} onRefresh={() => void vm.refresh()} tintColor={palette.primary} />
          }
          contentContainerStyle={vm.items.length === 0 ? styles.empty : styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="delivery-dining"
              title="Nenhum pendente"
              subtitle="Não há entregadores aguardando aprovação."
            />
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={[styles.nome, { color: c.text }]}>{item.nome}</Text>
              <Text style={{ color: c.sub, fontSize: 13 }}>{item.email}</Text>
              <Text style={{ color: c.sub, fontSize: 13 }}>{item.telefone}</Text>
              <Text style={{ color: c.muted, fontSize: 12, marginTop: spacing.xs }}>
                {item.tipoVeiculo} · {item.placaVeiculo}
              </Text>
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
  nome: { fontSize: 17, fontWeight: '800', marginBottom: spacing.xs },
  actions: { marginTop: spacing.md, gap: spacing.sm },
});
