import type { AtualizarSenhaRequestDTO, ClienteRequestDTO, ClienteResponseDTO } from '../types/api';
import { api, publicApi } from './http';

export async function cadastrarCliente(dto: ClienteRequestDTO): Promise<ClienteResponseDTO> {
  const { data } = await publicApi.post<ClienteResponseDTO>('/api/clientes', dto);
  return data;
}

export async function buscarMeuCliente(): Promise<ClienteResponseDTO> {
  const { data } = await api.get<ClienteResponseDTO>('/api/clientes/me');
  return data;
}

export async function atualizarSenhaCliente(id: number, dto: AtualizarSenhaRequestDTO): Promise<void> {
  await api.patch(`/api/clientes/${id}/senha`, dto);
}
