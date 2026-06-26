import { useCallback, useEffect, useState } from 'react';
import * as clienteService from '../services/clienteService';
import { extractErrorMessage } from '../utils/errors';

export function useClienteEditarPerfilViewModel() {
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await clienteService.buscarMeuCliente();
        setClienteId(me.id);
        setNome(me.nome);
        setEmail(me.email);
        setTelefone(me.telefone);
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const salvar = useCallback(async (): Promise<boolean> => {
    if (!clienteId) return false;
    setSubmitting(true);
    setError(null);
    try {
      await clienteService.atualizarCliente(clienteId, { nome, email, telefone });
      return true;
    } catch (e) {
      setError(extractErrorMessage(e));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [clienteId, nome, email, telefone]);

  const excluirConta = useCallback(async (): Promise<boolean> => {
    if (!clienteId) return false;
    setSubmitting(true);
    setError(null);
    try {
      await clienteService.excluirCliente(clienteId);
      return true;
    } catch (e) {
      setError(extractErrorMessage(e));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [clienteId]);

  return {
    nome,
    setNome,
    email,
    setEmail,
    telefone,
    setTelefone,
    loading,
    submitting,
    error,
    salvar,
    excluirConta,
  };
}
