import type { PratoResponseDTO } from '../types/api';

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
};

export type ClienteStackParamList = {
  ClienteRestaurantes: undefined;
  ClientePerfil: undefined;
  ClienteMeusEnderecos: undefined;
  ClienteAlterarSenha: undefined;
  ClienteTickets: undefined;
  RestauranteCardapio: { restauranteId: number };
};

export type AdminStackParamList = {
  AdminCriar: undefined;
};

export type EntregadorStackParamList = {
  EntregadorArea: undefined;
};

export type MainTabParamList = {
  TabCliente: undefined;
  TabRestaurante: undefined;
  TabAdmin: undefined;
  TabEntregador: undefined;
};
