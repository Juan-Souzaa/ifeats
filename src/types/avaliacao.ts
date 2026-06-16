export interface AvaliacaoRequestDTO {
  notaRestaurante: number;
  notaEntregador?: number | null;
  notaPedido: number;
  comentarioRestaurante?: string | null;
  comentarioEntregador?: string | null;
  comentarioPedido?: string | null;
}

export interface AvaliacaoResponseDTO {
  id: number;
  pedidoId: number;
  clienteId: number;
  restauranteId: number;
  entregadorId: number | null;
  notaRestaurante: number;
  notaEntregador: number | null;
  notaPedido: number;
  comentarioRestaurante: string | null;
  comentarioEntregador: string | null;
  comentarioPedido: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AvaliacaoResumoDTO {
  mediaNotaRestaurante: number;
  totalAvaliacoesRestaurante: number;
}

export interface AvaliacaoRestauranteResponseDTO {
  id: number;
  pedidoId: number;
  clienteId: number;
  restauranteId: number;
  notaRestaurante: number;
  notaPedido: number;
  comentarioRestaurante: string | null;
  comentarioPedido: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AvaliacaoResumoEntregadorDTO {
  mediaNotaEntregador: number;
  totalAvaliacoesEntregador: number;
}

export interface AvaliacaoEntregadorResponseDTO {
  id: number;
  pedidoId: number;
  clienteId: number;
  entregadorId: number;
  notaEntregador: number;
  comentarioEntregador: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
