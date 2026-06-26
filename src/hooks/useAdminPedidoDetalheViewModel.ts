import { usePedidoDetalheData } from './usePedidoDetalheData';

export function useAdminPedidoDetalheViewModel(pedidoId: number) {
  return usePedidoDetalheData(pedidoId);
}
