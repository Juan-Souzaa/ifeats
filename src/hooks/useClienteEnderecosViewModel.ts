import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { EnderecoResponseDTO } from '../types/api';
import * as clienteService from '../services/clienteService';
import * as enderecoService from '../services/enderecoService';
import { extractErrorMessage } from '../utils/errors';

export function useClienteEnderecosViewModel() {
  const [enderecos, setEnderecos] = useState<EnderecoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await clienteService.buscarMeuCliente();
      setClienteId(me.id);
      const list = await enderecoService.listarEnderecosCliente(me.id);
      setEnderecos(list);
    } catch (e) {
      setError(extractErrorMessage(e));
      setEnderecos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const excluir = useCallback(
    async (enderecoId: number) => {
      if (!clienteId) return;
      setBusyId(enderecoId);
      try {
        await enderecoService.excluirEnderecoCliente(clienteId, enderecoId);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [clienteId, load]
  );

  const tornarPrincipal = useCallback(
    async (enderecoId: number) => {
      if (!clienteId) return;
      setBusyId(enderecoId);
      try {
        await enderecoService.definirEnderecoPrincipal(clienteId, enderecoId);
        await load();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusyId(null);
      }
    },
    [clienteId, load]
  );

  return { enderecos, loading, error, busyId, refresh: load, excluir, tornarPrincipal };
}
