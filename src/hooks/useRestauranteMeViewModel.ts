import { useCallback, useState } from 'react';
import type { RestauranteResponseDTO } from '../types/api';
import * as restauranteService from '../services/restauranteService';

export function useRestauranteMeViewModel() {
  const [data, setData] = useState<RestauranteResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const r = await restauranteService.buscarMeuRestaurante();
      setData(r);
      return r;
    } catch (e: unknown) {
      setData(null);
      setError('Não foi possível carregar o restaurante');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refresh };
}
