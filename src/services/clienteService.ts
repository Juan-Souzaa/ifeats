import type {
  AtualizarClienteRequestDTO,
  AtualizarSenhaRequestDTO,
  ClienteRequestDTO,
  ClienteResponseDTO,
  SpringPage,
} from '../types/api';
import { api, publicApi } from './http';

export async function cadastrarCliente(dto: ClienteRequestDTO): Promise<ClienteResponseDTO> {
  const { data } = await publicApi.post<ClienteResponseDTO>('/api/clientes', dto);
  return data;
}

export async function buscarMeuCliente(): Promise<ClienteResponseDTO> {
  const { data } = await api.get<ClienteResponseDTO>('/api/clientes/me');
  return data;
}

export async function buscarCliente(id: number): Promise<ClienteResponseDTO> {
  const { data } = await api.get<ClienteResponseDTO>(`/api/clientes/${id}`);
  return data;
}

export async function listarClientes(page = 0, size = 50): Promise<SpringPage<ClienteResponseDTO>> {
  const { data } = await api.get<SpringPage<ClienteResponseDTO>>('/api/clientes', {
    params: { page, size, sort: 'nome,asc' },
  });
  return data;
}

export async function atualizarSenhaCliente(id: number, dto: AtualizarSenhaRequestDTO): Promise<void> {
  await api.patch(`/api/clientes/${id}/senha`, dto);
}

export async function atualizarCliente(
  id: number,
  dto: AtualizarClienteRequestDTO
): Promise<ClienteResponseDTO> {
  const { data } = await api.put<ClienteResponseDTO>(`/api/clientes/${id}`, dto);
  return data;
}

export async function desativarCliente(id: number): Promise<void> {
  await api.delete(`/api/clientes/${id}`);
}

/** @deprecated Use desativarCliente — a API faz soft delete (ativo = false). */
export async function excluirCliente(id: number): Promise<void> {
  await desativarCliente(id);
}
