import { useCallback, useState } from 'react';
import * as clienteService from '../services/clienteService';

function mensagemAmigavel(e: unknown): string {
  const resp = (e as { response?: { data?: Record<string, unknown> } })?.response?.data;
  if (resp && typeof resp.message === 'string') return resp.message;
  if (resp && typeof resp.detail === 'string') return resp.detail;
  return 'Não foi possível atualizar a senha. Confira os dados e tente de novo.';
}

export function useClienteAlterarSenhaViewModel() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submit = useCallback(
    async (clienteId: number) => {
      setError(null);
      setSuccessMessage(null);
      if (!senhaAtual) {
        setError('Informe a senha atual.');
        return false;
      }
      if (!novaSenha) {
        setError('Informe a nova senha.');
        return false;
      }
      if (novaSenha.length < 6 || novaSenha.length > 20) {
        setError('A nova senha deve ter entre 6 e 20 caracteres.');
        return false;
      }
      if (novaSenha !== confirmar) {
        setError('A confirmação não coincide com a nova senha.');
        return false;
      }
      setLoading(true);
      try {
        await clienteService.atualizarSenhaCliente(clienteId, {
          senhaAtual,
          novaSenha,
        });
        setSuccessMessage('Senha atualizada com sucesso.');
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmar('');
        return true;
      } catch (e: unknown) {
        setError(mensagemAmigavel(e));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [senhaAtual, novaSenha, confirmar]
  );

  return {
    senhaAtual,
    setSenhaAtual,
    novaSenha,
    setNovaSenha,
    confirmar,
    setConfirmar,
    loading,
    error,
    successMessage,
    submit,
  };
}
