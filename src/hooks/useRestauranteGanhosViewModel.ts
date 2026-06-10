import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { GanhosRestauranteDTO, PeriodoRelatorio } from '../types/api';
import * as restauranteService from '../services/restauranteService';
import { extractErrorMessage } from '../utils/errors';

export function useRestauranteGanhosViewModel() {
  const [periodo, setPeriodo] = useState<PeriodoRelatorio>('MES');
  const [data, setData] = useState<GanhosRestauranteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await restauranteService.buscarMeuRestaurante();
      const g = await restauranteService.obterGanhosRestaurante(r.id, periodo);
      setData(g);
    } catch (e) {
      setError(extractErrorMessage(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return { periodo, setPeriodo, data, loading, error, refresh: load };
}
