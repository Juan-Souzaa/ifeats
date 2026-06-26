import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { GanhosEntregadorDTO, GanhosPorEntregaDTO, PeriodoRelatorio } from '../types/api';
import * as entregadorService from '../services/entregadorService';
import { extractErrorMessage } from '../utils/errors';

export function useEntregadorGanhosViewModel() {
  const [periodo, setPeriodo] = useState<PeriodoRelatorio>('MES');
  const [resumo, setResumo] = useState<GanhosEntregadorDTO | null>(null);
  const [entregas, setEntregas] = useState<GanhosPorEntregaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const e = await entregadorService.buscarMeuEntregador();
      const [g, list] = await Promise.all([
        entregadorService.obterGanhosEntregador(e.id, periodo),
        entregadorService.listarGanhosPorEntrega(e.id, periodo),
      ]);
      setResumo(g);
      setEntregas(list);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return { periodo, setPeriodo, resumo, entregas, loading, error, refresh: load };
}
