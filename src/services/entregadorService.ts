import type { EntregadorRequestDTO, EntregadorResponseDTO } from '../types/api';
import { publicApi } from './http';

export async function cadastrarEntregador(dto: EntregadorRequestDTO): Promise<EntregadorResponseDTO> {
  const { data } = await publicApi.post<EntregadorResponseDTO>('/api/entregadores', dto);
  return data;
}
