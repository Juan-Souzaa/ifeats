import type { EnderecoRequestDTO } from './endereco';

export interface ClienteRequestDTO {
  nome: string;
  email: string;
  telefone: string;
  endereco: EnderecoRequestDTO;
  password: string;
}

export interface ClienteResponseDTO {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string | null;
  ativo: boolean;
  criadoEm: string;
}

export interface AtualizarClienteRequestDTO {
  nome: string;
  email: string;
  telefone: string;
}

export interface AtualizarSenhaRequestDTO {
  senhaAtual: string;
  novaSenha: string;
}
