import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { PedidoResponseDTO, StatusPedido } from '../types/api';
import * as pedidoService from '../services/pedidoService';

export function useClientePedidosViewModel() {
  const [pedidos, setPedidos] = useState<PedidoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<StatusPedido | 'ALL'>('ALL');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await pedidoService.listarMeusPedidos({
        status: filtro === 'ALL' ? undefined : filtro,
        size: 50,
      });
      setPedidos(page.content ?? []);
    } catch {
      setError('Não foi possível carregar seus pedidos.');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return { pedidos, loading, error, filtro, setFiltro, refresh: load };
}
