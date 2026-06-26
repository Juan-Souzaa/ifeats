import {
  corStatusModeracao,
  legendaStatusEntregador,
  legendaStatusRestaurante,
} from '../moderacaoStatus';

describe('legendaStatusRestaurante', () => {
  it('traduz status de moderacao', () => {
    expect(legendaStatusRestaurante('PENDING_APPROVAL')).toBe('Pendente');
  });
});

describe('legendaStatusEntregador', () => {
  it('traduz status aprovado', () => {
    expect(legendaStatusEntregador('APPROVED')).toBe('Aprovado');
  });
});

describe('corStatusModeracao', () => {
  it('retorna verde para aprovado', () => {
    expect(corStatusModeracao('APPROVED').text).toBe('#16a34a');
  });
});
