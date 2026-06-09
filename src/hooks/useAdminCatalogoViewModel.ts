import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type {
  ClienteResponseDTO,
  EntregadorResponseDTO,
  RestauranteResponseDTO,
  StatusEntregador,
  StatusRestaurante,
} from '../types/api';
import * as clienteService from '../services/clienteService';
import * as entregadorService from '../services/entregadorService';
import * as restauranteService from '../services/restauranteService';
import { extractErrorMessage } from '../utils/errors';

export type FiltroModeracao = 'ALL' | StatusRestaurante | StatusEntregador;

export function useAdminRestaurantesListViewModel() {
  const [filtro, setFiltro] = useState<FiltroModeracao>('ALL');
  const [items, setItems] = useState<RestauranteResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page =
        filtro === 'ALL'
          ? await restauranteService.listarRestaurantes(0, 100)
          : await restauranteService.listarRestaurantesPorStatus(filtro as StatusRestaurante, 0, 100);
      setItems(page.content ?? []);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const aprovar = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await restauranteService.aprovarRestaurante(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  const rejeitar = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await restauranteService.rejeitarRestaurante(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  const desativar = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await restauranteService.desativarRestaurante(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  return { items, loading, error, busyId, filtro, setFiltro, aprovar, rejeitar, desativar, refresh: load };
}

export function useAdminEntregadoresListViewModel() {
  const [filtro, setFiltro] = useState<FiltroModeracao>('ALL');
  const [items, setItems] = useState<EntregadorResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page =
        filtro === 'ALL'
          ? await entregadorService.listarEntregadores(0, 100)
          : await entregadorService.listarEntregadoresPorStatus(filtro as StatusEntregador, 0, 100);
      setItems(page.content ?? []);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const aprovar = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await entregadorService.aprovarEntregador(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  const rejeitar = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await entregadorService.rejeitarEntregador(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  const desativar = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await entregadorService.rejeitarEntregador(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  return { items, loading, error, busyId, filtro, setFiltro, aprovar, rejeitar, desativar, refresh: load };
}

export function useAdminClientesListViewModel() {
  const [items, setItems] = useState<ClienteResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await clienteService.listarClientes(0, 100);
      setItems(page.content ?? []);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const desativar = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await clienteService.desativarCliente(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  return { items, loading, error, busyId, desativar, refresh: load };
}
