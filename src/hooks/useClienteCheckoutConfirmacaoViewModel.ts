import { useCallback, useEffect, useRef, useState } from 'react';
import type { MetodoPagamento, StatusPagamento } from '../types/api';
import * as pagamentoService from '../services/pagamentoService';

const TERMINAL: StatusPagamento[] = ['PAID', 'REFUSED', 'CANCELED', 'REFUNDED'];
const POLL_MS = 6000;

export function useClienteCheckoutConfirmacaoViewModel(
  pedidoId: number,
  metodoPagamento?: MetodoPagamento,
  initialStatus?: string | null
) {
  const [statusPagamento, setStatusPagamento] = useState<string | null>(initialStatus ?? null);
  const [polling, setPolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPix = metodoPagamento === 'PIX';
  const isPaid = statusPagamento === 'PAID';

  const check = useCallback(async () => {
    try {
      const p = await pagamentoService.buscarPagamentoPorPedido(pedidoId);
      setStatusPagamento(p.status);
      if (TERMINAL.includes(p.status)) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setPolling(false);
      }
    } catch {
      /* ignore transient errors during poll */
    }
  }, [pedidoId]);

  useEffect(() => {
    if (!isPix || initialStatus === 'PAID') return;
    setPolling(true);
    void check();
    timerRef.current = setInterval(() => void check(), POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPix, initialStatus, check]);

  return { statusPagamento, polling, isPaid, isPix };
}
