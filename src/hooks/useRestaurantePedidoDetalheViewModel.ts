import { useCallback, useState } from 'react';
import * as pedidoService from '../services/pedidoService';
import * as pagamentoService from '../services/pagamentoService';
import { extractErrorMessage } from '../utils/errors';
import { usePedidoDetalheData } from './usePedidoDetalheData';

export function useRestaurantePedidoDetalheViewModel(pedidoId: number) {
  const { pedido, pagamento, cliente, loading, error, refresh } = usePedidoDetalheData(pedidoId);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const runAction = useCallback(
    async (action: () => Promise<void>) => {
      setBusy(true);
      setActionError(null);
      try {
        await action();
        await refresh();
      } catch (e) {
        setActionError(extractErrorMessage(e));
      } finally {
        setBusy(false);
      }
    },
    [refresh]
  );

  const confirmar = useCallback(
    () => runAction(() => pedidoService.confirmarPedido(pedidoId).then(() => undefined)),
    [pedidoId, runAction]
  );

  const preparar = useCallback(
    () => runAction(() => pedidoService.marcarPedidoPreparando(pedidoId).then(() => undefined)),
    [pedidoId, runAction]
  );

  const cancelar = useCallback(
    () => runAction(() => pedidoService.cancelarPedidoRestaurante(pedidoId).then(() => undefined)),
    [pedidoId, runAction]
  );

  const reembolsar = useCallback(
    (motivo: string) =>
      runAction(() => pagamentoService.solicitarReembolso(pedidoId, { motivo }).then(() => undefined)),
    [pedidoId, runAction]
  );

  return {
    pedido,
    pagamento,
    cliente,
    loading,
    busy,
    error: actionError ?? error,
    refresh,
    confirmar,
    preparar,
    cancelar,
    reembolsar,
  };
}
