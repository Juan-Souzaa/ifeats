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
export type StatusPedido =
  | 'CREATED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELED';

export type MetodoPagamento = 'CASH' | 'PIX' | 'CREDIT_CARD';

export type StatusPagamento =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'PAID'
  | 'CANCELED'
  | 'REFUSED'
  | 'REFUNDED';

export type TipoDesconto = 'PERCENTUAL' | 'VALOR_FIXO';

export type PeriodoRelatorio = 'HOJE' | 'SEMANA' | 'MES' | 'CUSTOMIZADO';
export interface EnderecoResponseDTO {
  id: number;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number | null;
  longitude: number | null;
  principal: boolean | null;
  criadoEm: string;
}
export interface CarrinhoItemRequestDTO {
  pratoId: number;
  quantidade: number;
}

export interface AplicarCupomRequestDTO {
  codigo: string;
}

export interface CupomInfoDTO {
  id: number;
  codigo: string;
  tipoDesconto: string;
  valorDesconto: number;
}

export interface CarrinhoItemResponseDTO {
  id: number;
  pratoId: number;
  pratoNome: string;
  pratoFotoUrl?: string | null;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface CarrinhoResponseDTO {
  id: number;
  clienteId: number;
  itens: CarrinhoItemResponseDTO[];
  cupom: CupomInfoDTO | null;
  subtotal: number;
  desconto: number;
  total: number;
  criadoEm: string;
  atualizadoEm: string;
}
export interface PedidoItemRequestDTO {
  pratoId: number;
  quantidade: number;
}

export interface PedidoItemResponseDTO {
  id: number;
  pratoId: number;
  pratoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface EntregadorSimplesDTO {
  id: number;
  nome: string;
}

export interface CoordinatesDTO {
  latitude: number;
  longitude: number;
}

export interface RastreamentoDTO {
  posicaoAtualLat: number | null;
  posicaoAtualLon: number | null;
  posicaoDestinoLat: number | null;
  posicaoDestinoLon: number | null;
  posicaoRestauranteLat: number | null;
  posicaoRestauranteLon: number | null;
  distanciaRestanteKm: number | null;
  tempoEstimadoMinutos: number | null;
  statusEntrega: StatusPedido | null;
  proximoAoDestino: boolean | null;
  waypoints?: CoordinatesDTO[] | null;
}

export interface PedidoRequestDTO {
  restauranteId: number;
  itens: PedidoItemRequestDTO[];
  metodoPagamento: MetodoPagamento;
  troco?: number | null;
  observacoes?: string | null;
  enderecoId?: number | null;
  carrinhoId?: number | null;
}

export interface PedidoResponseDTO {
  id: number;
  clienteId: number;
  clienteNome?: string | null;
  clienteTelefone?: string | null;
  restauranteId: number;
  status: StatusPedido;
  metodoPagamento: MetodoPagamento;
  troco: number | null;
  observacoes: string | null;
  enderecoEntrega: string | null;
  subtotal: number;
  taxaEntrega: number;
  total: number;
  itens: PedidoItemResponseDTO[];
  entregador: EntregadorSimplesDTO | null;
  tempoEstimadoEntrega: string | null;
  criadoEm: string;
  rastreamento?: RastreamentoDTO | null;
}
export interface CartaoCreditoRequestDTO {
  numero: string;
  nomeTitular: string;
  validade: string;
  cvv: string;
}

export interface PagamentoResponseDTO {
  id: number;
  pedidoId: number;
  metodo: MetodoPagamento;
  status: StatusPagamento;
  valor: number;
  troco: number | null;
  qrCode: string | null;
  qrCodeImageUrl: string | null;
  valorReembolsado: number | null;
  dataReembolso: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
export interface AvaliacaoRequestDTO {
  notaRestaurante: number;
  notaEntregador?: number | null;
  notaPedido: number;
  comentarioRestaurante?: string | null;
  comentarioEntregador?: string | null;
  comentarioPedido?: string | null;
}

export interface AvaliacaoResponseDTO {
  id: number;
  pedidoId: number;
  clienteId: number;
  restauranteId: number;
  entregadorId: number | null;
  notaRestaurante: number;
  notaEntregador: number | null;
  notaPedido: number;
  comentarioRestaurante: string | null;
  comentarioEntregador: string | null;
  comentarioPedido: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AvaliacaoResumoDTO {
  mediaNotaRestaurante: number;
  totalAvaliacoesRestaurante: number;
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
export interface GanhosRestauranteDTO {
  valorBruto: number;
  taxaPlataforma: number;
  percentualTaxa: number;
  valorLiquido: number;
  totalPedidos: number;
  periodo: string;
}

export interface GanhosEntregadorDTO {
  valorBruto: number;
  taxaPlataforma: number;
  percentualTaxa: number;
  valorLiquido: number;
  totalEntregas: number;
  periodo: string;
}

export interface GanhosPorEntregaDTO {
  pedidoId: number;
  taxaEntrega: number;
  taxaPlataforma: number;
  valorLiquido: number;
  dataEntrega: string;
}
export interface AvaliacaoRestauranteResponseDTO {
  id: number;
  pedidoId: number;
  clienteId: number;
  restauranteId: number;
  notaRestaurante: number;
  notaPedido: number;
  comentarioRestaurante: string | null;
  comentarioPedido: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
export interface AvaliacaoResumoEntregadorDTO {
  mediaNotaEntregador: number;
  totalAvaliacoesEntregador: number;
}

export interface AvaliacaoEntregadorResponseDTO {
  id: number;
  pedidoId: number;
  clienteId: number;
  entregadorId: number;
  notaEntregador: number;
  comentarioEntregador: string | null;
  criadoEm: string;
  atualizadoEm: string;
}
export interface EnderecoCepResponseDTO {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}
