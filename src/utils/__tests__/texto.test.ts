import { formatContagemAvaliacoes } from '../texto';

describe('formatContagemAvaliacoes', () => {
  it('singular para uma avaliacao', () => {
    expect(formatContagemAvaliacoes(1)).toBe('1 avaliação');
  });

  it('plural para varias', () => {
    expect(formatContagemAvaliacoes(42)).toBe('42 avaliações');
  });
});
