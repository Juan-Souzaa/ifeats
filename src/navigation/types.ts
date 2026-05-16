import type { PratoResponseDTO } from '../types/api';

export type RootStackParamList = {
  Login: undefined;
  RestauranteCadastro: undefined;
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
