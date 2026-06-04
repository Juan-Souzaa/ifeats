import type {
  AvaliacaoEntregadorResponseDTO,
  AvaliacaoRequestDTO,
  AvaliacaoResumoDTO,
  AvaliacaoResumoEntregadorDTO,
  AvaliacaoResponseDTO,
  AvaliacaoRestauranteResponseDTO,
  SpringPage,
} from '../types/api';
import { api } from './http';

export async function criarAvaliacao(
  pedidoId: number,
  dto: AvaliacaoRequestDTO
): Promise<AvaliacaoResponseDTO> {
  const { data } = await api.post<AvaliacaoResponseDTO>(
    `/api/avaliacoes/pedidos/${pedidoId}`,
    dto
  );
  return data;
}

export async function editarAvaliacao(
  id: number,
  dto: AvaliacaoRequestDTO
): Promise<AvaliacaoResponseDTO> {
  const { data } = await api.put<AvaliacaoResponseDTO>(`/api/avaliacoes/${id}`, dto);
  return data;
}

export async function buscarAvaliacaoPorPedido(pedidoId: number): Promise<AvaliacaoResponseDTO> {
  const { data } = await api.get<AvaliacaoResponseDTO>(`/api/avaliacoes/pedidos/${pedidoId}`);
  return data;
}

export async function resumoRestaurante(restauranteId: number): Promise<AvaliacaoResumoDTO> {
  const { data } = await api.get<AvaliacaoResumoDTO>(
    `/api/avaliacoes/restaurantes/${restauranteId}/resumo`
  );
  return data;
}

export async function listarAvaliacoesRestaurante(
  restauranteId: number,
  page = 0,
  size = 20
): Promise<SpringPage<AvaliacaoRestauranteResponseDTO>> {
  const { data } = await api.get<SpringPage<AvaliacaoRestauranteResponseDTO>>(
    `/api/avaliacoes/restaurantes/${restauranteId}`,
    { params: { page, size } }
  );
  return data;
}

export async function resumoEntregador(entregadorId: number): Promise<AvaliacaoResumoEntregadorDTO> {
  const { data } = await api.get<AvaliacaoResumoEntregadorDTO>(
    `/api/avaliacoes/entregadores/${entregadorId}/resumo`
  );
  return data;
}

export async function listarAvaliacoesEntregador(
  entregadorId: number,
  page = 0,
  size = 20
): Promise<SpringPage<AvaliacaoEntregadorResponseDTO>> {
  const { data } = await api.get<SpringPage<AvaliacaoEntregadorResponseDTO>>(
    `/api/avaliacoes/entregadores/${entregadorId}`,
    { params: { page, size } }
  );
  return data;
}
