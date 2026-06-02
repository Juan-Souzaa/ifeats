import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { EntregadorStackParamList } from '../navigation/types';
import type { PeriodoRelatorio } from '../types/api';
import { useEntregadorGanhosViewModel } from '../hooks/useEntregadorGanhosViewModel';
import { Card, ErrorBanner, MoneyText, ScreenShell, useThemeColors } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<EntregadorStackParamList, 'EntregadorGanhos'>;

const PERIODOS: { key: PeriodoRelatorio; label: string }[] = [
  { key: 'HOJE', label: 'Hoje' },
  { key: 'SEMANA', label: 'Semana' },
  { key: 'MES', label: 'Mês' },
];

export function EntregadorGanhosScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useEntregadorGanhosViewModel();

  useEffect(() => {
    void vm.refresh();
  }, [vm.periodo, vm.refresh]);

  return (
    <ScreenShell title="Ganhos" onBack={() => navigation.goBack()} scroll={false}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.refresh()} /> : null}

      <View style={styles.periodos}>
        {PERIODOS.map((p) => {
          const on = vm.periodo === p.key;
          return (
            <Pressable
              key={p.key}
              onPress={() => vm.setPeriodo(p.key)}
              style={[styles.pChip, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
            >
              <Text style={{ color: on ? palette.white : c.text, fontWeight: '700' }}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {vm.loading ? (
        <ActivityIndicator color={palette.primary} style={{ marginTop: 40 }} />
      ) : vm.resumo ? (
        <>
          <View style={styles.kpiRow}>
            <Card style={styles.kpi}>
              <Text style={{ color: c.sub, fontSize: 12 }}>Valor bruto</Text>
              <MoneyText value={vm.resumo.valorBruto} accent style={{ fontSize: 18 }} />
            </Card>
            <Card style={styles.kpi}>
              <Text style={{ color: c.sub, fontSize: 12 }}>Valor líquido</Text>
              <MoneyText value={vm.resumo.valorLiquido} style={{ fontSize: 18 }} />
            </Card>
          </View>
          <Text style={[styles.sec, { color: c.text }]}>Entregas ({vm.resumo.totalEntregas})</Text>
          <FlatList
            data={vm.entregas}
            keyExtractor={(e) => String(e.pedidoId)}
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
            ListEmptyComponent={
              <Text style={{ color: c.muted, textAlign: 'center', padding: spacing.lg }}>
                Nenhuma entrega no período.
              </Text>
            }
            renderItem={({ item }) => (
              <Card style={{ marginBottom: spacing.sm }}>
                <Text style={{ color: c.text, fontWeight: '700' }}>Pedido #{item.pedidoId}</Text>
                <Text style={{ color: c.sub, fontSize: 12, marginTop: spacing.xs }}>
                  {new Date(item.dataEntrega).toLocaleString('pt-BR')}
                </Text>
                <MoneyText value={item.valorLiquido} style={{ marginTop: spacing.sm }} />
              </Card>
            )}
          />
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  periodos: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  pChip: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  kpiRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  kpi: { flex: 1 },
  sec: { fontSize: 16, fontWeight: '800', marginBottom: spacing.sm },
});
