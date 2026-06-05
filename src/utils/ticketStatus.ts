import type { PrioridadeTicket, StatusTicket, TipoTicket } from '../types/api';

export function formatStatusTicket(status: StatusTicket): string {
  switch (status) {
    case 'ABERTO':
      return 'Aberto';
    case 'EM_ANDAMENTO':
      return 'Em andamento';
    case 'RESOLVIDO':
      return 'Resolvido';
    case 'FECHADO':
      return 'Fechado';
    default:
      return status;
  }
}

export function formatTipoTicket(tipo: TipoTicket): string {
  switch (tipo) {
    case 'RECLAMACAO':
      return 'Reclamação';
    case 'SUPORTE_TECNICO':
      return 'Suporte técnico';
    case 'SUGESTAO':
      return 'Sugestão';
    default:
      return tipo;
  }
}

export function formatPrioridadeTicket(p: PrioridadeTicket): string {
  switch (p) {
    case 'BAIXA':
      return 'Baixa';
    case 'MEDIA':
      return 'Média';
    case 'ALTA':
      return 'Alta';
    case 'URGENTE':
      return 'Urgente';
    default:
      return p;
  }
}

export function ticketStatusColor(status: StatusTicket): { bg: string; text: string } {
  switch (status) {
    case 'ABERTO':
      return { bg: 'rgba(59,130,246,0.15)', text: '#2563eb' };
    case 'EM_ANDAMENTO':
      return { bg: 'rgba(245,158,11,0.18)', text: '#d97706' };
    case 'RESOLVIDO':
      return { bg: 'rgba(22,163,74,0.15)', text: '#16a34a' };
    case 'FECHADO':
      return { bg: 'rgba(100,116,139,0.2)', text: '#64748b' };
    default:
      return { bg: 'rgba(100,116,139,0.15)', text: '#64748b' };
  }
}
