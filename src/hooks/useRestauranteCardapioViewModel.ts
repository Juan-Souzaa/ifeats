import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CategoriaMenu, PratoResponseDTO, RestauranteResponseDTO } from '../types/api';
import * as pratoService from '../services/pratoService';
import * as restauranteService from '../services/restauranteService';

export function useRestauranteCardapioViewModel(restauranteId: number) {
  const [rest, setRest] = useState<RestauranteResponseDTO | null>(null);
  const [pratos, setPratos] = useState<PratoResponseDTO[]>([]);
  const [tab, setTab] = useState<CategoriaMenu>('STARTER');
  const [loading, setLoading] = useState(true);
  const tabAjustado = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    tabAjustado.current = false;
    try {
      const [r, p] = await Promise.all([
        restauranteService.buscarRestaurantePorId(restauranteId),
        pratoService.listarPratos(restauranteId, { size: 200 }),
      ]);
      setRest(r);
      setPratos(p.content ?? []);
    } catch {
      setRest(null);
      setPratos([]);
    } finally {
      setLoading(false);
    }
  }, [restauranteId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (tabAjustado.current || pratos.length === 0) return;
    const ordem: CategoriaMenu[] = ['STARTER', 'MAIN', 'DRINK', 'DESSERT'];
    const temNaAba = (k: CategoriaMenu) => pratos.some((p) => p.categoria === k);
    if (!temNaAba(tab)) {
      const primeira = ordem.find(temNaAba);
      if (primeira) setTab(primeira);
    }
    tabAjustado.current = true;
  }, [pratos, tab]);

  const filtered = useMemo(() => pratos.filter((x) => x.categoria === tab), [pratos, tab]);

  const contagemPorTab = useMemo(() => {
    const m: Record<CategoriaMenu, number> = {
      STARTER: 0,
      MAIN: 0,
      DRINK: 0,
      DESSERT: 0,
    };
    for (const p of pratos) {
      if (p.categoria in m) m[p.categoria]++;
    }
    return m;
  }, [pratos]);

  return {
    rest,
    pratos,
    tab,
    setTab,
    loading,
    load,
    filtered,
    contagemPorTab,
  };
}
