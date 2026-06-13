import {
  formatPrioridadeTicket,
  formatStatusTicket,
  formatTipoTicket,
  ticketStatusColor,
} from '../ticketStatus';

describe('formatStatusTicket', () => {
  it('traduz status de ticket', () => {
    expect(formatStatusTicket('ABERTO')).toBe('Aberto');
    expect(formatStatusTicket('RESOLVIDO')).toBe('Resolvido');
  });
});

describe('formatTipoTicket', () => {
  it('traduz tipo', () => {
    expect(formatTipoTicket('RECLAMACAO')).toBe('Reclamação');
  });
});

describe('formatPrioridadeTicket', () => {
  it('traduz prioridade', () => {
    expect(formatPrioridadeTicket('URGENTE')).toBe('Urgente');
  });
});

describe('ticketStatusColor', () => {
  it('retorna cores para status aberto', () => {
    expect(ticketStatusColor('ABERTO').text).toBe('#2563eb');
  });
});
