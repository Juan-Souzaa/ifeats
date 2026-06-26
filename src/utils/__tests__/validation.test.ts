import { normalizeCep, validateCep, validateEstado, validateSenha } from '../validation';

describe('validateEstado', () => {
  it('aceita UF valida', () => {
    expect(validateEstado('SP')).toBeNull();
  });

  it('rejeita UF invalida', () => {
    expect(validateEstado('sp')).not.toBeNull();
    expect(validateEstado('SPA')).not.toBeNull();
  });
});

describe('validateCep', () => {
  it('aceita 8 digitos', () => {
    expect(validateCep('01310100')).toBeNull();
    expect(validateCep('01310-100')).toBeNull();
  });

  it('rejeita CEP incompleto', () => {
    expect(validateCep('123')).not.toBeNull();
  });
});

describe('normalizeCep', () => {
  it('formata com hifen', () => {
    expect(normalizeCep('01310100')).toBe('01310-100');
  });
});

describe('validateSenha', () => {
  it('aceita senha entre 6 e 20 caracteres', () => {
    expect(validateSenha('abc123')).toBeNull();
  });

  it('rejeita senha curta ou longa', () => {
    expect(validateSenha('123')).not.toBeNull();
    expect(validateSenha('a'.repeat(21))).not.toBeNull();
  });
});
