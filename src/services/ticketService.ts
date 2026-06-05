import type {
  SpringPage,
  StatusTicket,
  TicketComentarioRequestDTO,
  TicketComentarioResponseDTO,
  TicketDetalhadoResponseDTO,
  TicketRequestDTO,
  TicketResponseDTO,
  TipoTicket,
} from '../types/api';
import { api } from './http';

export async function criarTicket(dto: TicketRequestDTO): Promise<TicketResponseDTO> {
  const { data } = await api.post<TicketResponseDTO>('/api/tickets', dto);
  return data;
}

export async function listarMeusTickets(page = 0, size = 30): Promise<SpringPage<TicketResponseDTO>> {
  const { data } = await api.get<SpringPage<TicketResponseDTO>>('/api/tickets', {
    params: { page, size },
  });
  return data;
}

export async function buscarTicket(id: number): Promise<TicketResponseDTO> {
  const { data } = await api.get<TicketResponseDTO>(`/api/tickets/${id}`);
  return data;
}

export async function buscarTicketDetalhado(id: number): Promise<TicketDetalhadoResponseDTO> {
  const { data } = await api.get<TicketDetalhadoResponseDTO>(`/api/tickets/${id}/detalhes`);
  return data;
}

export async function adicionarComentario(
  ticketId: number,
  dto: TicketComentarioRequestDTO
): Promise<TicketComentarioResponseDTO> {
  const { data } = await api.post<TicketComentarioResponseDTO>(
    `/api/tickets/${ticketId}/comentarios`,
    dto
  );
  return data;
}

export async function atribuirTicket(ticketId: number, adminId: number): Promise<TicketResponseDTO> {
  const { data } = await api.patch<TicketResponseDTO>(
    `/api/tickets/${ticketId}/atribuir`,
    undefined,
    { params: { adminId } }
  );
  return data;
}

export async function atualizarStatusTicket(
  ticketId: number,
  status: StatusTicket
): Promise<TicketResponseDTO> {
  const { data } = await api.patch<TicketResponseDTO>(
    `/api/tickets/${ticketId}/status`,
    undefined,
    { params: { status } }
  );
  return data;
}

export async function resolverTicket(ticketId: number, resolucao: string): Promise<TicketResponseDTO> {
  const { data } = await api.post<TicketResponseDTO>(
    `/api/tickets/${ticketId}/resolver`,
    undefined,
    { params: { resolucao } }
  );
  return data;
}

export async function listarTodosTickets(page = 0, size = 30): Promise<SpringPage<TicketResponseDTO>> {
  const { data } = await api.get<SpringPage<TicketResponseDTO>>('/api/tickets/admin/todos', {
    params: { page, size },
  });
  return data;
}

export async function listarTicketsPorStatus(
  status: StatusTicket,
  page = 0,
  size = 30
): Promise<SpringPage<TicketResponseDTO>> {
  const { data } = await api.get<SpringPage<TicketResponseDTO>>('/api/tickets/admin/status', {
    params: { status, page, size },
  });
  return data;
}

export async function listarTicketsPorTipo(
  tipo: TipoTicket,
  page = 0,
  size = 30
): Promise<SpringPage<TicketResponseDTO>> {
  const { data } = await api.get<SpringPage<TicketResponseDTO>>('/api/tickets/admin/tipo', {
    params: { tipo, page, size },
  });
  return data;
}
