import { extractErrorMessage } from '../errors';

describe('extractErrorMessage', () => {
  it('usa message da resposta axios', () => {
    const err = { response: { data: { message: 'Credenciais invalidas' } } };
    expect(extractErrorMessage(err)).toBe('Credenciais invalidas');
  });

  it('usa Error.message', () => {
    expect(extractErrorMessage(new Error('falhou'))).toBe('falhou');
  });

  it('fallback generico', () => {
    expect(extractErrorMessage('x')).toBe('Ocorreu um erro. Tente novamente.');
  });
});
