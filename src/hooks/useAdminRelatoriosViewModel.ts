import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  PeriodoRelatorio,
  PedidoResponseDTO,
  RelatorioCompletoDTO,
  RelatorioDistribuicaoDTO,
} from '../types/api';
import * as adminRelatorioService from '../services/adminRelatorioService';
import { diasRelativosApi, formatDataBR, hojeApi } from '../utils/data';

export const PERIODOS_RELATORIO: { key: PeriodoRelatorio; label: string }[] = [
  { key: 'HOJE', label: 'Hoje' },
  { key: 'SEMANA', label: 'Semana' },
  { key: 'MES', label: 'Mês' },
  { key: 'CUSTOMIZADO', label: 'Personalizado' },
];

export function agruparVendasPorDia(pedidos: PedidoResponseDTO[]): { label: string; value: number }[] {
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

export function useAdminRelatoriosViewModel() {
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

  return {
    periodo,
    setPeriodo,
    aba,
    setAba,
    customInicio,
    setCustomInicio,
    customFim,
    setCustomFim,
    data,
    vendas,
    distribuicao,
    loading,
    error,
    load,
    vendasChart,
  };
}
