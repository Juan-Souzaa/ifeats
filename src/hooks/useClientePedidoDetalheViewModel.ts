import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { AvaliacaoResponseDTO, PedidoResponseDTO } from '../types/api';
import * as pedidoService from '../services/pedidoService';
import * as avaliacaoService from '../services/avaliacaoService';

export function useClientePedidoDetalheViewModel(pedidoId: number) {
  const [pedido, setPedido] = useState<PedidoResponseDTO | null>(null);
  const [avaliacao, setAvaliacao] = useState<AvaliacaoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await pedidoService.buscarPedido(pedidoId);
      setPedido(p);
      if (p.status === 'DELIVERED') {
        try {
          const a = await avaliacaoService.buscarAvaliacaoPorPedido(pedidoId);
          setAvaliacao(a);
        } catch {
          setAvaliacao(null);
        }
      } else {
        setAvaliacao(null);
      }
    } catch {
      setError('Pedido não encontrado.');
      setPedido(null);
    } finally {
      setLoading(false);
    }
  }, [pedidoId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const cancelar = useCallback(async () => {
    setBusy(true);
    try {
      const p = await pedidoService.cancelarPedido(pedidoId);
      setPedido(p);
    } catch {
      setError('Não foi possível cancelar o pedido.');
    } finally {
      setBusy(false);
    }
  }, [pedidoId]);

  return { pedido, avaliacao, loading, busy, error, refresh: load, cancelar };
}
