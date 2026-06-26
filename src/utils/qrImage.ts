export function uriImagemQr(encoded: string | null | undefined): string | undefined {
  const raw = encoded?.trim();
  if (!raw) return undefined;
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
    return raw;
  }
  return `data:image/png;base64,${raw}`;
}
