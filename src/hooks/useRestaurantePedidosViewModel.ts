import { useCallback, useState } from 'react';
import type { PedidoResponseDTO, StatusPedido } from '../types/api';
import * as pedidoService from '../services/pedidoService';
import { useAsyncFocusFetch } from './useAsyncFocusFetch';

const POLL_MS = 15_000;

export function useRestaurantePedidosViewModel() {
  const [filtro, setFiltro] = useState<StatusPedido | 'ALL'>('ALL');

  const fetcher = useCallback(async () => {
    const page = await pedidoService.listarPedidosRestaurante({
      status: filtro === 'ALL' ? undefined : filtro,
      size: 50,
    });
    return page.content ?? [];
  }, [filtro]);

  const { data, loading, error, refresh } = useAsyncFocusFetch<PedidoResponseDTO[]>(fetcher, [filtro], {
    errorMessage: 'Não foi possível carregar os pedidos.',
    initialData: [],
    pollIntervalMs: POLL_MS,
  });

  return { pedidos: data ?? [], loading, error, filtro, setFiltro, refresh };
}
