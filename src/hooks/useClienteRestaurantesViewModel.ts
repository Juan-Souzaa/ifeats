import { useCallback, useState } from 'react';
import type { RestauranteResponseDTO } from '../types/api';
import * as restauranteService from '../services/restauranteService';

export function useClienteRestaurantesViewModel() {
  const [items, setItems] = useState<RestauranteResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    setError(null);
    const res = await restauranteService.listarRestaurantes(pageNum, 20);
    const lastIdx = res.totalElements === 0 ? 0 : Math.ceil(res.totalElements / res.size) - 1;
    setHasMore(pageNum < lastIdx);
    setPage(pageNum);
    if (append) {
      setItems((prev) => [...prev, ...res.content]);
    } else {
      setItems(res.content);
    }
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchPage(0, false);
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'response' in e
          ? String((e as { response?: { data?: unknown } }).response?.data ?? 'Erro ao listar')
          : 'Não foi possível carregar restaurantes.';
      setError(typeof msg === 'string' ? msg : 'Erro ao listar');
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await fetchPage(0, false);
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'response' in e
          ? String((e as { response?: { data?: unknown } }).response?.data ?? 'Erro ao listar')
          : 'Não foi possível atualizar.';
      setError(typeof msg === 'string' ? msg : 'Erro ao listar');
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchPage(page + 1, true);
    } catch {
      /* mantém itens já carregados */
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, page, hasMore, loadingMore]);

  return {
    items,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
    init,
    hasMore,
  };
}
