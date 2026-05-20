import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { CupomResponseDTO } from '../types/api';
import * as carrinhoService from '../services/carrinhoService';
import * as cupomService from '../services/cupomService';
import { useCart } from '../context/CartContext';

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    const msg = res?.data?.message;
    if (typeof msg === 'string') return msg;
  }
  return 'Não foi possível concluir. Tente novamente.';
}

export function useClienteCarrinhoViewModel() {
  const { carrinho, refresh, restauranteId, setRestauranteId } = useCart();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cupomCodigo, setCupomCodigo] = useState('');
  const [cuponsDisponiveis, setCuponsDisponiveis] = useState<CupomResponseDTO[]>([]);
  const [modalCupons, setModalCupons] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await refresh();
    } catch {
      setError('Não foi possível carregar o carrinho.');
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const alterarQuantidade = useCallback(
    async (itemId: number, quantidade: number) => {
      if (quantidade < 1) return;
      setBusy(true);
      setError(null);
      try {
        await carrinhoService.atualizarQuantidade(itemId, quantidade);
        await refresh();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusy(false);
      }
    },
    [refresh]
  );

  const remover = useCallback(
    async (itemId: number) => {
      setBusy(true);
      setError(null);
      try {
        await carrinhoService.removerItem(itemId);
        await refresh();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusy(false);
      }
    },
    [refresh]
  );

  const aplicarCupom = useCallback(
    async (codigo?: string) => {
      const c = (codigo ?? cupomCodigo).trim();
      if (!c) {
        setError('Informe o código do cupom.');
        return;
      }
      setBusy(true);
      setError(null);
      try {
        await carrinhoService.aplicarCupom({ codigo: c });
        setCupomCodigo(c);
        setModalCupons(false);
        await refresh();
      } catch (e) {
        setError(extractErrorMessage(e));
      } finally {
        setBusy(false);
      }
    },
    [cupomCodigo, refresh]
  );

  const removerCupom = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await carrinhoService.removerCupom();
      setCupomCodigo('');
      await refresh();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  const abrirCupons = useCallback(async () => {
    setModalCupons(true);
    try {
      const page = await cupomService.listarCuponsDisponiveis();
      setCuponsDisponiveis(page.content ?? []);
    } catch {
      setCuponsDisponiveis([]);
    }
  }, []);

  return {
    carrinho,
    loading,
    busy,
    error,
    cupomCodigo,
    setCupomCodigo,
    cuponsDisponiveis,
    modalCupons,
    setModalCupons,
    restauranteId,
    setRestauranteId,
    refresh: load,
    alterarQuantidade,
    remover,
    aplicarCupom,
    removerCupom,
    abrirCupons,
  };
}
