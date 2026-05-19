import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CarrinhoResponseDTO } from '../types/api';
import * as carrinhoService from '../services/carrinhoService';

type CartContextValue = {
  carrinho: CarrinhoResponseDTO | null;
  itemCount: number;
  restauranteId: number | null;
  setRestauranteId: (id: number | null) => void;
  refresh: () => Promise<void>;
  loading: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [carrinho, setCarrinho] = useState<CarrinhoResponseDTO | null>(null);
  const [restauranteId, setRestauranteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const c = await carrinhoService.obterCarrinho();
      setCarrinho(c);
      if (!c.itens?.length) {
        setRestauranteId(null);
      }
    } catch {
      setCarrinho(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const itemCount = useMemo(
    () => carrinho?.itens?.reduce((acc, i) => acc + i.quantidade, 0) ?? 0,
    [carrinho]
  );

  const value = useMemo(
    () => ({
      carrinho,
      itemCount,
      restauranteId,
      setRestauranteId,
      refresh,
      loading,
    }),
    [carrinho, itemCount, restauranteId, refresh, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return ctx;
}
