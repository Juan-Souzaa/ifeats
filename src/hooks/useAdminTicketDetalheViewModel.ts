import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { StatusTicket, TicketDetalhadoResponseDTO } from '../types/api';
import * as ticketService from '../services/ticketService';
import { extractErrorMessage } from '../utils/errors';

export function useAdminTicketDetalheViewModel(ticketId: number) {
  const [detalhe, setDetalhe] = useState<TicketDetalhadoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingComentario, setSubmittingComentario] = useState(false);
  const [atribuindo, setAtribuindo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comentario, setComentario] = useState('');
  const [resolucao, setResolucao] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDetalhe(await ticketService.buscarTicketDetalhado(ticketId));
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const atualizarStatus = useCallback(async (status: StatusTicket) => {
    try {
      await ticketService.atualizarStatusTicket(ticketId, status);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }, [ticketId, load]);

  const enviarComentario = useCallback(async () => {
    if (!comentario.trim()) return;
    setSubmittingComentario(true);
    setError(null);
    try {
      await ticketService.adicionarComentario(ticketId, {
        comentario: comentario.trim(),
        interno: false,
      });
      setComentario('');
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmittingComentario(false);
    }
  }, [ticketId, comentario, load]);

  const atribuir = useCallback(async (adminId: number) => {
    setAtribuindo(true);
    setError(null);
    try {
      await ticketService.atribuirTicket(ticketId, adminId);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setAtribuindo(false);
    }
  }, [ticketId, load]);

  const resolver = useCallback(async () => {
    if (!resolucao.trim()) return;
    try {
      await ticketService.resolverTicket(ticketId, resolucao.trim());
      setResolucao('');
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }, [ticketId, resolucao, load]);

  return {
    detalhe,
    loading,
    submittingComentario,
    atribuindo,
    error,
    comentario,
    setComentario,
    resolucao,
    setResolucao,
    atualizarStatus,
    enviarComentario,
    atribuir,
    resolver,
    refresh: load,
  };
}
