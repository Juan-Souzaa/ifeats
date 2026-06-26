import type { StatusEntregador, StatusRestaurante } from '../types/api';

export function legendaStatusRestaurante(status: StatusRestaurante): string {
  switch (status) {
    case 'APPROVED':
      return 'Aprovado';
    case 'PENDING_APPROVAL':
      return 'Pendente';
    case 'REJECTED':
      return 'Rejeitado';
    default:
      return status;
  }
}

export function legendaStatusEntregador(status: StatusEntregador): string {
  switch (status) {
    case 'APPROVED':
      return 'Aprovado';
    case 'PENDING_APPROVAL':
      return 'Pendente';
    case 'REJECTED':
      return 'Rejeitado';
    default:
      return status;
  }
}

export function corStatusModeracao(status: StatusRestaurante | StatusEntregador): {
  bg: string;
  text: string;
} {
  switch (status) {
    case 'APPROVED':
      return { bg: 'rgba(22,163,74,0.15)', text: '#16a34a' };
    case 'PENDING_APPROVAL':
      return { bg: 'rgba(245,158,11,0.2)', text: '#d97706' };
    case 'REJECTED':
      return { bg: 'rgba(100,116,139,0.2)', text: '#64748b' };
    default:
      return { bg: 'rgba(100,116,139,0.2)', text: '#64748b' };
  }
}
