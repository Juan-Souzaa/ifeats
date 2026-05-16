import type { JwtRole } from '../types/api';

const KNOWN_ROLES: JwtRole[] = [
  'ROLE_USER',
  'ROLE_ADMIN',
  'ROLE_RESTAURANTE',
  'ROLE_ENTREGADOR',
  'ROLE_CLIENTE',
];

function base64UrlToJson(payload: string): Record<string, unknown> | null {
  try {
    let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = atob(b64);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  return base64UrlToJson(parts[1]);
}

export function parseRolesFromJwt(token: string | null): JwtRole[] {
  if (!token) return [];
  const payload = parseJwtPayload(token);
  const raw = payload?.roles;
  if (typeof raw !== 'string' || !raw.trim()) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is JwtRole => KNOWN_ROLES.includes(s as JwtRole));
}

export function hasJwtRole(roles: JwtRole[], role: JwtRole): boolean {
  return roles.includes(role);
}
