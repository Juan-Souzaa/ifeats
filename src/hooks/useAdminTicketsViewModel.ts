import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { StatusTicket, TicketResponseDTO, TipoTicket } from '../types/api';
import * as ticketService from '../services/ticketService';
import { extractErrorMessage } from '../utils/errors';

export type AdminTicketsStatusFiltro = StatusTicket | null;
export type AdminTicketsTipoFiltro = TipoTicket | null;

export function useAdminTicketsViewModel() {
  const [tickets, setTickets] = useState<TicketResponseDTO[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<AdminTicketsStatusFiltro>(null);
  const [tipoFiltro, setTipoFiltro] = useState<AdminTicketsTipoFiltro>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let page;
      if (tipoFiltro) {
        page = await ticketService.listarTicketsPorTipo(tipoFiltro);
      } else if (statusFiltro) {
        page = await ticketService.listarTicketsPorStatus(statusFiltro);
      } else {
        page = await ticketService.listarTodosTickets();
      }
      setTickets(page.content ?? []);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [statusFiltro, tipoFiltro]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return { tickets, loading, error, statusFiltro, setStatusFiltro, tipoFiltro, setTipoFiltro, refresh: load };
}
