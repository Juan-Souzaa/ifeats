
export function toApiDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}



export function parseApiDate(value: string): Date | null {
  if (!value?.trim()) return null;
  const base = value.slice(0, 10);
  const parts = base.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [y, m, d] = parts;
  const date = new Date(y!, m! - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Ex.: 2026-06-10 → 10/06/2026 */
export function formatDataBR(value: string): string {
  const date = parseApiDate(value);
  if (!date) return value;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function hojeApi(): string {
  return toApiDate(new Date());
}

export function daquiDiasApi(dias: number): string {
  return diasRelativosApi(dias);
}

export function diasRelativosApi(offsetDias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDias);
  return toApiDate(d);
}
