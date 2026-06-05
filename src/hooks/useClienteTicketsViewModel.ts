import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { TicketResponseDTO } from '../types/api';
import * as ticketService from '../services/ticketService';
import { extractErrorMessage } from '../utils/errors';

export function useClienteTicketsViewModel() {
  const [tickets, setTickets] = useState<TicketResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await ticketService.listarMeusTickets();
      setTickets(page.content ?? []);
    } catch (e) {
      setError(extractErrorMessage(e));
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return { tickets, loading, error, refresh: load };
}
