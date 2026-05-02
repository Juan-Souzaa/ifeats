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