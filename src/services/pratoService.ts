import type { CategoriaMenu, PratoResponseDTO, SpringPage } from '../types/api';
import { api, getApiBaseUrl } from './http';
import { getStoredToken } from './tokenStorage';

function extrairContent<T>(data: unknown): T[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data === 'object' && 'content' in data) {
    const c = (data as { content: unknown }).content;
    return Array.isArray(c) ? (c as T[]) : [];
  }
  return [];
}

export async function listarPratos(
  restauranteId: number,
  params?: { page?: number; size?: number; categoria?: CategoriaMenu }
): Promise<SpringPage<PratoResponseDTO>> {
  const { page = 0, size = 50, categoria } = params ?? {};
  const { data } = await api.get(
    `/api/restaurantes/${restauranteId}/pratos`,
    {
      params: { page, size, ...(categoria ? { categoria } : {}) },
    }
  );
  const content = extrairContent<PratoResponseDTO>(data);
  const base = typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {};
  return {
    content,
    totalElements: Number(base.totalElements ?? content.length),
    size: Number(base.size ?? size),
    number: Number(base.number ?? page),
  };
}

export interface CriarPratoPayload {
  nome: string;
  descricao?: string;
  preco: number;
  categoria: CategoriaMenu;
  disponivel: boolean;
  fotoUri?: string | null;
  fotoMime?: string | null;
}

export interface AtualizarPratoPayload extends CriarPratoPayload {}

function formatApiError(status: number, body: unknown): string {
  if (typeof body === 'object' && body !== null) {
    const o = body as { message?: string; fieldErrors?: string[] };
    if (Array.isArray(o.fieldErrors) && o.fieldErrors.length > 0) {
      return o.fieldErrors.join('\n');
    }
    if (typeof o.message === 'string' && o.message.length > 0) {
      return o.message;
    }
  }
  if (typeof body === 'string' && body.length > 0) {
    return body;
  }
  return `Erro HTTP ${status}`;
}

/**
 * Multipart com `fetch` evita problemas comuns de axios + FormData no React Native.
 */
export async function criarPrato(
  restauranteId: number,
  payload: CriarPratoPayload
): Promise<PratoResponseDTO> {
  const token = await getStoredToken();
  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const form = new FormData();
  form.append('nome', payload.nome);
  if (payload.descricao != null && payload.descricao !== '') {
    form.append('descricao', payload.descricao);
  }
  form.append('preco', String(payload.preco));
  form.append('categoria', payload.categoria);
  form.append('disponivel', String(payload.disponivel));

  if (payload.fotoUri) {
    const type = payload.fotoMime ?? 'image/jpeg';
    form.append('foto', {
      uri: payload.fotoUri,
      name: 'foto.jpg',
      type,
    } as unknown as Blob);
  }

  const url = `${getApiBaseUrl()}/api/restaurantes/${restauranteId}/pratos`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = text;
  }

  if (!res.ok) {
    throw new Error(formatApiError(res.status, parsed));
  }

  return parsed as PratoResponseDTO;
}

export async function atualizarPrato(
  restauranteId: number,
  pratoId: number,
  payload: AtualizarPratoPayload
): Promise<PratoResponseDTO> {
  const token = await getStoredToken();
  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const form = new FormData();
  form.append('nome', payload.nome);
  if (payload.descricao != null && payload.descricao !== '') {
    form.append('descricao', payload.descricao);
  }
  form.append('preco', String(payload.preco));
  form.append('categoria', payload.categoria);
  form.append('disponivel', String(payload.disponivel));

  if (payload.fotoUri) {
    const type = payload.fotoMime ?? 'image/jpeg';
    form.append('foto', {
      uri: payload.fotoUri,
      name: 'foto.jpg',
      type,
    } as unknown as Blob);
  }

  const url = `${getApiBaseUrl()}/api/restaurantes/${restauranteId}/pratos/${pratoId}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = text;
  }

  if (!res.ok) {
    throw new Error(formatApiError(res.status, parsed));
  }

  return parsed as PratoResponseDTO;
}
