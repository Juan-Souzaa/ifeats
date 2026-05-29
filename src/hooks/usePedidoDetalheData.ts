import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { ClienteResponseDTO, PagamentoResponseDTO, PedidoResponseDTO } from '../types/api';
import * as clienteService from '../services/clienteService';
import * as pagamentoService from '../services/pagamentoService';
import * as pedidoService from '../services/pedidoService';
import { extractErrorMessage } from '../utils/errors';

type Options = { buscarCliente?: boolean; buscarPagamento?: boolean };

export function usePedidoDetalheData(
  pedidoId: number,
  options: Options = { buscarCliente: true, buscarPagamento: true }
) {
  const [pedido, setPedido] = useState<PedidoResponseDTO | null>(null);
  const [pagamento, setPagamento] = useState<PagamentoResponseDTO | null>(null);
  const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await pedidoService.buscarPedido(pedidoId);
      setPedido(p);

      if (options.buscarPagamento !== false) {
        try {
          setPagamento(await pagamentoService.buscarPagamentoPorPedido(pedidoId));
        } catch {
          setPagamento(null);
        }
      } else {
        setPagamento(null);
      }

      if (options.buscarCliente !== false) {
        try {
          setCliente(await clienteService.buscarCliente(p.clienteId));
        } catch {
          setCliente(null);
        }
      } else {
        setCliente(null);
      }
    } catch (e) {
      setError(extractErrorMessage(e) || 'Pedido não encontrado.');
      setPedido(null);
      setPagamento(null);
      setCliente(null);
    } finally {
      setLoading(false);
    }
  }, [pedidoId, options.buscarCliente, options.buscarPagamento]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const setPedidoLocal = useCallback((p: PedidoResponseDTO) => {
    setPedido(p);
    setError(null);
  }, []);

  return { pedido, pagamento, cliente, loading, error, refresh: load, setPedidoLocal };
}
