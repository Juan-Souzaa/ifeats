import { getApiBaseUrl } from '../services/http';

export function resolveMediaUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const base = getApiBaseUrl();
  if (pathOrUrl.startsWith('/')) {
    return `${base}${pathOrUrl}`;
  }
  return `${base}/${pathOrUrl}`;
}
