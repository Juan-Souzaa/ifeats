import { regionFromPoints, toCoord } from '../mapCoords';

describe('toCoord', () => {
  it('converte lat/lon validos', () => {
    expect(toCoord(-23.55, -46.63)).toEqual({ latitude: -23.55, longitude: -46.63 });
  });

  it('retorna null para invalidos', () => {
    expect(toCoord(null, -46)).toBeNull();
    expect(toCoord('x', 'y')).toBeNull();
  });
});

describe('regionFromPoints', () => {
  it('usa fallback quando sem pontos', () => {
    const r = regionFromPoints([]);
    expect(r.latitude).toBe(-23.5505);
    expect(r.longitudeDelta).toBeGreaterThan(0);
  });

  it('calcula regiao em torno dos pontos', () => {
    const r = regionFromPoints([
      { latitude: -23.5, longitude: -46.6 },
      { latitude: -23.6, longitude: -46.7 },
    ]);
    expect(r.latitude).toBeCloseTo(-23.55, 1);
    expect(r.latitudeDelta).toBeGreaterThan(0.02);
  });
});
