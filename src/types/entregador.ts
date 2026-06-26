import type { TipoVeiculo } from './common';

export type StatusEntregador = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export type DisponibilidadeEntregador = 'AVAILABLE' | 'UNAVAILABLE';

export interface EntregadorRequestDTO {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  fotoCnhUrl?: string;
  tipoVeiculo: TipoVeiculo;
  placaVeiculo: string;
  latitude: number;
  longitude: number;
  password: string;
}

export interface EntregadorResponseDTO {
  id: number;
  userId: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  fotoCnhUrl: string | null;
  tipoVeiculo: TipoVeiculo;
  placaVeiculo: string;
  status: StatusEntregador;
  disponibilidade: DisponibilidadeEntregador;
  latitude: number;
  longitude: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AtualizarEntregadorRequestDTO {
  nome?: string;
  telefone?: string;
  email?: string;
  tipoVeiculo?: TipoVeiculo;
  placaVeiculo?: string;
  latitude?: number;
  longitude?: number;
}
