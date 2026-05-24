import type { CartaoCreditoRequestDTO, PagamentoResponseDTO, ReembolsoRequestDTO } from '../types/api';
import { api } from './http';

function temDadosCartao(cartao?: CartaoCreditoRequestDTO | null): cartao is CartaoCreditoRequestDTO {
  return Boolean(cartao?.numero?.replace(/\D/g, '').length);
}

export async function criarPagamento(
  pedidoId: number,
  cartao?: CartaoCreditoRequestDTO | null
): Promise<PagamentoResponseDTO> {
  const url = `/api/pagamentos/pedidos/${pedidoId}`;
  if (temDadosCartao(cartao)) {
    const { data } = await api.post<PagamentoResponseDTO>(url, cartao);
    return data;
  }
  const { data } = await api.post<PagamentoResponseDTO>(url);
  return data;
}

export async function buscarPagamentoPorPedido(pedidoId: number): Promise<PagamentoResponseDTO> {
  const { data } = await api.get<PagamentoResponseDTO>(`/api/pagamentos/pedidos/${pedidoId}`);
  return data;
}

export async function solicitarReembolso(
  pedidoId: number,
  dto: ReembolsoRequestDTO
): Promise<PagamentoResponseDTO> {
  const { data } = await api.post<PagamentoResponseDTO>(
    `/api/pagamentos/pedidos/${pedidoId}/reembolso`,
    dto
  );
  return data;
}
