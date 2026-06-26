import { formatDistanciaKm, formatTempoMinutos } from '../distancia';

describe('formatDistanciaKm', () => {
  it('formata metros abaixo de 1 km', () => {
    expect(formatDistanciaKm(0.5)).toBe('500 m');
  });

  it('formata quilometros', () => {
    expect(formatDistanciaKm(2.34)).toBe('2.3 km');
  });

  it('retorna null para valores invalidos', () => {
    expect(formatDistanciaKm(null)).toBeNull();
    expect(formatDistanciaKm(-1)).toBeNull();
  });
});

describe('formatTempoMinutos', () => {
  it('formata minutos arredondados', () => {
    expect(formatTempoMinutos(25.4)).toBe('~25 min');
  });

  it('retorna null para zero ou invalido', () => {
    expect(formatTempoMinutos(0)).toBeNull();
    expect(formatTempoMinutos(null)).toBeNull();
  });
});
