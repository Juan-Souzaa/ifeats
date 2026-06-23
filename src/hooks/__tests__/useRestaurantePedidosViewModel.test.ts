jest.mock('../useAsyncFocusFetch', () => ({
  useAsyncFocusFetch: jest.fn((fetcher: () => Promise<unknown>) => {
    const React = require('react');
    const [data, setData] = React.useState<unknown>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
      let active = true;
      fetcher()
        .then((result) => {
          if (active) setData(result);
        })
        .catch(() => {
          if (active) setError('erro');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [fetcher]);

    return {
      data,
      loading,
      error,
      refresh: () => fetcher(),
    };
  }),
}));

jest.mock('../../services/pedidoService', () => ({
  listarPedidosRestaurante: jest.fn(),
}));

import * as pedidoService from '../../services/pedidoService';
import { useRestaurantePedidosViewModel } from '../useRestaurantePedidosViewModel';
import { actAsync, renderHook } from './hookTestUtils';

describe('useRestaurantePedidosViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (pedidoService.listarPedidosRestaurante as jest.Mock).mockResolvedValue({
      content: [{ id: 1, status: 'CREATED' }],
    });
  });

  it('carrega pedidos do restaurante', async () => {
    const { result } = renderHook(() => useRestaurantePedidosViewModel());
    await actAsync(async () => {
      await Promise.resolve();
    });
    expect(pedidoService.listarPedidosRestaurante).toHaveBeenCalled();
    expect(result.current.pedidos).toHaveLength(1);
    expect(result.current.loading).toBe(false);
  });
});
