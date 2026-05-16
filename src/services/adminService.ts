import type { AdminRequestDTO, AdminResponseDTO, SpringPage } from '../types/api';
import { api } from './http';

export async function criarAdmin(dto: AdminRequestDTO): Promise<AdminResponseDTO> {
  const { data } = await api.post<AdminResponseDTO>('/api/admin/admins', dto);
  return data;
}


export async function listarAdmins(): Promise<AdminResponseDTO[]> {
  const { data } = await api.get<AdminResponseDTO[] | SpringPage<AdminResponseDTO>>('/api/admin/admins');
  if (Array.isArray(data)) return data;
  return data.content ?? [];
}
