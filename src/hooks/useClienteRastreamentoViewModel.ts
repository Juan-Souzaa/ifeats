import { useCallback, useEffect, useState } from 'react';
import type { RastreamentoDTO } from '../types/api';
import * as pedidoService from '../services/pedidoService';

const POLL_MS = 15_000;

export function useClienteRastreamentoViewModel(pedidoId: number) {
  const [data, setData] = useState<RastreamentoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await pedidoService.obterRastreamento(pedidoId);
      setData(r);
      setError(null);
    } catch {
      setError('Rastreamento indisponível no momento.');
    } finally {
      setLoading(false);
    }
  }, [pedidoId]);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(t);
  }, [load]);

  return { data, loading, error, refresh: load };
}
