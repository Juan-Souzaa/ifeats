import type {
  PedidoRequestDTO,
  PedidoResponseDTO,
  SpringPage,
  StatusPedido,
} from '../types/api';
import { api } from './http';
import type { RastreamentoDTO } from '../types/api';

export async function criarPedido(dto: PedidoRequestDTO): Promise<PedidoResponseDTO> {
  const { data } = await api.post<PedidoResponseDTO>('/api/pedidos', dto);
  return data;
}

export async function listarMeusPedidos(params?: {
  status?: StatusPedido;
  restauranteId?: number;
  page?: number;
  size?: number;
}): Promise<SpringPage<PedidoResponseDTO>> {
  const { data } = await api.get<SpringPage<PedidoResponseDTO>>('/api/pedidos/meus-pedidos', {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 30,
      status: params?.status,
      restauranteId: params?.restauranteId,
    },
  });
  return data;
}

export async function buscarPedido(id: number): Promise<PedidoResponseDTO> {
  const { data } = await api.get<PedidoResponseDTO>(`/api/pedidos/${id}`);
  return data;
}

export async function cancelarPedido(id: number): Promise<PedidoResponseDTO> {
  const { data } = await api.patch<PedidoResponseDTO>(`/api/pedidos/${id}/cancelar`);
  return data;
}

export async function listarPedidosRestaurante(params?: {
  status?: StatusPedido;
  page?: number;
  size?: number;
}): Promise<SpringPage<PedidoResponseDTO>> {
  const { data } = await api.get<SpringPage<PedidoResponseDTO>>(
    '/api/restaurantes/pedidos/meus-pedidos',
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 30,
        status: params?.status,
      },
    }
  );
  return data;
}

export async function marcarPedidoPreparando(id: number): Promise<PedidoResponseDTO> {
  const { data } = await api.patch<PedidoResponseDTO>(`/api/pedidos/${id}/preparando`);
  return data;
}

export async function cancelarPedidoRestaurante(id: number): Promise<PedidoResponseDTO> {
  const { data } = await api.patch<PedidoResponseDTO>(
    `/api/restaurantes/pedidos/${id}/cancelar`
  );
  return data;
}

export async function obterRastreamento(pedidoId: number): Promise<RastreamentoDTO> {
  const { data } = await api.get<RastreamentoDTO>(`/api/pedidos/${pedidoId}/rastreamento`);
  return data;
}

export async function confirmarPedido(id: number): Promise<PedidoResponseDTO> {
  const { data } = await api.post<PedidoResponseDTO>(`/api/pedidos/${id}/confirmar`);
  return data;
}
