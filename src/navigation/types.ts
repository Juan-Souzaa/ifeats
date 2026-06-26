import type { MetodoPagamento, PratoResponseDTO } from '../types/api';

export type GuestStackParamList = {
  Login: undefined;
  RestauranteCadastro: undefined;
  ClienteCadastro: undefined;
  EntregadorCadastro: undefined;
};

export type RestauranteStackParamList = {
  RestauranteHome: undefined;
  PratosList: undefined;
  PratoCadastro: undefined;
  PratoEditar: { prato: PratoResponseDTO };
  RestauranteCardapio: { restauranteId: number };
  RestauranteAvaliacoes: { restauranteId: number; restauranteNome?: string };
  RestaurantePedidos: undefined;
  RestaurantePedidoDetalhe: { pedidoId: number };
  RestauranteEditarPerfil: undefined;
  RestauranteRaioEntrega: undefined;
  RestauranteGanhos: undefined;
};

export type ClienteHomeStackParamList = {
  ClienteRestaurantes: undefined;
  ClientePerfil: undefined;
  ClienteMeusEnderecos: undefined;
  ClienteEnderecoForm: { enderecoId?: number };
  ClienteEditarPerfil: undefined;
  ClienteAlterarSenha: undefined;
  ClienteTickets: undefined;
  ClienteTicketCriar: undefined;
  ClienteTicketDetalhe: { ticketId: number };
  RestauranteCardapio: { restauranteId: number };
  RestauranteAvaliacoes: { restauranteId: number; restauranteNome?: string };
};

export type ClientePedidosStackParamList = {
  ClientePedidos: undefined;
  ClientePedidoDetalhe: { pedidoId: number };
  ClienteRastreamento: { pedidoId: number };
  ClienteAvaliarPedido: { pedidoId: number; restauranteId: number; avaliacaoId?: number };
};

export type ClienteCarrinhoStackParamList = {
  ClienteCarrinho: undefined;
  ClienteCheckout: { restauranteId: number };
  ClienteCheckoutConfirmacao: {
    pedidoId: number;
    total: number;
    metodoPagamento?: MetodoPagamento;
    qrCode?: string | null;
    qrCodeImageUrl?: string | null;
    statusPagamento?: string | null;
  };
};

export type ClienteTabParamList = {
  TabClienteInicio: undefined;
  TabClienteCarrinho: undefined;
  TabClientePedidos: undefined;
};

export type ClienteStackParamList = ClienteHomeStackParamList &
  ClientePedidosStackParamList &
  ClienteCarrinhoStackParamList;

export type AdminStackParamList = {
  AdminHome: undefined;
  AdminCriar: undefined;
  AdminCupons: undefined;
  AdminRelatorios: undefined;
  AdminRestaurantes: undefined;
  AdminEntregadores: undefined;
  AdminClientes: undefined;
  AdminRestaurantesPendentes: undefined;
  AdminEntregadoresPendentes: undefined;
  AdminPedidosAndamento: undefined;
  AdminPedidoDetalhe: { pedidoId: number };
  AdminReembolso: undefined;
  AdminTaxas: undefined;
  AdminTickets: undefined;
  AdminTicketDetalhe: { ticketId: number };
};

export type EntregadorPedidoModo = 'disponivel' | 'ativa' | 'historico';

export type EntregadorStackParamList = {
  EntregadorHome: undefined;
  EntregadorArea: undefined;
  EntregadorPedidoDetalhe: { pedidoId: number; modo: EntregadorPedidoModo };
  EntregadorPerfil: undefined;
  EntregadorGanhos: undefined;
};

export type MainTabParamList = {
  TabCliente: undefined;
  TabRestaurante: undefined;
  TabAdmin: undefined;
  TabEntregador: undefined;
};
