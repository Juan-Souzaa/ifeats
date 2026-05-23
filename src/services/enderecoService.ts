import type { EnderecoCepResponseDTO, EnderecoRequestDTO, EnderecoResponseDTO } from '../types/api';
import { api } from './http';

export async function listarEnderecosCliente(clienteId: number): Promise<EnderecoResponseDTO[]> {
  const { data } = await api.get<EnderecoResponseDTO[]>(`/api/clientes/${clienteId}/enderecos`);
  return data;
}

export async function criarEnderecoCliente(
  clienteId: number,
  dto: EnderecoRequestDTO
): Promise<EnderecoResponseDTO> {
  const { data } = await api.post<EnderecoResponseDTO>(
    `/api/clientes/${clienteId}/enderecos`,
    dto
  );
  return data;
}

export async function atualizarEnderecoCliente(
  clienteId: number,
  enderecoId: number,
  dto: EnderecoRequestDTO
): Promise<EnderecoResponseDTO> {
  const { data } = await api.put<EnderecoResponseDTO>(
    `/api/clientes/${clienteId}/enderecos/${enderecoId}`,
    dto
  );
  return data;
}

export async function excluirEnderecoCliente(clienteId: number, enderecoId: number): Promise<void> {
  await api.delete(`/api/clientes/${clienteId}/enderecos/${enderecoId}`);
}

export async function definirEnderecoPrincipal(
  clienteId: number,
  enderecoId: number
): Promise<EnderecoResponseDTO> {
  const { data } = await api.patch<EnderecoResponseDTO>(
    `/api/clientes/${clienteId}/enderecos/${enderecoId}/principal`,
    undefined
  );
  return data;
}

export async function buscarCep(cep: string): Promise<EnderecoCepResponseDTO> {
  const digits = cep.replace(/\D/g, '');
  const { data } = await api.get<EnderecoCepResponseDTO>(`/api/cep/${digits}`);
  return data;
}

export async function listarEnderecosRestaurante(restauranteId: number): Promise<EnderecoResponseDTO[]> {
  const { data } = await api.get<EnderecoResponseDTO[]>(
    `/api/restaurantes/${restauranteId}/enderecos`
  );
  return data;
}

export async function criarEnderecoRestaurante(
  restauranteId: number,
  dto: EnderecoRequestDTO
): Promise<EnderecoResponseDTO> {
  const { data } = await api.post<EnderecoResponseDTO>(
    `/api/restaurantes/${restauranteId}/enderecos`,
    dto
  );
  return data;
}

export async function atualizarEnderecoRestaurante(
  restauranteId: number,
  enderecoId: number,
  dto: EnderecoRequestDTO
): Promise<EnderecoResponseDTO> {
  const { data } = await api.put<EnderecoResponseDTO>(
    `/api/restaurantes/${restauranteId}/enderecos/${enderecoId}`,
    dto
  );
  return data;
}
