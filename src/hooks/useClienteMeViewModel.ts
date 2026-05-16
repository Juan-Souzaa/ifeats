import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { ClienteResponseDTO } from '../types/api';
import * as clienteService from '../services/clienteService';

export function useClienteMeViewModel() {
  const [data, setData] = useState<ClienteResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const me = await clienteService.buscarMeuCliente();
      setData(me);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  return { data, loading, refresh };
}
