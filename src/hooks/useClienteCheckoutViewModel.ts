import { useCallback, useEffect, useState } from 'react';
import type {
  CartaoCreditoRequestDTO,
  EnderecoResponseDTO,
  MetodoPagamento,
  PagamentoResponseDTO,
  PedidoResponseDTO,
} from '../types/api';
import * as clienteService from '../services/clienteService';
import * as enderecoService from '../services/enderecoService';
import * as pedidoService from '../services/pedidoService';
import * as pagamentoService from '../services/pagamentoService';
import { useCart } from '../context/CartContext';

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const data = (err as { response?: { data?: unknown } }).response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      const obj = data as { message?: string; detail?: string; fieldErrors?: string[] };
      if (Array.isArray(obj.fieldErrors) && obj.fieldErrors.length > 0) {
        return obj.fieldErrors.join('\n');
      }
      if (typeof obj.message === 'string' && obj.message.trim() && obj.message !== 'Dados inválidos') {
        return obj.message;
      }
      if (typeof obj.detail === 'string' && obj.detail.trim()) return obj.detail;
      if (typeof obj.message === 'string' && obj.message.trim()) return obj.message;
    }
  }
  return 'Não foi possível concluir o pedido. Tente novamente.';
}

export function useClienteCheckoutViewModel(restauranteId: number) {
  const { carrinho, refresh } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enderecos, setEnderecos] = useState<EnderecoResponseDTO[]>([]);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);
  const [metodo, setMetodo] = useState<MetodoPagamento>('PIX');
  const [troco, setTroco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeTitular, setNomeTitular] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [pedido, setPedido] = useState<PedidoResponseDTO | null>(null);
  const [pagamento, setPagamento] = useState<PagamentoResponseDTO | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await refresh();
      const me = await clienteService.buscarMeuCliente();
      const lista = await enderecoService.listarEnderecosCliente(me.id);
      setEnderecos(lista);
      const principal = lista.find((e) => e.principal) ?? lista[0];
      if (principal) setEnderecoId(principal.id);
    } catch {
      setError('Não foi possível carregar seus dados.');
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    void load();
  }, [load]);

  const montarCartao = (): CartaoCreditoRequestDTO | null => {
    if (metodo !== 'CREDIT_CARD') return null;
    return {
      numero: numeroCartao.replace(/\D/g, ''),
      nomeTitular: nomeTitular.trim(),
      validade: validade.trim(),
      cvv: cvv.replace(/\D/g, ''),
    };
  };

  const confirmar = useCallback(async (): Promise<{
    pedido: PedidoResponseDTO;
    pagamento: PagamentoResponseDTO;
  } | null> => {
    if (!carrinho?.id || !carrinho.itens?.length) {
      setError('Seu carrinho está vazio.');
      return null;
    }
    setSubmitting(true);
    setError(null);
    try {
      const itens = carrinho.itens.map((i) => ({
        pratoId: i.pratoId,
        quantidade: i.quantidade,
      }));
      const trocoNum =
        metodo === 'CASH' && troco.trim()
          ? Number(troco.replace(',', '.'))
          : undefined;
      const pedidoCriado = await pedidoService.criarPedido({
        restauranteId,
        itens,
        metodoPagamento: metodo,
        carrinhoId: carrinho.id,
        enderecoId: enderecoId ?? undefined,
        troco: trocoNum,
        observacoes: observacoes.trim() || undefined,
      });
      setPedido(pedidoCriado);
      const cartao = montarCartao();
      const pag = await pagamentoService.criarPagamento(pedidoCriado.id, cartao);
      setPagamento(pag);
      setStep(2);
      await refresh();
      return { pedido: pedidoCriado, pagamento: pag };
    } catch (e) {
      setError(extractErrorMessage(e));
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [
    carrinho,
    restauranteId,
    metodo,
    troco,
    observacoes,
    enderecoId,
    numeroCartao,
    nomeTitular,
    validade,
    cvv,
    refresh,
  ]);

  return {
    step,
    setStep,
    loading,
    submitting,
    error,
    carrinho,
    enderecos,
    enderecoId,
    setEnderecoId,
    metodo,
    setMetodo,
    troco,
    setTroco,
    observacoes,
    setObservacoes,
    numeroCartao,
    setNumeroCartao,
    nomeTitular,
    setNomeTitular,
    validade,
    setValidade,
    cvv,
    setCvv,
    pedido,
    pagamento,
    confirmar,
    refresh: load,
  };
}
