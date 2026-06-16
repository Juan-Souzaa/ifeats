import type { TipoDesconto } from './common';

export interface CupomInfoDTO {
  id: number;
  codigo: string;
  tipoDesconto: string;
  valorDesconto: number;
}

export interface CupomRequestDTO {
  codigo: string;
  tipoDesconto: TipoDesconto;
  valorDesconto: number;
  valorMinimo: number;
  dataInicio: string;
  dataFim: string;
  usosMaximos: number;
}

export interface CupomResponseDTO {
  id: number;
  codigo: string;
  tipoDesconto: TipoDesconto;
  valorDesconto: number;
  valorMinimo: number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  usosMaximos: number;
  usosAtuais: number;
  criadoEm: string;
}
