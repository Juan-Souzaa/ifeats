import type { CupomRequestDTO, CupomResponseDTO, SpringPage } from '../types/api';
import { api, publicApi } from './http';

export async function listarCuponsDisponiveis(
  page = 0,
  size = 20
): Promise<SpringPage<CupomResponseDTO>> {
  const { data } = await api.get<SpringPage<CupomResponseDTO>>('/api/cupons/disponiveis', {
    params: { page, size },
  });
  return data;
}

export async function validarCupom(codigo: string): Promise<CupomResponseDTO> {
  const { data } = await publicApi.get<CupomResponseDTO>(`/api/cupons/${encodeURIComponent(codigo)}/validar`);
  return data;
}

export async function criarCupom(dto: CupomRequestDTO): Promise<CupomResponseDTO> {
  const { data } = await api.post<CupomResponseDTO>('/api/cupons', dto);
  return data;
}

export async function listarTodosCupons(page = 0, size = 50): Promise<SpringPage<CupomResponseDTO>> {
  const { data } = await api.get<SpringPage<CupomResponseDTO>>('/api/cupons/todos', {
    params: { page, size },
  });
  return data;
}

export async function ativarCupom(id: number): Promise<CupomResponseDTO> {
  const { data } = await api.patch<CupomResponseDTO>(`/api/cupons/${id}/ativar`);
  return data;
}

export async function desativarCupom(id: number): Promise<CupomResponseDTO> {
  const { data } = await api.patch<CupomResponseDTO>(`/api/cupons/${id}/desativar`);
  return data;
}

export async function atualizarCupom(id: number, dto: CupomRequestDTO): Promise<CupomResponseDTO> {
  const { data } = await api.put<CupomResponseDTO>(`/api/cupons/${id}`, dto);
  return data;
}
