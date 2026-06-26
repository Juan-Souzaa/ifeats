import { useCallback, useState } from 'react';
import type { PedidoResponseDTO, StatusPedido } from '../types/api';
import * as pedidoService from '../services/pedidoService';
import { useAsyncFocusFetch } from './useAsyncFocusFetch';

export function useClientePedidosViewModel() {
  const [filtro, setFiltro] = useState<StatusPedido | 'ALL'>('ALL');

  const fetcher = useCallback(async () => {
    const page = await pedidoService.listarMeusPedidos({
      status: filtro === 'ALL' ? undefined : filtro,
      size: 50,
    });
    return page.content ?? [];
  }, [filtro]);

  const { data, loading, error, refresh } = useAsyncFocusFetch<PedidoResponseDTO[]>(fetcher, [filtro], {
    errorMessage: 'Não foi possível carregar seus pedidos.',
    initialData: [],
  });

  return { pedidos: data ?? [], loading, error, filtro, setFiltro, refresh };
}
