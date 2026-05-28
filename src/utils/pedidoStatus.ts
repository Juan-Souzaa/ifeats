import type { MetodoPagamento, StatusPagamento, StatusPedido } from '../types/api';

export function formatStatusPedido(status: StatusPedido): string {
  switch (status) {
    case 'CREATED':
      return 'Pedido recebido';
    case 'CONFIRMED':
      return 'Confirmado';
    case 'PREPARING':
      return 'Em preparo';
    case 'OUT_FOR_DELIVERY':
      return 'A caminho';
    case 'DELIVERED':
      return 'Entregue';
    case 'CANCELED':
      return 'Cancelado';
    default:
      return status;
  }
}

export function statusColor(status: StatusPedido): { bg: string; text: string } {
  switch (status) {
    case 'CREATED':
      return { bg: 'rgba(59,130,246,0.15)', text: '#2563eb' };
    case 'CONFIRMED':
      return { bg: 'rgba(99,102,241,0.15)', text: '#4f46e5' };
    case 'PREPARING':
      return { bg: 'rgba(245,158,11,0.18)', text: '#d97706' };
    case 'OUT_FOR_DELIVERY':
      return { bg: 'rgba(236,73,19,0.15)', text: '#ec4913' };
    case 'DELIVERED':
      return { bg: 'rgba(22,163,74,0.15)', text: '#16a34a' };
    case 'CANCELED':
      return { bg: 'rgba(100,116,139,0.2)', text: '#64748b' };
    default:
      return { bg: 'rgba(100,116,139,0.15)', text: '#64748b' };
  }
}

export const PEDIDO_TIMELINE: StatusPedido[] = [
  'CREATED',
  'CONFIRMED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export function timelineIndex(status: StatusPedido): number {
  if (status === 'CANCELED') return -1;
  const i = PEDIDO_TIMELINE.indexOf(status);
  return i >= 0 ? i : 0;
}
  switch (metodo) {
    case 'PIX':
      return 'PIX';
    case 'CASH':
      return 'Dinheiro';
    case 'CREDIT_CARD':
      return 'Cartão de crédito';
    default:
      return metodo;
  }
}
export function formatStatusPagamento(status: StatusPagamento): string {
    case 'PENDING':
      return 'Pendente';
    case 'AUTHORIZED':
      return 'Autorizado';
    case 'PAID':
      return 'Pago';
    case 'CANCELED':
      return 'Cancelado';
    case 'REFUSED':
      return 'Recusado';
    case 'REFUNDED':
      return 'Reembolsado';
    default:
      return status;
  }
}
export function resumoItensPedido(
  itens: { quantidade: number; pratoNome: string }[] | undefined,
