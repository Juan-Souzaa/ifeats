import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { PedidoResponseDTO, StatusPedido } from '../types/api';
import * as pedidoService from '../services/pedidoService';

const POLL_MS = 15_000;

export function useRestaurantePedidosViewModel() {
  const [pedidos, setPedidos] = useState<PedidoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<StatusPedido | 'ALL'>('ALL');
  const filtroRef = useRef(filtro);
  filtroRef.current = filtro;

  const fetchPedidos = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const page = await pedidoService.listarPedidosRestaurante({
        status: filtroRef.current === 'ALL' ? undefined : filtroRef.current,
        size: 50,
      });
      setPedidos(page.content ?? []);
    } catch {
      if (!silent) {
        setError('Não foi possível carregar os pedidos.');
        setPedidos([]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPedidos(false);
  }, [filtro, fetchPedidos]);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => void fetchPedidos(true), POLL_MS);
      return () => clearInterval(interval);
    }, [fetchPedidos])
  );

  const refresh = useCallback(() => fetchPedidos(false), [fetchPedidos]);

  return { pedidos, loading, error, filtro, setFiltro, refresh };
}
