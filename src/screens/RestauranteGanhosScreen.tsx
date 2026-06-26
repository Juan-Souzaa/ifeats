import { useCallback, useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { RestauranteStackParamList } from '../navigation/types';
import type { PeriodoRelatorio } from '../types/api';
import { useRestauranteGanhosViewModel } from '../hooks/useRestauranteGanhosViewModel';
import { Card, ErrorBanner, MoneyText, ScreenShell, useThemeColors } from '../components/ui';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

type Props = NativeStackScreenProps<RestauranteStackParamList, 'RestauranteGanhos'>;

const PERIODOS: { key: PeriodoRelatorio; label: string }[] = [
  { key: 'HOJE', label: 'Hoje' },
  { key: 'SEMANA', label: 'Semana' },
  { key: 'MES', label: 'Mês' },
];

export function RestauranteGanhosScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useRestauranteGanhosViewModel();

  useFocusEffect(
    useCallback(() => {
      void vm.refresh();
    }, [vm.refresh])
  );

  useEffect(() => {
    void vm.refresh();
  }, [vm.periodo, vm.refresh]);

  return (
    <ScreenShell title="Ganhos" onBack={() => navigation.goBack()}>
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
      ) : vm.data ? (
        <>
          <View style={styles.kpiRow}>
            <Card style={styles.kpi}>
              <Text style={{ color: c.sub, fontSize: 12 }}>Valor bruto</Text>
              <MoneyText value={vm.data.valorBruto} accent style={{ fontSize: 20 }} />
            </Card>
            <Card style={styles.kpi}>
              <Text style={{ color: c.sub, fontSize: 12 }}>Valor líquido</Text>
              <MoneyText value={vm.data.valorLiquido} style={{ fontSize: 20 }} />
            </Card>
          </View>
          <Card>
            <Text style={{ color: c.sub }}>Total de pedidos</Text>
            <Text style={{ color: c.text, fontSize: 22, fontWeight: '800', marginTop: spacing.xs }}>
              {vm.data.totalPedidos}
            </Text>
            <Text style={{ color: c.muted, fontSize: 12, marginTop: spacing.md }}>Período: {vm.data.periodo}</Text>
          </Card>
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  periodos: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  pChip: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  kpiRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  kpi: { flex: 1 },
});
