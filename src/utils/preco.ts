/**
 * Converte texto de preço (ex: "18,90" ou "18.90") em número para a API.
 */
export function parsePrecoInput(value: string): number | null {
  const trimmed = value.trim().replace(/\s/g, '');
  if (!trimmed) return null;
  const normalized = trimmed.replace(',', '.');
  const n = Number(normalized);
  if (Number.isNaN(n) || n <= 0) return null;
  return n;
}

export function formatPrecoBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
