import { useMemo } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { AdminStackParamList } from '../navigation/types';
import {
  BarChart,
  Card,
  DateField,
  ErrorBanner,
  MoneyText,
  PrimaryButton,
  ScreenShell,
  useThemeColors,
} from '../components/ui';
import { PERIODOS_RELATORIO, useAdminRelatoriosViewModel } from '../hooks/useAdminRelatoriosViewModel';
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { formatDataBR } from '../utils/data';
import { formatMoney } from '../utils/money';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminRelatorios'>;

export function AdminRelatoriosScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const vm = useAdminRelatoriosViewModel();

  const distribChart = useMemo(() => {
    if (!vm.distribuicao) return [];
    return [
      { label: 'Restaurantes', value: Number(vm.distribuicao.distribuicaoRestaurantes), color: '#2563eb' },
      { label: 'Entregadores', value: Number(vm.distribuicao.distribuicaoEntregadores), color: '#16a34a' },
      { label: 'Plataforma', value: Number(vm.distribuicao.distribuicaoPlataforma), color: palette.primary },
    ];
  }, [vm.distribuicao]);

  return (
    <ScreenShell title="Relatórios" onBack={() => navigation.goBack()}>
      {vm.error ? <ErrorBanner message={vm.error} onRetry={() => void vm.load()} /> : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodos}>
        {PERIODOS_RELATORIO.map((p) => {
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
      </ScrollView>

      {vm.periodo === 'CUSTOMIZADO' ? (
        <Card style={styles.customCard}>
          <Text style={[styles.customTitle, { color: c.text }]}>Período personalizado</Text>
          <DateField label="Data início" value={vm.customInicio} onChange={vm.setCustomInicio} />
          <DateField
            label="Data fim"
            value={vm.customFim}
            onChange={vm.setCustomFim}
            minimumDate={vm.customInicio ? new Date(`${vm.customInicio}T12:00:00`) : undefined}
          />
          <PrimaryButton label="Aplicar período" onPress={() => void vm.load()} loading={vm.loading} />
        </Card>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodos}>
        {(['completo', 'vendas', 'distribuicao'] as const).map((k) => {
          const on = vm.aba === k;
          const label = k === 'completo' ? 'Resumo' : k === 'vendas' ? 'Vendas' : 'Distribuição';
          return (
            <Pressable
              key={k}
              onPress={() => vm.setAba(k)}
              style={[styles.pChip, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
            >
              <Text style={{ color: on ? palette.white : c.text, fontWeight: '700', fontSize: 12 }}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {vm.loading ? (
        <ActivityIndicator color={palette.primary} style={{ marginTop: 40 }} />
      ) : vm.aba === 'vendas' ? (
        <>
          {vm.vendasChart.length > 0 ? (
            <Card style={styles.chartCard}>
              <BarChart title="Vendas por dia" items={vm.vendasChart} formatValue={(v) => formatMoney(v)} />
            </Card>
          ) : null}
          {vm.vendas.map((p) => (
            <Card key={p.id} style={{ marginBottom: spacing.sm }}>
              <Text style={{ color: c.text, fontWeight: '700' }}>Pedido #{p.id}</Text>
              <Text style={{ color: c.sub, fontSize: 12, marginTop: 2 }}>
                {p.criadoEm ? formatDataBR(p.criadoEm.slice(0, 10)) : '—'}
              </Text>
              <MoneyText value={p.total} style={{ marginTop: spacing.xs }} />
            </Card>
          ))}
        </>
      ) : vm.aba === 'distribuicao' && vm.distribuicao ? (
        <Card>
          <Text style={{ color: c.sub }}>Volume total</Text>
          <MoneyText value={vm.distribuicao.volumeTotal} accent />
          <View style={{ marginTop: spacing.lg }}>
            <BarChart title="Distribuição de valores" items={distribChart} formatValue={(v) => formatMoney(v)} />
          </View>
        </Card>
      ) : vm.data ? (
        <>
          <View style={styles.kpiRow}>
            <Card style={styles.kpi}>
              <Text style={{ color: c.sub, fontSize: 12 }}>Vendas</Text>
              <MoneyText value={vm.data.totalVendas} accent style={{ fontSize: 20 }} />
            </Card>
            <Card style={styles.kpi}>
              <Text style={{ color: c.sub, fontSize: 12 }}>Pedidos</Text>
              <Text style={{ color: c.text, fontSize: 22, fontWeight: '800' }}>{vm.data.totalPedidos}</Text>
            </Card>
          </View>
          <Card style={styles.chartCard}>
            <BarChart
              title="Composição financeira"
              items={[
                { label: 'Restaurantes', value: Number(vm.data.distribuicaoRestaurantes), color: '#2563eb' },
                { label: 'Entregadores', value: Number(vm.data.distribuicaoEntregadores), color: '#16a34a' },
                { label: 'Taxa plataforma', value: Number(vm.data.taxaPlataforma), color: palette.primary },
              ]}
              formatValue={(v) => formatMoney(v)}
            />
          </Card>
          <Card>
            <Text style={{ color: c.sub }}>Ticket médio</Text>
            <MoneyText value={vm.data.ticketMedio} style={{ marginTop: spacing.xs }} />
            <Text style={{ color: c.sub, marginTop: spacing.md }}>Taxa entrega média</Text>
            <MoneyText value={vm.data.taxaEntregaMedia} />
            <Text style={{ color: c.sub, marginTop: spacing.md }}>Tendência</Text>
            <Text style={{ color: c.text, fontWeight: '700' }}>{vm.data.tendencia}</Text>
            <Text style={{ color: c.sub, marginTop: spacing.md }}>Período</Text>
            <Text style={{ color: c.text, fontWeight: '600' }}>
              {vm.periodo === 'CUSTOMIZADO'
                ? `${formatDataBR(vm.customInicio)} – ${formatDataBR(vm.customFim)}`
                : vm.data.periodo}
            </Text>
          </Card>
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  periodos: { gap: spacing.sm, marginBottom: spacing.md, paddingRight: spacing.sm },
  pChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  customCard: { marginBottom: spacing.lg },
  customTitle: { fontSize: 15, fontWeight: '800', marginBottom: spacing.sm },
  kpiRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  kpi: { flex: 1 },
  chartCard: { marginBottom: spacing.md },
});
