export function formatDistanciaKm(km: number | null | undefined): string | null {
  if (km == null) return null;
  const n = Number(km);
  if (Number.isNaN(n) || n < 0) return null;
  if (n < 1) return `${Math.round(n * 1000)} m`;
  return `${n.toFixed(1)} km`;
}

export function formatTempoMinutos(min: number | null | undefined): string | null {
  if (min == null) return null;
  const n = Math.round(Number(min));
  if (Number.isNaN(n) || n <= 0) return null;
  return `~${n} min`;
}
