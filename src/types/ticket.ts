export type TipoTicket = 'RECLAMACAO' | 'SUPORTE_TECNICO' | 'SUGESTAO';

export type StatusTicket = 'ABERTO' | 'EM_ANDAMENTO' | 'RESOLVIDO' | 'FECHADO';

export type PrioridadeTicket = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface TicketRequestDTO {
  titulo: string;
  descricao: string;
  tipo: TipoTicket;
  prioridade: PrioridadeTicket;
}

export interface TicketResponseDTO {
  id: number;
  titulo: string;
  descricao: string;
  tipo: TipoTicket;
  status: StatusTicket;
  prioridade: PrioridadeTicket;
  criadoPorId: number;
  criadoPorNome: string;
  atribuidoAId: number | null;
  atribuidoANome: string | null;
  criadoEm: string;
  atualizadoEm: string;
  resolvidoEm: string | null;
}

export interface TicketComentarioRequestDTO {
  comentario: string;
  interno?: boolean;
}

export interface TicketComentarioResponseDTO {
  id: number;
  ticketId: number;
  autorId: number;
  autorNome: string;
  comentario: string;
  interno: boolean;
  criadoEm: string;
}

export interface TicketDetalhadoResponseDTO {
  ticket: TicketResponseDTO;
  comentarios: TicketComentarioResponseDTO[];
}
