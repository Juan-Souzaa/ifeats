import { useCallback, useEffect, useState } from 'react';
import type { EnderecoRequestDTO } from '../types/api';
import * as clienteService from '../services/clienteService';
import * as enderecoService from '../services/enderecoService';
import { useEnderecoViaCep } from './useEnderecoViaCep';
import { extractErrorMessage } from '../utils/errors';

const empty: EnderecoRequestDTO = {
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
};

export function useClienteEnderecoFormViewModel(enderecoId?: number) {
  const [endereco, setEndereco] = useState<EnderecoRequestDTO>(empty);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(Boolean(enderecoId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mergeCep = useCallback((p: Partial<EnderecoRequestDTO>) => {
    setEndereco((prev) => ({ ...prev, ...p }));
  }, []);

  const { cepBuscando, cepAviso } = useEnderecoViaCep(endereco.cep, mergeCep);

  useEffect(() => {
    (async () => {
      try {
        const me = await clienteService.buscarMeuCliente();
        setClienteId(me.id);
        if (enderecoId) {
          const list = await enderecoService.listarEnderecosCliente(me.id);
          const found = list.find((e) => e.id === enderecoId);
          if (found) {
            setEndereco({
              logradouro: found.logradouro,
              numero: found.numero,
              complemento: found.complemento ?? '',
              bairro: found.bairro,
              cidade: found.cidade,
              estado: found.estado,
              cep: found.cep,
              principal: found.principal ?? false,
            });
          }
        }
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [enderecoId]);

  const setField = useCallback((field: keyof EnderecoRequestDTO, value: string) => {
    setEndereco((prev) => ({ ...prev, [field]: value }));
  }, []);

  const salvar = useCallback(async (): Promise<boolean> => {
    if (!clienteId) return false;
    setSubmitting(true);
    setError(null);
    try {
      const dto: EnderecoRequestDTO = {
        ...endereco,
        cep: endereco.cep.replace(/\D/g, ''),
        estado: endereco.estado.toUpperCase().slice(0, 2),
      };
      if (enderecoId) {
        await enderecoService.atualizarEnderecoCliente(clienteId, enderecoId, dto);
      } else {
        await enderecoService.criarEnderecoCliente(clienteId, dto);
      }
      return true;
    } catch (e) {
      setError(extractErrorMessage(e));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [clienteId, endereco, enderecoId]);

  return {
    endereco,
    setField,
    loading,
    submitting,
    error,
    cepBuscando,
    cepAviso,
    salvar,
    isEdit: Boolean(enderecoId),
  };
}
