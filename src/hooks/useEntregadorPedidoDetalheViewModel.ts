import { useCallback, useState } from 'react';
import type { EntregadorPedidoModo } from '../navigation/types';
import * as entregadorService from '../services/entregadorService';
import { extractErrorMessage } from '../utils/errors';
import { usePedidoDetalheData } from './usePedidoDetalheData';

export function useEntregadorPedidoDetalheViewModel(pedidoId: number, modoInicial: EntregadorPedidoModo) {
  const { pedido, loading, error, refresh, setPedidoLocal } = usePedidoDetalheData(pedidoId, {
    buscarCliente: false,
    buscarPagamento: false,
  });
  const [modo, setModo] = useState<EntregadorPedidoModo>(modoInicial);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const runAction = useCallback(
    async (action: () => Promise<void>, onSuccess?: () => void) => {
      setBusy(true);
      setActionError(null);
      try {
        await action();
        onSuccess?.();
        await refresh();
      } catch (e) {
        setActionError(extractErrorMessage(e));
      } finally {
        setBusy(false);
      }
    },
    [refresh]
  );

  const aceitar = useCallback(
    () =>
      runAction(async () => {
        const updated = await entregadorService.aceitarPedido(pedidoId);
        setPedidoLocal(updated);
        setModo('ativa');
      }),
    [pedidoId, runAction, setPedidoLocal]
  );

  const recusar = useCallback(
    () => runAction(() => entregadorService.recusarPedido(pedidoId).then(() => undefined)),
    [pedidoId, runAction]
  );

  const saiuEntrega = useCallback(
    () =>
      runAction(async () => {
        const updated = await entregadorService.marcarSaiuEntrega(pedidoId);
        setPedidoLocal(updated);
      }),
    [pedidoId, runAction, setPedidoLocal]
  );

  const entregue = useCallback(
    () =>
      runAction(async () => {
        const updated = await entregadorService.marcarComoEntregue(pedidoId);
        setPedidoLocal(updated);
      }),
    [pedidoId, runAction, setPedidoLocal]
  );

  return {
    pedido,
    modo,
    loading,
    busy,
    error: actionError ?? error,
    refresh,
    aceitar,
    recusar,
    saiuEntrega,
    entregue,
  };
}
