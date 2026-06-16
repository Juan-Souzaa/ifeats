import type { CategoriaMenu } from './common';
import type { EnderecoRequestDTO } from './endereco';

export type StatusRestaurante = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface RestauranteRequestDTO {
  nome: string;
  endereco: EnderecoRequestDTO;
  telefone: string;
  email: string;
  password: string;
  raioEntregaKm?: number;
}

export interface RestauranteResponseDTO {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  status: StatusRestaurante;
  ativo?: boolean;
  raioEntregaKm: number | null;
  fotoUrl: string | null;
  distanciaKm?: number | null;
  tempoEstimadoMinutos?: number | null;
  mediaAvaliacao?: number | null;
  totalAvaliacoes?: number | null;
  criadoEm: string;
}

export interface PratoResponseDTO {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  categoria: CategoriaMenu;
  disponivel: boolean | null;
  fotoUrl: string | null;
  restauranteId: number;
  criadoEm: string;
}

export interface AtualizarRestauranteRequestDTO {
  nome: string;
  telefone: string;
  email: string;
  raioEntregaKm?: number;
}

export interface AtualizarRaioEntregaRequestDTO {
  raioEntregaKm: number;
}

export interface RestauranteBuscaDTO {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  distanciaKm: number | null;
  tempoEstimadoMinutos: number | null;
  raioEntregaKm: number | null;
  fotoUrl: string | null;
  mediaAvaliacao: number | null;
  totalAvaliacoes: number | null;
}
