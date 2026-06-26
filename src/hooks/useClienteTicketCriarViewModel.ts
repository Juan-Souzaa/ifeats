import { useCallback, useState } from 'react';
import type { PrioridadeTicket, TipoTicket } from '../types/api';
import * as ticketService from '../services/ticketService';
import { extractErrorMessage } from '../utils/errors';

export function useClienteTicketCriarViewModel() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<TipoTicket>('SUPORTE_TECNICO');
  const [prioridade, setPrioridade] = useState<PrioridadeTicket>('MEDIA');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criar = useCallback(async (): Promise<number | null> => {
    setSubmitting(true);
    setError(null);
    try {
      const t = await ticketService.criarTicket({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        tipo,
        prioridade,
      });
      return t.id;
    } catch (e) {
      setError(extractErrorMessage(e));
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [titulo, descricao, tipo, prioridade]);

  return {
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    tipo,
    setTipo,
    prioridade,
    setPrioridade,
    submitting,
    error,
    criar,
  };
}
