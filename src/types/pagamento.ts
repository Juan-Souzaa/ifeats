export type MetodoPagamento = 'CASH' | 'PIX' | 'CREDIT_CARD';

export type StatusPagamento =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'PAID'
  | 'CANCELED'
  | 'REFUSED'
  | 'REFUNDED';

export interface CartaoCreditoRequestDTO {
  numero: string;
  nomeTitular: string;
  validade: string;
  cvv: string;
}

export interface PagamentoResponseDTO {
  id: number;
  pedidoId: number;
  metodo: MetodoPagamento;
  status: StatusPagamento;
  valor: number;
  troco: number | null;
  qrCode: string | null;
  qrCodeImageUrl: string | null;
  valorReembolsado: number | null;
  dataReembolso: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ReembolsoRequestDTO {
  motivo: string;
}
