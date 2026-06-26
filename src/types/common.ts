export type CategoriaMenu = 'STARTER' | 'MAIN' | 'DRINK' | 'DESSERT';

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

export type TipoDesconto = 'PERCENTUAL' | 'VALOR_FIXO';

export type PeriodoRelatorio = 'HOJE' | 'SEMANA' | 'MES' | 'CUSTOMIZADO';

export type TipoVeiculo = 'MOTO' | 'CARRO' | 'BICICLETA' | 'OUTRO';
