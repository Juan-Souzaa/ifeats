import {
  contagemItensPedido,
  formatMetodoPagamento,
  formatStatusPedido,
  resumoItensPedido,
  timelineIndex,
} from '../pedidoStatus';

describe('formatStatusPedido', () => {
  it('traduz status conhecidos', () => {
    expect(formatStatusPedido('PREPARING')).toBe('Em preparo');
    expect(formatStatusPedido('DELIVERED')).toBe('Entregue');
  });
});

describe('formatMetodoPagamento', () => {
  it('traduz metodos', () => {
    expect(formatMetodoPagamento('PIX')).toBe('PIX');
    expect(formatMetodoPagamento('CASH')).toBe('Dinheiro');
  });
});

describe('timelineIndex', () => {
  it('retorna -1 para cancelado', () => {
    expect(timelineIndex('CANCELED')).toBe(-1);
  });

  it('retorna indice do status na timeline', () => {
    expect(timelineIndex('CONFIRMED')).toBe(1);
  });
});

describe('resumoItensPedido', () => {
  it('resume itens com limite', () => {
    const itens = [
      { quantidade: 1, pratoNome: 'Pizza' },
      { quantidade: 2, pratoNome: 'Suco' },
      { quantidade: 1, pratoNome: 'Brownie' },
    ];
    expect(resumoItensPedido(itens)).toBe('1x Pizza, 2x Suco +1');
  });

  it('retorna sem itens quando vazio', () => {
    expect(resumoItensPedido([])).toBe('Sem itens');
  });
});

describe('contagemItensPedido', () => {
  it('soma quantidades', () => {
    expect(contagemItensPedido([{ quantidade: 2 }, { quantidade: 3 }])).toBe(5);
  });
});
