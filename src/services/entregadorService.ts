import type {
  AtualizarEntregadorRequestDTO,
  DisponibilidadeEntregador,
  EntregadorRequestDTO,
  EntregadorResponseDTO,
  GanhosEntregadorDTO,
  GanhosPorEntregaDTO,
  PedidoResponseDTO,
  PeriodoRelatorio,
  SpringPage,
  StatusEntregador,
} from '../types/api';
import { api, publicApi } from './http';

export async function cadastrarEntregador(dto: EntregadorRequestDTO): Promise<EntregadorResponseDTO> {
  const { data } = await publicApi.post<EntregadorResponseDTO>('/api/entregadores', dto);
  return data;
}

export async function buscarEntregador(id: number): Promise<EntregadorResponseDTO> {
  const { data } = await api.get<EntregadorResponseDTO>(`/api/entregadores/${id}`);
  return data;
}

export async function listarEntregadores(page = 0, size = 50): Promise<SpringPage<EntregadorResponseDTO>> {
  const { data } = await api.get<SpringPage<EntregadorResponseDTO>>('/api/entregadores', {
    params: { page, size, sort: 'nome,asc' },
  });
  return data;
}

export async function buscarMeuEntregador(): Promise<EntregadorResponseDTO> {
  const page = await listarEntregadores(0, 1);
  const first = page.content?.[0];
  if (!first) throw new Error('Perfil de entregador não encontrado.');
  return first;
}

export async function atualizarEntregador(
  id: number,
  dto: AtualizarEntregadorRequestDTO
): Promise<EntregadorResponseDTO> {
  const { data } = await api.put<EntregadorResponseDTO>(`/api/entregadores/${id}`, dto);
  return data;
}

export async function atualizarDisponibilidade(
  id: number,
  disponibilidade: DisponibilidadeEntregador
): Promise<EntregadorResponseDTO> {
  const { data } = await api.patch<EntregadorResponseDTO>(
    `/api/entregadores/${id}/disponibilidade`,
    undefined,
    { params: { disponibilidade } }
  );
  return data;
}

export async function listarEntregadoresPorStatus(
  status: StatusEntregador,
  page = 0,
  size = 30
): Promise<SpringPage<EntregadorResponseDTO>> {
  const { data } = await api.get<SpringPage<EntregadorResponseDTO>>(
    `/api/entregadores/status/${status}`,
    { params: { page, size } }
  );
  return data;
}

export async function aprovarEntregador(id: number): Promise<EntregadorResponseDTO> {
  const { data } = await api.patch<EntregadorResponseDTO>(`/api/entregadores/${id}/aprovar`);
  return data;
}

export async function rejeitarEntregador(id: number): Promise<EntregadorResponseDTO> {
  const { data } = await api.patch<EntregadorResponseDTO>(`/api/entregadores/${id}/rejeitar`);
  return data;
}

export async function listarPedidosDisponiveis(
  page = 0,
  size = 20
): Promise<SpringPage<PedidoResponseDTO>> {
  const { data } = await api.get<SpringPage<PedidoResponseDTO>>(
    '/api/entregadores/pedidos/disponiveis',
    { params: { page, size } }
  );
  return data;
}

export async function listarEntregasAtivas(
  page = 0,
  size = 20
): Promise<SpringPage<PedidoResponseDTO>> {
  const { data } = await api.get<SpringPage<PedidoResponseDTO>>('/api/entregadores/entregas', {
    params: { page, size },
  });
  return data;
}

export async function listarHistoricoEntregas(
  page = 0,
  size = 20
): Promise<SpringPage<PedidoResponseDTO>> {
  const { data } = await api.get<SpringPage<PedidoResponseDTO>>(
    '/api/entregadores/entregas/historico',
    { params: { page, size } }
  );
  return data;
}

export async function aceitarPedido(id: number): Promise<PedidoResponseDTO> {
  const { data } = await api.post<PedidoResponseDTO>(`/api/entregadores/pedidos/${id}/aceitar`);
  return data;
}

export async function recusarPedido(id: number): Promise<void> {
  await api.post(`/api/entregadores/pedidos/${id}/recusar`);
}

export async function marcarSaiuEntrega(id: number): Promise<PedidoResponseDTO> {
  const { data } = await api.patch<PedidoResponseDTO>(
    `/api/entregadores/pedidos/${id}/saiu-entrega`
  );
  return data;
}

export async function marcarComoEntregue(id: number): Promise<PedidoResponseDTO> {
  const { data } = await api.patch<PedidoResponseDTO>(`/api/entregadores/pedidos/${id}/entregue`);
  return data;
}

export async function obterGanhosEntregador(
  id: number,
  periodo: PeriodoRelatorio = 'MES'
): Promise<GanhosEntregadorDTO> {
  const { data } = await api.get<GanhosEntregadorDTO>(`/api/entregadores/${id}/ganhos`, {
    params: { periodo },
  });
  return data;
}

export async function listarGanhosPorEntrega(
  id: number,
  periodo: PeriodoRelatorio = 'MES'
): Promise<GanhosPorEntregaDTO[]> {
  const { data } = await api.get<GanhosPorEntregaDTO[]>(
    `/api/entregadores/${id}/ganhos/entregas`,
    { params: { periodo } }
  );
  return data;
}
