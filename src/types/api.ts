export type CategoriaMenu = 'STARTER' | 'MAIN' | 'DRINK' | 'DESSERT';

export type StatusRestaurante = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface EnderecoRequestDTO {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal?: boolean;
}

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
  raioEntregaKm: number | null;
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

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
}


export type JwtRole =
  | 'ROLE_USER'
  | 'ROLE_ADMIN'
  | 'ROLE_RESTAURANTE'
  | 'ROLE_ENTREGADOR'
  | 'ROLE_CLIENTE';

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

export interface AtualizarSenhaRequestDTO {
  senhaAtual: string;
  novaSenha: string;
}

export interface AdminRequestDTO {
  username: string;
  password: string;
}

export interface AdminResponseDTO {
  id: number;
  username: string;
}

export type TipoVeiculo = 'MOTO' | 'CARRO' | 'BICICLETA' | 'OUTRO';

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
