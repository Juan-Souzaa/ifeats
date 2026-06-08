import { useCallback, useEffect, useMemo, useState } from 'react';
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
import type {
  PeriodoRelatorio,
  RelatorioCompletoDTO,
  RelatorioDistribuicaoDTO,
  PedidoResponseDTO,
} from '../types/api';
import * as adminRelatorioService from '../services/adminRelatorioService';
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
import { palette } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { diasRelativosApi, formatDataBR, hojeApi } from '../utils/data';
import { formatPrecoBRL } from '../utils/preco';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminRelatorios'>;

const PERIODOS: { key: PeriodoRelatorio; label: string }[] = [
  { key: 'HOJE', label: 'Hoje' },
  { key: 'SEMANA', label: 'Semana' },
  { key: 'MES', label: 'Mês' },
  { key: 'CUSTOMIZADO', label: 'Personalizado' },
];

function agruparVendasPorDia(pedidos: PedidoResponseDTO[]): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const p of pedidos) {
    const dia = p.criadoEm?.slice(0, 10) ?? '—';
    map.set(dia, (map.get(dia) ?? 0) + Number(p.total));
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([dia, value]) => ({
      label: formatDataBR(dia),
      value,
    }));
}

export function AdminRelatoriosScreen({ navigation }: Props): React.JSX.Element {
  const c = useThemeColors();
  const [periodo, setPeriodo] = useState<PeriodoRelatorio>('MES');
  const [aba, setAba] = useState<'completo' | 'vendas' | 'distribuicao'>('completo');
  const [customInicio, setCustomInicio] = useState(() => diasRelativosApi(-30));
  const [customFim, setCustomFim] = useState(hojeApi);
  const [data, setData] = useState<RelatorioCompletoDTO | null>(null);
  const [vendas, setVendas] = useState<PedidoResponseDTO[]>([]);
  const [distribuicao, setDistribuicao] = useState<RelatorioDistribuicaoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtro = useMemo(
    () => ({
      periodo,
      dataInicio: periodo === 'CUSTOMIZADO' ? customInicio : undefined,
      dataFim: periodo === 'CUSTOMIZADO' ? customFim : undefined,
    }),
    [periodo, customInicio, customFim]
  );

  const load = useCallback(async () => {
    if (periodo === 'CUSTOMIZADO' && (!customInicio || !customFim)) {
      setError('Selecione as datas do período personalizado.');
      return;
    }
    if (periodo === 'CUSTOMIZADO' && customFim < customInicio) {
      setError('A data fim deve ser igual ou posterior à data início.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [r, v, d] = await Promise.all([
        adminRelatorioService.relatorioCompleto(filtro),
        adminRelatorioService.relatorioVendas(0, 50),
        adminRelatorioService.relatorioDistribuicao(filtro),
      ]);
      setData(r);
      setVendas(v.content ?? []);
      setDistribuicao(d);
    } catch {
      setError('Não foi possível carregar os relatórios.');
    } finally {
      setLoading(false);
    }
  }, [filtro, periodo, customInicio, customFim]);

  useEffect(() => {
    if (periodo !== 'CUSTOMIZADO') void load();
  }, [periodo, load]);

  const vendasChart = useMemo(() => agruparVendasPorDia(vendas), [vendas]);

  const distribChart = useMemo(() => {
    if (!distribuicao) return [];
    return [
      { label: 'Restaurantes', value: Number(distribuicao.distribuicaoRestaurantes), color: '#2563eb' },
      { label: 'Entregadores', value: Number(distribuicao.distribuicaoEntregadores), color: '#16a34a' },
      { label: 'Plataforma', value: Number(distribuicao.distribuicaoPlataforma), color: palette.primary },
    ];
  }, [distribuicao]);

  return (
    <ScreenShell title="Relatórios" onBack={() => navigation.goBack()}>
      {error ? <ErrorBanner message={error} onRetry={() => void load()} /> : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodos}>
        {PERIODOS.map((p) => {
          const on = periodo === p.key;
          return (
            <Pressable
              key={p.key}
              onPress={() => setPeriodo(p.key)}
              style={[styles.pChip, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
            >
              <Text style={{ color: on ? palette.white : c.text, fontWeight: '700' }}>{p.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {periodo === 'CUSTOMIZADO' ? (
        <Card style={styles.customCard}>
          <Text style={[styles.customTitle, { color: c.text }]}>Período personalizado</Text>
          <DateField label="Data início" value={customInicio} onChange={setCustomInicio} />
          <DateField
            label="Data fim"
            value={customFim}
            onChange={setCustomFim}
            minimumDate={customInicio ? new Date(`${customInicio}T12:00:00`) : undefined}
          />
          <PrimaryButton label="Aplicar período" onPress={() => void load()} loading={loading} />
        </Card>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodos}>
        {(['completo', 'vendas', 'distribuicao'] as const).map((k) => {
          const on = aba === k;
          const label = k === 'completo' ? 'Resumo' : k === 'vendas' ? 'Vendas' : 'Distribuição';
          return (
            <Pressable
              key={k}
              onPress={() => setAba(k)}
              style={[styles.pChip, { backgroundColor: on ? palette.primary : c.chipMutedBg }]}
            >
              <Text style={{ color: on ? palette.white : c.text, fontWeight: '700', fontSize: 12 }}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={palette.primary} style={{ marginTop: 40 }} />
      ) : aba === 'vendas' ? (
        <>
          {vendasChart.length > 0 ? (
            <Card style={styles.chartCard}>
              <BarChart title="Vendas por dia" items={vendasChart} formatValue={(v) => formatPrecoBRL(v)} />
            </Card>
          ) : null}
          {vendas.map((p) => (
            <Card key={p.id} style={{ marginBottom: spacing.sm }}>
              <Text style={{ color: c.text, fontWeight: '700' }}>Pedido #{p.id}</Text>
              <Text style={{ color: c.sub, fontSize: 12, marginTop: 2 }}>
                {p.criadoEm ? formatDataBR(p.criadoEm.slice(0, 10)) : '—'}
              </Text>
              <MoneyText value={p.total} style={{ marginTop: spacing.xs }} />
            </Card>
          ))}
        </>
      ) : aba === 'distribuicao' && distribuicao ? (
        <Card>
          <Text style={{ color: c.sub }}>Volume total</Text>
          <MoneyText value={distribuicao.volumeTotal} accent />
          <View style={{ marginTop: spacing.lg }}>
            <BarChart title="Distribuição de valores" items={distribChart} formatValue={(v) => formatPrecoBRL(v)} />
          </View>
        </Card>
      ) : data ? (
        <>
          <View style={styles.kpiRow}>
            <Card style={styles.kpi}>
              <Text style={{ color: c.sub, fontSize: 12 }}>Vendas</Text>
              <MoneyText value={data.totalVendas} accent style={{ fontSize: 20 }} />
            </Card>
            <Card style={styles.kpi}>
              <Text style={{ color: c.sub, fontSize: 12 }}>Pedidos</Text>
              <Text style={{ color: c.text, fontSize: 22, fontWeight: '800' }}>{data.totalPedidos}</Text>
            </Card>
          </View>
          <Card style={styles.chartCard}>
            <BarChart
              title="Composição financeira"
              items={[
                { label: 'Restaurantes', value: Number(data.distribuicaoRestaurantes), color: '#2563eb' },
                { label: 'Entregadores', value: Number(data.distribuicaoEntregadores), color: '#16a34a' },
                { label: 'Taxa plataforma', value: Number(data.taxaPlataforma), color: palette.primary },
              ]}
              formatValue={(v) => formatPrecoBRL(v)}
            />
          </Card>
          <Card>
            <Text style={{ color: c.sub }}>Ticket médio</Text>
            <MoneyText value={data.ticketMedio} style={{ marginTop: spacing.xs }} />
            <Text style={{ color: c.sub, marginTop: spacing.md }}>Taxa entrega média</Text>
            <MoneyText value={data.taxaEntregaMedia} />
            <Text style={{ color: c.sub, marginTop: spacing.md }}>Tendência</Text>
            <Text style={{ color: c.text, fontWeight: '700' }}>{data.tendencia}</Text>
            <Text style={{ color: c.sub, marginTop: spacing.md }}>Período</Text>
            <Text style={{ color: c.text, fontWeight: '600' }}>
              {periodo === 'CUSTOMIZADO'
                ? `${formatDataBR(customInicio)} – ${formatDataBR(customFim)}`
                : data.periodo}
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
