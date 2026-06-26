import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { DisponibilidadeEntregador, EntregadorResponseDTO, PedidoResponseDTO } from '../types/api';
import * as entregadorService from '../services/entregadorService';
import { extractErrorMessage } from '../utils/errors';

export function useEntregadorPedidosViewModel() {
  const [tab, setTab] = useState<'disponiveis' | 'ativas' | 'historico'>('disponiveis');
  const [perfil, setPerfil] = useState<EntregadorResponseDTO | null>(null);
  const [disponiveis, setDisponiveis] = useState<PedidoResponseDTO[]>([]);
  const [ativas, setAtivas] = useState<PedidoResponseDTO[]>([]);
  const [historico, setHistorico] = useState<PedidoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, d, a, h] = await Promise.all([
        entregadorService.buscarMeuEntregador(),
        entregadorService.listarPedidosDisponiveis(),
        entregadorService.listarEntregasAtivas(),
        entregadorService.listarHistoricoEntregas(),
      ]);
      setPerfil(p);
      setDisponiveis(d.content ?? []);
      setAtivas(a.content ?? []);
      setHistorico(h.content ?? []);
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

  const aceitar = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await entregadorService.aceitarPedido(id);
        setTab('ativas');
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  const recusar = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await entregadorService.recusarPedido(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  const saiuEntrega = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await entregadorService.marcarSaiuEntrega(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  const entregue = useCallback(
    async (id: number) => {
      setBusyId(id);
      try {
        await entregadorService.marcarComoEntregue(id);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  const lista =
    tab === 'disponiveis' ? disponiveis : tab === 'ativas' ? ativas : historico;

  return {
    tab,
    setTab,
    perfil,
    lista,
    loading,
    error,
    busyId,
    refresh: load,
    toggleDisponibilidade,
    aceitar,
    recusar,
    saiuEntrega,
    entregue,
  };
}
