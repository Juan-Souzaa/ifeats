import { useCallback, useEffect, useState } from 'react';
import * as restauranteService from '../services/restauranteService';
import { extractErrorMessage } from '../utils/errors';

export function useRestauranteRaioViewModel() {
  const [id, setId] = useState<number | null>(null);
  const [raio, setRaio] = useState('5');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await restauranteService.buscarMeuRestaurante();
        setId(r.id);
        setRaio(r.raioEntregaKm != null ? String(r.raioEntregaKm) : '5');
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const salvar = useCallback(async (): Promise<boolean> => {
    if (!id) return false;
    setSubmitting(true);
    setError(null);
    try {
      await restauranteService.atualizarRaioEntrega(id, {
        raioEntregaKm: Number(raio.replace(',', '.')),
      });
      return true;
    } catch (e) {
      setError(extractErrorMessage(e));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [id, raio]);

  return { raio, setRaio, loading, submitting, error, salvar };
}
