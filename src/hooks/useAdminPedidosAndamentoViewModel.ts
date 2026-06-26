import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { PedidoResponseDTO } from '../types/api';
import * as adminService from '../services/adminService';
import { extractErrorMessage } from '../utils/errors';

export function useAdminPedidosAndamentoViewModel() {
  const [pedidos, setPedidos] = useState<PedidoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const page = await adminService.listarPedidosEmAndamento();
      setPedidos(page.content ?? []);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return { pedidos, loading, error, refresh: load };
}
