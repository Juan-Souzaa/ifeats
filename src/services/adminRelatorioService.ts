import type {
  PedidoResponseDTO,
  PeriodoRelatorio,
  RelatorioCompletoDTO,
  RelatorioDistribuicaoDTO,
  SpringPage,
} from '../types/api';
import { api } from './http';

export type RelatorioFiltro = {
  periodo: PeriodoRelatorio;
  dataInicio?: string;
  dataFim?: string;
};

function relatorioParams(filtro: RelatorioFiltro) {
  const params: Record<string, string> = { periodo: filtro.periodo };
  if (filtro.periodo === 'CUSTOMIZADO') {
    if (filtro.dataInicio) params.dataInicio = filtro.dataInicio;
    if (filtro.dataFim) params.dataFim = filtro.dataFim;
  }
  return params;
}

export async function relatorioVendas(page = 0, size = 20): Promise<SpringPage<PedidoResponseDTO>> {
  const { data } = await api.get<SpringPage<PedidoResponseDTO>>('/api/admin/relatorios/vendas', {
    params: { page, size },
  });
  return data;
}

export async function relatorioDistribuicao(filtro: RelatorioFiltro): Promise<RelatorioDistribuicaoDTO> {
  const { data } = await api.get<RelatorioDistribuicaoDTO>('/api/admin/relatorios/distribuicao', {
    params: relatorioParams(filtro),
  });
  return data;
}

export async function relatorioCompleto(filtro: RelatorioFiltro): Promise<RelatorioCompletoDTO> {
  const { data } = await api.get<RelatorioCompletoDTO>('/api/admin/relatorios/completo', {
    params: relatorioParams(filtro),
  });
  return data;
}
