import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type {
  ConfiguracaoTaxaResponseDTO,
  PagamentoResponseDTO,
  PedidoResponseDTO,
  StatusTicket,
  TicketResponseDTO,
  TipoTicket,
  TipoTaxa,
  TicketDetalhadoResponseDTO,
} from '../types/api';
import * as adminService from '../services/adminService';
import * as ticketService from '../services/ticketService';
import * as pagamentoService from '../services/pagamentoService';
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

export function useAdminTaxasViewModel() {
  const [tipoTaxa, setTipoTaxa] = useState<TipoTaxa>('TAXA_RESTAURANTE');
  const [percentual, setPercentual] = useState('');
  const [historico, setHistorico] = useState<ConfiguracaoTaxaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const h = await adminService.listarHistoricoTaxas(tipoTaxa);
      setHistorico(h);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [tipoTaxa]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const criar = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      await adminService.criarConfiguracaoTaxa({
        tipoTaxa,
        percentual: Number(percentual.replace(',', '.')),
      });
      setPercentual('');
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }, [tipoTaxa, percentual, load]);

  return { tipoTaxa, setTipoTaxa, percentual, setPercentual, historico, loading, submitting, error, criar, refresh: load };
}

export type AdminTicketsStatusFiltro = StatusTicket | null;
export type AdminTicketsTipoFiltro = TipoTicket | null;

export function useAdminTicketsViewModel() {
  const [tickets, setTickets] = useState<TicketResponseDTO[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<AdminTicketsStatusFiltro>(null);
  const [tipoFiltro, setTipoFiltro] = useState<AdminTicketsTipoFiltro>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let page;
      if (tipoFiltro) {
        page = await ticketService.listarTicketsPorTipo(tipoFiltro);
      } else if (statusFiltro) {
        page = await ticketService.listarTicketsPorStatus(statusFiltro);
      } else {
        page = await ticketService.listarTodosTickets();
      }
      setTickets(page.content ?? []);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [statusFiltro, tipoFiltro]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return { tickets, loading, error, statusFiltro, setStatusFiltro, tipoFiltro, setTipoFiltro, refresh: load };
}

export function useAdminTicketDetalheViewModel(ticketId: number) {
  const [detalhe, setDetalhe] = useState<TicketDetalhadoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingComentario, setSubmittingComentario] = useState(false);
  const [atribuindo, setAtribuindo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comentario, setComentario] = useState('');
  const [resolucao, setResolucao] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDetalhe(await ticketService.buscarTicketDetalhado(ticketId));
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const atualizarStatus = useCallback(async (status: StatusTicket) => {
    try {
      await ticketService.atualizarStatusTicket(ticketId, status);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }, [ticketId, load]);

  const enviarComentario = useCallback(async () => {
    if (!comentario.trim()) return;
    setSubmittingComentario(true);
    setError(null);
    try {
      await ticketService.adicionarComentario(ticketId, {
        comentario: comentario.trim(),
        interno: false,
      });
      setComentario('');
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmittingComentario(false);
    }
  }, [ticketId, comentario, load]);

  const atribuir = useCallback(async (adminId: number) => {
    setAtribuindo(true);
    setError(null);
    try {
      await ticketService.atribuirTicket(ticketId, adminId);
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setAtribuindo(false);
    }
  }, [ticketId, load]);

  const resolver = useCallback(async () => {
    if (!resolucao.trim()) return;
    try {
      await ticketService.resolverTicket(ticketId, resolucao.trim());
      setResolucao('');
      await load();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }, [ticketId, resolucao, load]);

  return {
    detalhe,
    loading,
    submittingComentario,
    atribuindo,
    error,
    comentario,
    setComentario,
    resolucao,
    setResolucao,
    atualizarStatus,
    enviarComentario,
    atribuir,
    resolver,
    refresh: load,
  };
}

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
