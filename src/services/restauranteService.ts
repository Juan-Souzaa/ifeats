import type { RestauranteRequestDTO, RestauranteResponseDTO } from '../types/api';
import { api, publicApi } from './http';

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
