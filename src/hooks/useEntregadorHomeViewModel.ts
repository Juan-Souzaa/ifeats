import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { DisponibilidadeEntregador, EntregadorResponseDTO } from '../types/api';
import * as entregadorService from '../services/entregadorService';
import { extractErrorMessage } from '../utils/errors';

export function useEntregadorHomeViewModel() {
  const [perfil, setPerfil] = useState<EntregadorResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await entregadorService.buscarMeuEntregador();
      setPerfil(p);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const toggleDisponibilidade = useCallback(async () => {
    if (!perfil) return;
    const next: DisponibilidadeEntregador =
      perfil.disponibilidade === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    try {
      const updated = await entregadorService.atualizarDisponibilidade(perfil.id, next);
      setPerfil(updated);
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }, [perfil]);

  return { perfil, loading, error, refresh, toggleDisponibilidade };
}
