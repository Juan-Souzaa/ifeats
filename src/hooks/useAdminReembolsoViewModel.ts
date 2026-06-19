import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { PagamentoResponseDTO } from '../types/api';
import * as pagamentoService from '../services/pagamentoService';
import { extractErrorMessage } from '../utils/errors';

export function useAdminReembolsoViewModel() {
  const [pedidoId, setPedidoId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [pagamento, setPagamento] = useState<PagamentoResponseDTO | null>(null);
  const [loadingPagamento, setLoadingPagamento] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const consultarPagamento = useCallback(async () => {
    const id = Number(pedidoId.trim());
    if (!id || id <= 0) {
      setError('Informe um ID de pedido válido.');
      return;
    }
    setLoadingPagamento(true);
    setError(null);
    setSuccessMessage(null);
    try {
      setPagamento(await pagamentoService.buscarPagamentoPorPedido(id));
    } catch (e) {
      setPagamento(null);
      setError(extractErrorMessage(e));
    } finally {
      setLoadingPagamento(false);
    }
  }, [pedidoId]);

  const solicitar = useCallback(async () => {
    const id = Number(pedidoId.trim());
    if (!id || id <= 0) {
      setError('Informe um ID de pedido válido.');
      return;
    }
    if (!motivo.trim()) {
      setError('Informe o motivo do reembolso.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const result = await pagamentoService.solicitarReembolso(id, { motivo: motivo.trim() });
      setPagamento(result);
      setSuccessMessage('Reembolso solicitado com sucesso.');
      setMotivo('');
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }, [pedidoId, motivo]);

  return {
    pedidoId,
    setPedidoId,
    motivo,
    setMotivo,
    pagamento,
    loadingPagamento,
    submitting,
    error,
    successMessage,
    consultarPagamento,
    solicitar,
  };
}
