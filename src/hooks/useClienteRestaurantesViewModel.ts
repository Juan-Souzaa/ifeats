import { useCallback, useMemo, useState } from 'react';
import type { RestauranteBuscaDTO, RestauranteResponseDTO } from '../types/api';
import * as restauranteService from '../services/restauranteService';
import { cozinhaApiForCategoria, matchesCategory, type CatKey } from '../components/restaurante/categorias';

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

function filterBySearch(items: RestauranteResponseDTO[], searchQuery: string): RestauranteResponseDTO[] {
  const q = searchQuery.trim().toLowerCase();
  if (q.length < 2) {
    return items.filter((r) => !q || r.nome.toLowerCase().includes(q) || r.endereco.toLowerCase().includes(q));
  }
  return items;
}

export function useClienteRestaurantesViewModel() {
  const [items, setItems] = useState<RestauranteResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [catSelecionada, setCatSelecionada] = useState<CatKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      await fetchPage(0, false, cozinhaApiForCategoria(catSelecionada));
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e !== null && 'response' in e
          ? String((e as { response?: { data?: unknown } }).response?.data ?? 'Erro ao listar')
          : 'Não foi possível atualizar.';
      setError(typeof msg === 'string' ? msg : 'Erro ao listar');
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage, catSelecionada]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchPage(page + 1, true, cozinhaApiForCategoria(catSelecionada));
    } catch {
      /* mantém itens já carregados */
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, page, hasMore, loadingMore, catSelecionada]);

  const buscar = useCallback(
    async (termo: string) => {
      const q = termo.trim();
      if (!q) {
        await fetchPage(0, false, cozinhaApiForCategoria(catSelecionada));
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
    [fetchPage, catSelecionada]
  );

  const selecionarCategoria = useCallback(
    async (key: CatKey) => {
      setCatSelecionada(key);
      setSearchQuery('');
      setLoading(true);
      setError(null);
      try {
        await fetchPage(0, false, cozinhaApiForCategoria(key));
      } catch {
        setError('Não foi possível filtrar restaurantes.');
      } finally {
        setLoading(false);
      }
    },
    [fetchPage]
  );

  const filtrados = useMemo(() => {
    const out = items.filter((r) => matchesCategory(r, catSelecionada));
    return filterBySearch(out, searchQuery);
  }, [items, catSelecionada, searchQuery]);

  const destaqueItems = useMemo(() => {
    const aprovados = items.filter((r) => r.status === 'APPROVED' && matchesCategory(r, catSelecionada));
    const base = filterBySearch(aprovados, searchQuery);
    return base.slice(0, 6);
  }, [items, catSelecionada, searchQuery]);

  return {
    items,
    filtrados,
    destaqueItems,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
    init,
    hasMore,
    buscar,
    catSelecionada,
    searchQuery,
    setSearchQuery,
    selecionarCategoria,
  };
}
