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
