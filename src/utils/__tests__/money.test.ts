import { formatMoney } from '../money';

describe('formatMoney', () => {
  it('formata numero em BRL', () => {
    expect(formatMoney(12.5)).toMatch(/12,50/);
  });

  it('formata string numerica', () => {
    expect(formatMoney('99.9')).toMatch(/99,90/);
  });

  it('retorna zero para null ou NaN', () => {
    expect(formatMoney(null)).toBe('R$ 0,00');
    expect(formatMoney(undefined)).toBe('R$ 0,00');
    expect(formatMoney('abc')).toBe('R$ 0,00');
  });
});
