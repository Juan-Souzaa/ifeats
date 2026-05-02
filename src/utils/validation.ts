export function validateEstado(uf: string): string | null {
  const u = uf.trim();
  if (!/^[A-Z]{2}$/.test(u)) {
    return 'Estado deve ser sigla de 2 letras maiúsculas (ex: SP)';
  }
  return null;
}

export function validateCep(cep: string): string | null {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) {
    return 'CEP deve ter 8 dígitos';
  }
  return null;
}

export function normalizeCep(cep: string): string {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return cep;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function validateSenha(s: string): string | null {
  if (s.length < 6 || s.length > 20) {
    return 'Senha deve ter entre 6 e 20 caracteres';
  }
  return null;
}
