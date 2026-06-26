import type { CupomInfoDTO } from './cupom';

export interface CarrinhoItemRequestDTO {
  pratoId: number;
  quantidade: number;
}

export interface AplicarCupomRequestDTO {
  codigo: string;
}

export interface CarrinhoItemResponseDTO {
  id: number;
  pratoId: number;
  pratoNome: string;
  pratoFotoUrl?: string | null;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface CarrinhoResponseDTO {
  id: number;
  clienteId: number;
  itens: CarrinhoItemResponseDTO[];
  cupom: CupomInfoDTO | null;
  subtotal: number;
  desconto: number;
  total: number;
  criadoEm: string;
  atualizadoEm: string;
}
