import type { MetodoPagamento } from './pagamento';

export type StatusPedido =
  | 'CREATED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELED';

export interface PedidoItemRequestDTO {
  pratoId: number;
  quantidade: number;
}

export interface PedidoItemResponseDTO {
  id: number;
  pratoId: number;
  pratoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface EntregadorSimplesDTO {
  id: number;
  nome: string;
}

export interface CoordinatesDTO {
  latitude: number;
  longitude: number;
}

export interface RastreamentoDTO {
  posicaoAtualLat: number | null;
  posicaoAtualLon: number | null;
  posicaoDestinoLat: number | null;
  posicaoDestinoLon: number | null;
  posicaoRestauranteLat: number | null;
  posicaoRestauranteLon: number | null;
  distanciaRestanteKm: number | null;
  tempoEstimadoMinutos: number | null;
  statusEntrega: StatusPedido | null;
  proximoAoDestino: boolean | null;
  waypoints?: CoordinatesDTO[] | null;
}

export interface PedidoRequestDTO {
  restauranteId: number;
  itens: PedidoItemRequestDTO[];
  metodoPagamento: MetodoPagamento;
  troco?: number | null;
  observacoes?: string | null;
  enderecoId?: number | null;
  carrinhoId?: number | null;
}

export interface PedidoResponseDTO {
  id: number;
  clienteId: number;
  clienteNome?: string | null;
  clienteTelefone?: string | null;
  restauranteId: number;
  status: StatusPedido;
  metodoPagamento: MetodoPagamento;
  troco: number | null;
  observacoes: string | null;
  enderecoEntrega: string | null;
  subtotal: number;
  taxaEntrega: number;
  total: number;
  itens: PedidoItemResponseDTO[];
  entregador: EntregadorSimplesDTO | null;
  tempoEstimadoEntrega: string | null;
  criadoEm: string;
  rastreamento?: RastreamentoDTO | null;
}
