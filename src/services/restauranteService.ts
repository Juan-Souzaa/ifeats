import type {
  AtualizarRaioEntregaRequestDTO,
  AtualizarRestauranteRequestDTO,
  GanhosRestauranteDTO,
  PeriodoRelatorio,
  RestauranteBuscaDTO,
  RestauranteRequestDTO,
  RestauranteResponseDTO,
  SpringPage,
  StatusRestaurante,
} from '../types/api';
import { api, getApiBaseUrl, publicApi } from './http';
import { getStoredToken } from './tokenStorage';

export async function cadastrarRestaurante(
  dto: RestauranteRequestDTO
): Promise<RestauranteResponseDTO> {
  const { data } = await publicApi.post<RestauranteResponseDTO>('/api/restaurantes', dto);
  return data;
}

export async function buscarMeuRestaurante(): Promise<RestauranteResponseDTO> {
  const { data } = await api.get<RestauranteResponseDTO>('/api/restaurantes/me');
  return data;
}

export async function buscarRestaurantePorId(id: number): Promise<RestauranteResponseDTO> {
  const { data } = await api.get<RestauranteResponseDTO>(`/api/restaurantes/${id}`);
  return data;
}

export async function listarRestaurantes(
  page = 0,
  size = 20
): Promise<SpringPage<RestauranteResponseDTO>> {
  const { data } = await api.get<SpringPage<RestauranteResponseDTO>>('/api/restaurantes', {
    params: { page, size, sort: 'nome,asc' },
  });
  return data;
}

export async function buscarRestaurantes(
  cozinha?: string,
  page = 0,
  size = 20
): Promise<SpringPage<RestauranteBuscaDTO>> {
  const { data } = await api.get<SpringPage<RestauranteBuscaDTO>>('/api/restaurantes/busca', {
    params: { cozinha: cozinha || undefined, page, size },
  });
  return data;
}

export async function atualizarRestaurante(
  id: number,
  dto: AtualizarRestauranteRequestDTO
): Promise<RestauranteResponseDTO> {
  const { data } = await api.put<RestauranteResponseDTO>(`/api/restaurantes/${id}`, dto);
  return data;
}

export async function atualizarRaioEntrega(
  id: number,
  dto: AtualizarRaioEntregaRequestDTO
): Promise<RestauranteResponseDTO> {
  const { data } = await api.put<RestauranteResponseDTO>(
    `/api/restaurantes/${id}/raio-entrega`,
    dto
  );
  return data;
}

export async function listarRestaurantesPorStatus(
  status: StatusRestaurante,
  page = 0,
  size = 30
): Promise<SpringPage<RestauranteResponseDTO>> {
  const { data } = await api.get<SpringPage<RestauranteResponseDTO>>(
    `/api/restaurantes/status/${status}`,
    { params: { page, size } }
  );
  return data;
}

export async function desativarRestaurante(id: number): Promise<void> {
  await api.delete(`/api/restaurantes/${id}`);
}

export async function aprovarRestaurante(id: number): Promise<RestauranteResponseDTO> {
  const { data } = await api.patch<RestauranteResponseDTO>(`/api/restaurantes/${id}/aprovar`);
  return data;
}

export async function rejeitarRestaurante(id: number): Promise<RestauranteResponseDTO> {
  const { data } = await api.patch<RestauranteResponseDTO>(`/api/restaurantes/${id}/rejeitar`);
  return data;
}

export async function obterGanhosRestaurante(
  id: number,
  periodo: PeriodoRelatorio = 'MES'
): Promise<GanhosRestauranteDTO> {
  const { data } = await api.get<GanhosRestauranteDTO>(`/api/restaurantes/${id}/ganhos`, {
    params: { periodo },
  });
  return data;
}

export async function atualizarFotoRestaurante(
  restauranteId: number,
  fotoUri: string,
  fotoMime = 'image/jpeg'
): Promise<RestauranteResponseDTO> {
  const token = await getStoredToken();
  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const form = new FormData();
  form.append('foto', {
    uri: fotoUri,
    name: 'foto.jpg',
    type: fotoMime,
  } as unknown as Blob);

  const url = `${getApiBaseUrl()}/api/restaurantes/${restauranteId}/foto`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Erro HTTP ${res.status}`);
  }

  return (await res.json()) as RestauranteResponseDTO;
}
