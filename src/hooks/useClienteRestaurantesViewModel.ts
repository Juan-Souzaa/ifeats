import { useCallback, useState } from 'react';

import type { RestauranteBuscaDTO, RestauranteResponseDTO } from '../types/api';

import * as restauranteService from '../services/restauranteService';



function mapBusca(b: RestauranteBuscaDTO): RestauranteResponseDTO {

  return {

    id: b.id,

    nome: b.nome,

    endereco: b.endereco,

    telefone: b.telefone,

    email: '',

    status: 'APPROVED',

    raioEntregaKm: b.raioEntregaKm,

    fotoUrl: b.fotoUrl ?? null,

    distanciaKm: b.distanciaKm ?? null,

    tempoEstimadoMinutos: b.tempoEstimadoMinutos ?? null,

    mediaAvaliacao: b.mediaAvaliacao ?? null,

    totalAvaliacoes: b.totalAvaliacoes ?? null,

    criadoEm: '',

  };

}



export function useClienteRestaurantesViewModel() {

  const [items, setItems] = useState<RestauranteResponseDTO[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);

  const [hasMore, setHasMore] = useState(true);



  const fetchPage = useCallback(async (pageNum: number, append: boolean, cozinha?: string) => {

    setError(null);

    const res = await restauranteService.buscarRestaurantes(cozinha, pageNum, 20);

    const lastIdx = res.totalElements === 0 ? 0 : Math.ceil(res.totalElements / res.size) - 1;

    setHasMore(pageNum < lastIdx);

    setPage(pageNum);

    const mapped = (res.content ?? []).map(mapBusca);

    if (append) {

      setItems((prev) => [...prev, ...mapped]);

    } else {

      setItems(mapped);

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



  const buscar = useCallback(
    async (termo: string, cozinha?: string) => {
      const q = termo.trim();
      if (!q) {
        await fetchPage(0, false, cozinha);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await fetchPage(0, false, q);
      } catch {
        setError('Não foi possível buscar restaurantes.');
      } finally {
        setLoading(false);
      }
    },
    [fetchPage]
  );

  const filterByCozinha = useCallback(
    async (cozinha?: string) => {
      setLoading(true);
      setError(null);
      try {
        await fetchPage(0, false, cozinha);
      } catch {
        setError('Não foi possível filtrar restaurantes.');
      } finally {
        setLoading(false);
      }
    },
    [fetchPage]
  );

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
    buscar,
    filterByCozinha,
  };

}

