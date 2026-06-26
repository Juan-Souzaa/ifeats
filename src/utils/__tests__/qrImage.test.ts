import { uriImagemQr } from '../qrImage';

describe('uriImagemQr', () => {
  it('retorna undefined para vazio', () => {
    expect(uriImagemQr('')).toBeUndefined();
  });

  it('prefixa base64 cru', () => {
    expect(uriImagemQr('abc123')).toBe('data:image/png;base64,abc123');
  });

  it('mantém URL http', () => {
    expect(uriImagemQr('https://exemplo.com/qr.png')).toBe('https://exemplo.com/qr.png');
  });
});
