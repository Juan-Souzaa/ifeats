jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (cb: () => void | (() => void)) => {
      React.useEffect(() => cb(), [cb]);
    },
  };
});

jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('../../services/carrinhoService', () => ({
  atualizarQuantidade: jest.fn(),
  removerItem: jest.fn(),
}));

import * as carrinhoService from '../../services/carrinhoService';
import { useCart } from '../../context/CartContext';
import { useClienteCarrinhoViewModel } from '../useClienteCarrinhoViewModel';
import { actAsync, renderHook } from './hookTestUtils';
import { act } from 'react-test-renderer';

const refresh = jest.fn().mockResolvedValue(undefined);

describe('useClienteCarrinhoViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue({
      carrinho: { itens: [], total: 0 },
      refresh,
      restauranteId: 1,
      setRestauranteId: jest.fn(),
    });
  });

  it('carrega carrinho ao montar', async () => {
    const { result } = renderHook(() => useClienteCarrinhoViewModel());
    await actAsync(async () => {
      await Promise.resolve();
    });
    expect(refresh).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('atualiza quantidade do item', async () => {
    (carrinhoService.atualizarQuantidade as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useClienteCarrinhoViewModel());

    await actAsync(async () => {
      await result.current.alterarQuantidade(10, 3);
    });

    expect(carrinhoService.atualizarQuantidade).toHaveBeenCalledWith(10, 3);
    expect(refresh).toHaveBeenCalled();
  });
});
