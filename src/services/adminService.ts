import type {
  AdminRequestDTO,
  AdminResponseDTO,
  ConfiguracaoTaxaRequestDTO,
  ConfiguracaoTaxaResponseDTO,
  PedidoResponseDTO,
  SpringPage,
  TipoTaxa,
} from '../types/api';
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

export async function listarPedidosEmAndamento(
  page = 0,
  size = 30
): Promise<SpringPage<PedidoResponseDTO>> {
  const { data } = await api.get<SpringPage<PedidoResponseDTO>>('/api/admin/pedidos/andamento', {
    params: { page, size },
  });
  return data;
}

export async function criarConfiguracaoTaxa(
  dto: ConfiguracaoTaxaRequestDTO
): Promise<ConfiguracaoTaxaResponseDTO> {
  const { data } = await api.post<ConfiguracaoTaxaResponseDTO>('/api/admin/configuracoes/taxas', dto);
  return data;
}

export async function listarHistoricoTaxas(tipoTaxa: TipoTaxa): Promise<ConfiguracaoTaxaResponseDTO[]> {
  const { data } = await api.get<ConfiguracaoTaxaResponseDTO[]>('/api/admin/configuracoes/taxas', {
    params: { tipoTaxa },
  });
  return data;
}
