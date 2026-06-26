import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { EntregadorResponseDTO, RestauranteResponseDTO } from '../types/api';
import * as restauranteService from '../services/restauranteService';
import * as entregadorService from '../services/entregadorService';
import { extractErrorMessage } from '../utils/errors';

export function useAdminRestaurantesPendentesViewModel() {
  const [items, setItems] = useState<RestauranteResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await restauranteService.listarRestaurantesPorStatus('PENDING_APPROVAL');
      setItems(page.content ?? []);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const aprovar = useCallback(async (id: number) => {
    setBusyId(id);
    try {
      await restauranteService.aprovarRestaurante(id);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }, [load]);

  const rejeitar = useCallback(async (id: number) => {
    setBusyId(id);
    try {
      await restauranteService.rejeitarRestaurante(id);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }, [load]);

  return { items, loading, error, busyId, aprovar, rejeitar, refresh: load };
}

export function useAdminEntregadoresPendentesViewModel() {
  const [items, setItems] = useState<EntregadorResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await entregadorService.listarEntregadoresPorStatus('PENDING_APPROVAL');
      setItems(page.content ?? []);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const aprovar = useCallback(async (id: number) => {
    setBusyId(id);
    try {
      await entregadorService.aprovarEntregador(id);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }, [load]);

  const rejeitar = useCallback(async (id: number) => {
    setBusyId(id);
    try {
      await entregadorService.rejeitarEntregador(id);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }, [load]);

  return { items, loading, error, busyId, aprovar, rejeitar, refresh: load };
}
