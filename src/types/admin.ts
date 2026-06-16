export interface AdminRequestDTO {
  username: string;
  password: string;
}

export interface AdminResponseDTO {
  id: number;
  username: string;
}

export interface RelatorioDistribuicaoDTO {
  volumeTotal: number;
  distribuicaoRestaurantes: number;
  distribuicaoEntregadores: number;
  distribuicaoPlataforma: number;
  periodo: string;
  tendencia: string;
}

export interface RelatorioCompletoDTO {
  totalVendas: number;
  totalPedidos: number;
  ticketMedio: number;
  taxaEntregaMedia: number;
  distribuicaoRestaurantes: number;
  distribuicaoEntregadores: number;
  taxaPlataforma: number;
  totalClientes: number;
  qtdRestaurantes: number;
  qtdEntregadores: number;
  pedidosPorCliente: number;
  taxaConversao: number;
  periodo: string;
  tendencia: string;
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

export type TipoTaxa = 'TAXA_RESTAURANTE' | 'TAXA_ENTREGADOR';

export interface ConfiguracaoTaxaRequestDTO {
  tipoTaxa: TipoTaxa;
  percentual: number;
}

export interface ConfiguracaoTaxaResponseDTO {
  id: number;
  tipoTaxa: TipoTaxa;
  percentual: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}
