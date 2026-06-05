import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { TicketDetalhadoResponseDTO } from '../types/api';
import * as ticketService from '../services/ticketService';
import { extractErrorMessage } from '../utils/errors';

export function useClienteTicketDetalheViewModel(ticketId: number) {
  const [detalhe, setDetalhe] = useState<TicketDetalhadoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comentario, setComentario] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await ticketService.buscarTicketDetalhado(ticketId);
      setDetalhe(d);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const enviarComentario = useCallback(async () => {
    if (!comentario.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await ticketService.adicionarComentario(ticketId, { comentario: comentario.trim() });
      setComentario('');
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }, [ticketId, comentario, load]);

  return {
    detalhe,
    loading,
    submitting,
    error,
    comentario,
    setComentario,
    enviarComentario,
    refresh: load,
  };
}
