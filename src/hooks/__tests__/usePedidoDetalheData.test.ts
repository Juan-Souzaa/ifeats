jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (cb: () => void | (() => void)) => {
      React.useEffect(() => cb(), [cb]);
    },
  };
});

jest.mock('../../services/pedidoService', () => ({
  buscarPedido: jest.fn(),
}));

jest.mock('../../services/pagamentoService', () => ({
  buscarPagamentoPorPedido: jest.fn(),
}));

jest.mock('../../services/clienteService', () => ({
  buscarCliente: jest.fn(),
}));

import * as pedidoService from '../../services/pedidoService';
import { usePedidoDetalheData } from '../usePedidoDetalheData';
import { actAsync, renderHook } from './hookTestUtils';

describe('usePedidoDetalheData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (pedidoService.buscarPedido as jest.Mock).mockResolvedValue({
      id: 10,
      clienteId: 2,
      status: 'CONFIRMED',
    });
  });

  it('carrega pedido por id', async () => {
    const { result } = renderHook(() =>
      usePedidoDetalheData(10, { buscarCliente: false, buscarPagamento: false })
    );
    await actAsync(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(pedidoService.buscarPedido).toHaveBeenCalledWith(10);
    expect(result.current.pedido?.id).toBe(10);
    expect(result.current.loading).toBe(false);
  });
});
